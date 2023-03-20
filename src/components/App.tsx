import { css } from '@emotion/react';
import { signInAnonymously } from 'firebase/auth';
import { get, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { getAuth, getDatabase } from '../firebaseConfig';
import { Page } from '../model/Page';
import { Editor } from './Editor/Editor';

async function loadOrCreateInitialPage() {
    const searchParams = new URLSearchParams(location.search);
    const pageId = searchParams.get('page');
    if (pageId === null) {
        const page = Page.create();
        searchParams.set('page', page.id);
        history.replaceState({}, '', '?' + searchParams.toString());
        return page;
    } else {
        const db = getDatabase();
        const pageRef = ref(db, `page/${pageId}`);
        const snapshot = await get(pageRef);
        const page = snapshot.val();
        if (page === null) {
            const page = Page.create();
            searchParams.set('page', page.id);
            history.replaceState({}, '', '?' + searchParams.toString());
            return page;
        } else {
            return page;
        }
    }
}

export const App = () => {
    const [initialPage, setInitialPage] = useState<Page | null>(null);

    useEffect(() => {
        (async () => {
            await signInAnonymously(getAuth());
            loadOrCreateInitialPage().then((page) => setInitialPage(page));
        })();
    }, []);

    return (
        <div
            css={css`
                position: fixed;
                inset: 0;
            `}
        >
            {initialPage === null ? <span>Loading...</span> : <Editor defaultValue={initialPage} />}
        </div>
    );
};
