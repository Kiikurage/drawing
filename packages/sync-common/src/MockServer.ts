import { SyncClient, SyncObject } from './SyncClient';
import { noop, randomId, sleep } from '@drawing/common';

export class MockServer {
    private readonly clients: MockSyncClient[] = [];

    client(delayInMS: number): SyncClient {
        const client = new MockSyncClient(this, delayInMS);
        this.clients.push(client);

        return client;
    }

    broadcast(clientId: string, message: unknown): void {
        for (const client of this.clients) {
            if (client.id === clientId) continue;
            client.receive(message);
        }
    }

    async waitForSync(): Promise<void> {
        await Promise.all(this.clients.flatMap((client) => [...client.pendingPromises]));
    }
}

export class MockSyncClient implements SyncClient {
    readonly id = randomId();
    readonly pendingPromises = new Set<Promise<void>>();
    private callback: (message: unknown) => void = noop;

    constructor(private readonly server: MockServer, private readonly delayInMS: number) {}

    connect(object: SyncObject) {
        this.callback = (message) => object.onMessage(message);
        object.client = this;
    }

    receive(message: unknown): void {
        this.callback(message);
    }

    broadcast(message: unknown): void {
        const promise = sleep(this.delayInMS).then(() => {
            this.server.broadcast(this.id, message);
            this.pendingPromises.delete(promise);
        });

        this.pendingPromises.add(promise);
    }
}
