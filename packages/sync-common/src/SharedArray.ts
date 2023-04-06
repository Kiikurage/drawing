import { SyncObject } from './SyncClient';
import { NoopSyncClient } from './NoopSyncClient';

interface Entry<T> {
    key: string;
    value: T;
    deleted: boolean;
}

interface DeleteMessage {
    type: 'DELETE';
    key: string;
}

interface InsertMessage<T> {
    type: 'INSERT';
    after: string | undefined;
    key: string;
    value: T;
}

export class SharedArray<T extends JSON> implements SyncObject {
    private readonly entries: Entry<T>[] = [];
    client = NoopSyncClient;

    get length() {
        return this.entries.filter((entry) => !entry.deleted).length;
    }

    get values(): T[] {
        return this.entries.filter((entry) => !entry.deleted).map((entry) => entry.value);
    }

    push(value: T) {
        const currentLastItemKey = this.entries.at(-1)?.key;
        const entry: Entry<T> = {
            value,
            key: `${this.entries.length}:${this.client.id}`,
            deleted: false,
        };
        this.entries.push(entry);

        this.client.broadcast({
            type: 'INSERT',
            after: currentLastItemKey,
            key: entry.key,
            value: entry.value,
        });
    }

    pop(): T | undefined {
        for (const entry of [...this.entries].reverse()) {
            if (!entry.deleted) {
                entry.deleted = true;
                this.client.broadcast({
                    type: 'DELETE',
                    key: entry.key,
                });
                return entry.value;
            }
        }
    }

    onMessage(message: DeleteMessage | InsertMessage<T>) {
        switch (message.type) {
            case 'DELETE': {
                for (const entry of this.entries) {
                    if (entry.key !== message.key) continue;
                    entry.deleted = true;
                    break;
                }
                return;
            }
            case 'INSERT': {
                let i = 0;
                while (
                    message.after !== undefined &&
                    i < this.entries.length &&
                    this.entries[i].key !== message.after
                ) {
                    i++;
                }

                const [id2, cId2] = message.key.split(':');
                while (i < this.entries.length) {
                    const [id1, cId1] = this.entries[i].key.split(':');
                    if (+id1 > +id2) break;
                    if (+id1 === +id2 && cId1 > cId2) break;
                    i++;
                }

                this.entries.splice(i, 0, {
                    key: message.key,
                    value: message.value,
                    deleted: false,
                });
                break;
            }
        }
    }
}
