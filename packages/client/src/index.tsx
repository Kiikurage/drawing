import { createRoot } from 'react-dom/client';
import { App } from './view/App/App';
import { Message, MessageClient, MessageConnection } from '@drawing/common';

window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('root');
    if (container === null) {
        alert('Failed to initialize application');
        return;
    }

    const root = createRoot(container);
    root.render(<App />);
});

(window as any).createMessageClient = () => {
    const ws = new WebSocket('ws://localhost:10000');

    class ClientMessageConnection implements MessageConnection {
        constructor(private readonly ws: WebSocket) {}

        addMessageCallback(callback: (message: Message) => void): void {
            this.ws.addEventListener('message', (ev) => {
                if (typeof ev.data !== 'string') return;

                callback(JSON.parse(ev.data) as Message);
            });
        }

        send(message: Message): void {
            this.ws.send(JSON.stringify(message));
        }
    }

    return new MessageClient(new ClientMessageConnection(ws));
};
