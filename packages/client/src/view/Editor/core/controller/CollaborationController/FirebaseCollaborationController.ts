import * as firebaseAuth from 'firebase/auth';
import * as firebaseDB from 'firebase/database';
import { get, ref, set } from 'firebase/database';
import { getAuth, getDatabase } from '../../../../../config/firebaseConfig';
import { CRDTPageAction, Page, User } from '@drawing/common';
import { CollaborationController } from './CollaborationController';

export class FirebaseCollaborationController implements CollaborationController {
    async dispatchActions(pageId: string, actions: CRDTPageAction[]) {
        const db = getDatabase();
        const actionsRef = firebaseDB.ref(db, `actions/${pageId}`);

        for (const action of actions) {
            const actionRef = firebaseDB.push(actionsRef);
            set(actionRef, action);
        }
    }

    addActionListener(pageId: string, callback: (action: CRDTPageAction) => void) {
        const db = getDatabase();
        const actionsRef = firebaseDB.ref(db, `actions/${pageId}`);

        firebaseDB.onChildAdded(actionsRef, (data) => {
            const action: CRDTPageAction = data.val();
            callback(action);
        });
    }

    removeActionListener() {
        throw new Error('Not implemented yet');
    }

    async savePage(page: Page): Promise<void> {
        const user = await this.getOrAuthUser();
        const db = getDatabase();

        const pageRef = firebaseDB.ref(db, `page/${page.id}`);
        await firebaseDB.set(pageRef, page);

        const historyRef = firebaseDB.ref(db, `history/${user.id}`);
        const prevHistory = (await firebaseDB.get(historyRef)).val() as string[] | null;
        if (!prevHistory?.includes(page.id)) {
            const nextHistory = [...(prevHistory ?? []), page.id];
            await firebaseDB.set(historyRef, nextHistory);
        }
    }

    async loadPage(pageId: string): Promise<Page | null> {
        await this.getOrAuthUser();

        const db = getDatabase();
        const pageRef = ref(db, `page/${pageId}`);
        const snapshot = await get(pageRef);
        return snapshot.val() as Page | null;
    }

    private async getOrAuthUser(): Promise<User> {
        const auth = getAuth();

        const credential = await firebaseAuth.signInAnonymously(auth);

        return {
            id: credential.user.uid,
        };
    }
}
