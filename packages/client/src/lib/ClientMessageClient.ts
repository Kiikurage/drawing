import { MessageClient } from '@drawing/common/src/lib/MessageClient';

export class ClientMessageClient extends MessageClient {
    private readonly ws: WebSocket;
    private connected = false;

    constructor() {
        super();
        this.ws = new WebSocket(
            location.hostname === 'localhost' ? 'ws://localhost:10000' : 'wss://drawing-server.onrender.com/'
        );
        this.ws.addEventListener('message', (ev) => {
            if (typeof ev.data !== 'string') return;
            this.handleMessage(JSON.parse(ev.data));
        });
        this.ws.addEventListener('open', () => {
            this.connected = true;
            this.send({ type: 'request' });
        });
    }

    protected sendMessage(data: Record<string, unknown>): void {
        if (!this.connected) return;
        this.ws.send(JSON.stringify(data));
    }
}
