import { randomId } from '../lib/randomId';
import { VectorClock } from './VectorClock';

export class CRDTSet<T extends string | number> {
    private readonly replicaId = randomId();
    private readonly addClock = new Map<T, VectorClock>();
    private readonly delClock = new Map<T, VectorClock>();

    values(): T[] {
        return [...this.addClock.keys()];
    }

    add(value: T): SetAction {
        const prevClock = this.addClock.get(value) ?? this.delClock.get(value) ?? VectorClock.empty();
        const nextClock = VectorClock.inc(prevClock, this.replicaId);

        this.delClock.delete(value);
        this.addClock.set(value, nextClock);

        return { type: 'CRDTSet.add', clock: nextClock, value };
    }

    del(value: T): DelAction {
        const prevClock = this.addClock.get(value) ?? this.delClock.get(value) ?? VectorClock.empty();
        const nextClock = VectorClock.inc(prevClock, this.replicaId);

        this.addClock.delete(value);
        this.delClock.set(value, nextClock);

        return { type: 'CRDTSet.del', clock: nextClock, value };
    }

    apply(action: Action) {
        const { type, value, clock } = action;

        switch (type) {
            case 'CRDTSet.add': {
                const prevClock = this.addClock.get(value) ?? this.delClock.get(value) ?? VectorClock.empty();
                const compare = VectorClock.compare(prevClock, clock);
                switch (compare) {
                    case 'gt':
                        return;

                    case 'concurrent': // Add-win
                    case 'lt':
                        this.delClock.delete(value);
                        this.addClock.set(value, VectorClock.inc(clock, this.replicaId));
                }
                break;
            }

            case 'CRDTSet.del': {
                const prevClock = this.addClock.get(value) ?? this.delClock.get(value) ?? VectorClock.empty();
                const compare = VectorClock.compare(prevClock, clock);
                switch (compare) {
                    case 'gt':
                    case 'concurrent': // Add-win, Del-lose
                        return;

                    case 'lt':
                        this.addClock.delete(value);
                        this.delClock.set(value, VectorClock.inc(clock, this.replicaId));
                }
                break;
            }
        }
    }
}

export type Action = SetAction | DelAction;

interface SetAction {
    type: 'CRDTSet.add';
    clock: VectorClock;
    value: any;
}

interface DelAction {
    type: 'CRDTSet.del';
    clock: VectorClock;
    value: any;
}
