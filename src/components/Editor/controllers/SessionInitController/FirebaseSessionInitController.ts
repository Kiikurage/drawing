import { signInAnonymously } from 'firebase/auth';
import { get, ref } from 'firebase/database';
import { getAuth, getDatabase } from '../../../../firebaseConfig';
import { Page } from '../../../../model/Page';
import { SessionInitController } from './SessionInitController';

export class FirebaseSessionInitController implements SessionInitController {
    async loadOrCreatePage(pageId?: string): Promise<Page> {
        await signInAnonymously(getAuth());

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
}
