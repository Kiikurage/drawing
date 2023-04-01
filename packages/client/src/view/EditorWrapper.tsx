import { useEffect, useState } from 'react';
import { Page } from '@drawing/common';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppController } from './App/AppControllerContext';
import { css } from '@linaria/core';
import { Editor } from './Editor/Editor';

export const EditorWrapper = () => {
    const [initialPage, setInitialPage] = useState<Page | null>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const controller = useAppController();

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
            className={css`
                position: fixed;
                inset: 0;
            `}
        >
            {initialPage === null && <span>Loading...</span>}

            {initialPage !== null && (
                <>
                    <Editor defaultValue={initialPage} />
                    <div
                        className={css`
                            user-select: none;
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
