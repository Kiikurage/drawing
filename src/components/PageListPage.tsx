import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSessionInitController } from './SessionInitControllerContext';

export const PageListPage = () => {
    const controller = useSessionInitController();

    const [history, setHistory] = useState<string[]>([]);
    useEffect(() => {
        controller.loadHistory().then(setHistory);
    }, [controller]);

    return (
        <div>
            <Link to="/edit">新規作成</Link>
            <h1>編集したページの一覧</h1>
            <ul>
                {history.map((pageId) => (
                    <Link key={pageId} to={`/edit?page=${pageId}`}>
                        <li>{pageId}</li>
                    </Link>
                ))}
                {history.length === 0 && <span>アイテムがありません</span>}
            </ul>
        </div>
    );
};
