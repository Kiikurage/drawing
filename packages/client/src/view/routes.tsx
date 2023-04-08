import { Navigate, RouteObject } from 'react-router-dom';
import { AppShell } from './AppShell';
import { EditorPage } from './EditorPage';

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
                index: true,
                element: <Navigate to="/edit" replace={true} />,
            },
        ],
    },
];
