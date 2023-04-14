import { App } from './view/App/App';
import { createRoot } from 'react-dom/client';

window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('root');
    if (container === null) {
        alert('Failed to initialize application');
        return;
    }

    const root = createRoot(container);
    root.render(<App />);
});
