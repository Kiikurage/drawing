import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import { createRoot } from 'react-dom/client';
import { App } from './components/App/App';
import { firebaseConfig } from './firebaseConfig';

window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('root');
    if (container === null) {
        alert('Failed to initialize application');
        return;
    }

    const root = createRoot(container);
    root.render(<App />);
});

Object.assign(window, {
    firebaseConfig,
    initializeApp,
    getDatabase,
    ref,
    set,
    onValue,
});
