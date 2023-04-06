import { sleep } from '../lib/sleep';

export interface JoinRoomMessage {
    type: 'JOIN';
    roomId: string;
}

export interface SharedMessage {
    clientClock: number;
    serverClock: number;
}

// クライアント間で共有可能なデータ構造のコンテナ
export abstract class SharedClientAtom<M> {
    private readonly ws: WebSocket;
    private serverClock = 0;
    private clientClock = 0;

    protected constructor(protected readonly roomId: string) {
        this.ws = new WebSocket(`ws://localhost:12893`);
        this.ws.addEventListener('message', (ev) => {
            const message = JSON.parse(ev.data as string) as M & SharedMessage;
            const concurrent = message.serverClock > this.serverClock && message.clientClock < this.clientClock;
            this.onMessage(message, concurrent);
            this.serverClock = message.serverClock;
            this.clientClock++;
        });
        this.ws.addEventListener('open', () => {
            this.ws.send(JSON.stringify({ roomId, type: 'JOIN' } satisfies JoinRoomMessage));
        });
    }

    protected abstract onMessage(messageFromServer: M, concurrent: boolean): void;

    protected dispatch(payload: M) {
        this.clientClock++;
        const message = {
            ...payload,
            serverClock: this.serverClock,
            clientClock: this.clientClock,
        } as M & SharedMessage;

        // TODO:遅延
        sleep(500).then(() => this.ws.send(JSON.stringify(message)));
    }
}

export class SharedServerAtom {
    serverClock = 0;
    clientClocks: {
        [clientId: string]: number;
    } = {};

    addClient(clientId: string) {
        this.clientClocks[clientId] = 0;
    }

    removeClient(clientId: string) {
        delete this.clientClocks[clientId];
    }

    apply(clientId: string, message: SharedMessage): [clientId: string, message: SharedMessage][] {
        const messages: [clientId: string, message: SharedMessage][] = [];

        this.serverClock++;
        for (const cId in this.clientClocks) {
            if (cId === clientId) {
                this.clientClocks[cId] = message.clientClock;
            } else {
                messages.push([
                    cId,
                    {
                        ...message,
                        serverClock: this.serverClock,
                        clientClock: this.clientClocks[cId],
                    },
                ]);
            }
        }

        return messages;
    }
}
