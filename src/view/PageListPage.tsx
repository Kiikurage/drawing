import { css } from '@linaria/core';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppController } from './App/AppControllerContext';
import { COLOR_SELECTION } from './styles';

export const PageListPage = () => {
    const controller = useAppController();

    const [history, setHistory] = useState<string[]>([]);
    useEffect(() => {
        controller.loadHistory().then(setHistory);
    }, [controller]);

    return (
        <div
            className={css`
                padding: 0 32px;
            `}
        >
            <div
                className={css`
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                `}
            >
                <h2>編集したページの一覧</h2>
                <Link
                    to="/edit"
                    className={css`
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 0 16px;
                        min-height: 40px;
                        border-radius: 8px;
                        background: ${COLOR_SELECTION};
                        color: #fff;
                        text-decoration: none;
                        font-size: 18px;
                    `}
                >
                    <span>新規作成</span>
                </Link>
            </div>
            <div
                className={css`
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                    gap: 4px;
                    padding: 0;
                    margin: 0;
                    list-style: none;
                `}
            >
                {history.map((pageId) => (
                    <Link
                        key={pageId}
                        to={`/edit?page=${pageId}`}
                        className={css`
                            display: block;
                            text-decoration: none;
                            color: unset;
                        `}
                    >
                        <li
                            className={css`
                                padding: 8px 8px;
                                min-height: 36px;
                                box-sizing: border-box;
                                display: flex;
                                align-items: center;
                                justify-content: flex-start;
                                border-radius: 12px;
                                background: none;
                                border: none;
                                cursor: pointer;
                                transition: background-color 160ms;
                                pointer-events: all;
                                user-select: none;

                                &:hover {
                                    background: rgba(0, 0, 0, 0.1);
                                }

                                &[aria-pressed='true'] {
                                    color: #fff;
                                    background: ${COLOR_SELECTION};
                                }
                            `}
                        >
                            {pageId}
                        </li>
                    </Link>
                ))}
                {history.length === 0 && <span>アイテムがありません</span>}
            </div>
        </div>
    );
};
