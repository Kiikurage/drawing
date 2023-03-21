import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import { createRoot } from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { routes } from './components/routes';
import { firebaseConfig } from './firebaseConfig';

window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('root');
    if (container === null) {
        alert('Failed to initialize application');
        return;
    }

    const router = createHashRouter(routes);
    const root = createRoot(container);
    root.render(<RouterProvider router={router} />);
});

Object.assign(window, {
    firebaseConfig,
    initializeApp,
    getDatabase,
    ref,
    set,
    onValue,
});
