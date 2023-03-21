import * as firebaseAuth from 'firebase/auth';
import { get, ref } from 'firebase/database';
import { getAuth, getDatabase } from '../../../../firebaseConfig';
import { Page } from '../../../../model/Page';
import { User } from '../../model/User';
import { SessionInitController } from './SessionInitController';

export class FirebaseSessionInitController implements SessionInitController {
    async loadOrCreatePage(pageId?: string): Promise<Page> {
        await this.getOrAuthUser();

        if (pageId === undefined) {
            return Page.create();
        }

        const db = getDatabase();
        const pageRef = ref(db, `page/${pageId}`);
        const snapshot = await get(pageRef);
        const page = snapshot.val();
        if (page !== null) {
            return page;
        }

        return Page.create();
    }

    async loadHistory(): Promise<string[]> {
        const user = await this.getOrAuthUser();

        const db = getDatabase();
        const historyRef = ref(db, `history/${user.id}`);
        const snapshot = await get(historyRef);
        const history = snapshot.val() as string[] | null;

        return history ?? [];
    }

    private async getOrAuthUser(): Promise<User> {
        const auth = getAuth();

        const credential = await firebaseAuth.signInAnonymously(auth);

        return {
            id: credential.user.uid,
        };
    }
}
