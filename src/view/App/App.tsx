import { useState } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { createSessionInitController } from '../Editor/dependency';
import { routes } from '../routes';
import { AppControllerProvider } from './AppControllerContext';

export const App = () => {
    const router = createHashRouter(routes);
    const [controller] = useState(() => createSessionInitController());

    return (
        <AppControllerProvider value={controller}>
            <RouterProvider router={router} />
        </AppControllerProvider>
    );
};
