import { Navigate, RouteObject } from 'react-router-dom';
import { AppShell } from './AppShell';
import { EditorPage } from './EditorPage';
import { PageListPage } from './PageListPage';

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <AppShell />,
        children: [
            {
                path: 'edit',
                element: <EditorPage />,
            },
            {
                path: 'list',
                element: <PageListPage />,
            },
            {
                index: true,
                element: <Navigate to="/edit" replace={true} />,
            },
        ],
    },
];
