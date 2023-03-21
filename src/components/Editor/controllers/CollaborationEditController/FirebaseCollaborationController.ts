import * as firebaseAuth from 'firebase/auth';
import * as firebaseDB from 'firebase/database';
import { onValue, ref } from 'firebase/database';
import { getAuth, getDatabase } from '../../../../firebaseConfig';
import { Page } from '../../../../model/Page';
import { User } from '../../model/User';
import { CollaborationController } from './CollaborationController';

export class FirebaseCollaborationController implements CollaborationController {
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

    addUpdateListener(pageId: string, callback: (page: Page) => void) {
        const db = getDatabase();
        const pageRef = ref(db, `page/${pageId}`);
        onValue(pageRef, (snapshot) => {
            const nextPage = snapshot.val() as Page | null;
            if (nextPage === null) return;
            callback(nextPage);
        });
    }

    removeUpdateListener(pageId: string, callback: (page: Page) => void) {
        throw new Error('Not implemented yet');
    }

    private async getOrAuthUser(): Promise<User> {
        const auth = getAuth();

        const credential = await firebaseAuth.signInAnonymously(auth);

        return {
            id: credential.user.uid,
        };
    }
}
