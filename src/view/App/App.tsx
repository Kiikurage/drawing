import { useState } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { deps } from '../../config/dependency';
import { routes } from '../routes';
import { AppControllerProvider } from './AppControllerContext';

export const App = () => {
    const router = createHashRouter(routes);
    const [controller] = useState(() => deps.createSessionInitController());

    return (
        <AppControllerProvider value={controller}>
            <RouterProvider router={router} />
        </AppControllerProvider>
    );
};
