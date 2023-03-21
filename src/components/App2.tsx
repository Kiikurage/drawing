import { useState } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { createSessionInitController } from './Editor/dependency';
import { routes } from './routes';
import { SessionInitControllerProvider } from './SessionInitControllerContext';

export const App2 = () => {
    const router = createHashRouter(routes);
    const [controller] = useState(() => createSessionInitController());

    return (
        <SessionInitControllerProvider value={controller}>
            <RouterProvider router={router} />
        </SessionInitControllerProvider>
    );
};
