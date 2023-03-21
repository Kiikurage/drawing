import { randomId } from '../lib/randomId';
import { VectorClock } from './VectorClock';

export class CRDTMap<T> {
    private readonly replicaId = randomId();
    private readonly entries = new Map<
        string,
        {
            value?: T;
            clock: VectorClock;
            deleted: boolean;
        }
    >();

    json(): Record<string, T> {
        return Object.fromEntries(
            [...this.entries.entries()]
                .filter(([, entry]) => !entry.deleted)
                .map(([key, entry]) => [key, entry.value as T] as const)
        );
    }

    set(key: string, value: T): SetAction {
        const prevClock = this.entries.get(key)?.clock ?? VectorClock.empty();
        const nextClock = VectorClock.inc(prevClock, this.replicaId);

        this.entries.set(key, {
            value,
            clock: nextClock,
            deleted: false,
        });

        return { type: 'CRDTMap.set', clock: nextClock, key, value };
    }

    del(key: string): DelAction {
        const prevClock = this.entries.get(key)?.clock ?? VectorClock.empty();
        const nextClock = VectorClock.inc(prevClock, this.replicaId);

        this.entries.set(key, {
            clock: nextClock,
            deleted: true,
        });

        return { type: 'CRDTMap.del', clock: nextClock, key };
    }

    apply(action: Action) {
        const { type, key, clock } = action;

        switch (type) {
            case 'CRDTMap.set': {
                const prevClock = this.entries.get(key)?.clock ?? VectorClock.empty();
                const compare = VectorClock.compare(prevClock, clock);
                switch (compare) {
                    case 'gt':
                        return;

                    case 'concurrent': {
                        // Value is concurrently updated by multiple replicas
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        const entry = this.entries.get(key)!;
                        if (entry.deleted || VectorClock.hardCompare(prevClock, clock) === 'lt') {
                            this.entries.set(key, {
                                value: action.value as T,
                                clock: VectorClock.inc(clock, this.replicaId),
                                deleted: false,
                            });
                        }
                        return;
                    }

                    case 'lt':
                        this.entries.set(key, {
                            value: action.value as T,
                            clock: VectorClock.inc(clock, this.replicaId),
                            deleted: false,
                        });
                }
                break;
            }

            case 'CRDTMap.del': {
                const prevClock = this.entries.get(key)?.clock ?? VectorClock.empty();
                const compare = VectorClock.compare(prevClock, clock);
                switch (compare) {
                    case 'gt':
                    case 'concurrent': // Add-win, Del-lose
                        return;

                    case 'lt':
                        this.entries.set(key, {
                            clock: VectorClock.inc(clock, this.replicaId),
                            deleted: true,
                        });
                }
                break;
            }
        }
    }
}

export type Action = SetAction | DelAction;

interface SetAction {
    type: 'CRDTMap.set';
    clock: VectorClock;
    key: string;
    value: unknown;
}

interface DelAction {
    type: 'CRDTMap.del';
    clock: VectorClock;
    key: string;
}
