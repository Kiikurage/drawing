import { createRoot } from 'react-dom/client';
import { App } from './view/App/App';
import { SharedArray, SharedRecord } from '@drawing/common';

window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('root');
    if (container === null) {
        alert('Failed to initialize application');
        return;
    }

    const root = createRoot(container);
    root.render(<App />);
});

(window as any)['SharedArray'] = SharedArray;
(window as any)['SharedRecord'] = SharedRecord;
