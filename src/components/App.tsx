import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Page } from '../model/Page';
import { Editor } from './Editor/Editor';
import { useSessionInitController } from './SessionInitControllerContext';

export const App = () => {
    const [initialPage, setInitialPage] = useState<Page | null>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const controller = useSessionInitController();

    useEffect(() => {
        if (initialPage !== null) return;

        const searchParams = new URLSearchParams(location.search);
        const pageIdInUrl = searchParams.get('page') ?? undefined;
        controller.loadOrCreatePage(pageIdInUrl).then(setInitialPage);
    }, [controller, initialPage, location.search, navigate]);

    useEffect(() => {
        if (initialPage === null) return;
        const searchParams = new URLSearchParams(location.search);
        const pageIdInUrl = searchParams.get('page') ?? undefined;

        if (pageIdInUrl !== initialPage.id) {
            searchParams.set('page', initialPage.id);
            navigate(
                {
                    search: searchParams.toString(),
                },
                { replace: true }
            );
        }
    }, [initialPage, location.search, navigate]);

    return (
        <div
            css={css`
                position: fixed;
                inset: 0;
            `}
        >
            {initialPage === null && <span>Loading...</span>}

            {initialPage !== null && (
                <>
                    <Editor defaultValue={initialPage} />
                    <div
                        css={css`
                            position: fixed;
                            top: 0;
                            left: 0;
                            background: rgba(255, 255, 255, 0.7);
                            padding: 8px 16px;
                        `}
                    >
                        <Link to="/list">ページ一覧へ</Link>
                    </div>
                </>
            )}
        </div>
    );
};
