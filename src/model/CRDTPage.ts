import { Entity } from './entity/Entity';
import { Page } from './Page';
import { Patch } from './Patch';
import { VectorClock } from './VectorClock';

export class CRDTMap<T> {
    page(): Page {}

    set(key: string, value: T): SetAction {
        const prevClock = this.addClock.get(key) ?? this.delClock.get(key) ?? VectorClock.empty();
        const nextClock = VectorClock.inc(prevClock, this.replicaId);

        this.delClock.delete(key);
        this.addClock.set(key, nextClock);
        this._values.set(key, value);

        return { type: 'CRDTMap.set', clock: nextClock, key, value };
    }

    del(key: string): DelAction {
        const prevClock = this.addClock.get(key) ?? this.delClock.get(key) ?? VectorClock.empty();
        const nextClock = VectorClock.inc(prevClock, this.replicaId);

        this.addClock.delete(key);
        this._values.delete(key);
        this.delClock.set(key, nextClock);

        return { type: 'CRDTMap.del', clock: nextClock, key };
    }

    apply(action: Action) {
        const { type, key, clock } = action;

        switch (type) {
            case 'CRDTMap.set': {
                const prevClock = this.addClock.get(key) ?? this.delClock.get(key) ?? VectorClock.empty();
                const compare = VectorClock.compare(prevClock, clock);
                switch (compare) {
                    case 'gt':
                        return;

                    case 'concurrent': // Value is concurrently updated by multiple replicas
                        if (this.delClock.has(key) || VectorClock.hardCompare(prevClock, clock) === 'lt') {
                            this.delClock.delete(key);
                            this.addClock.set(key, VectorClock.inc(clock, this.replicaId));
                            this._values.set(key, action.value);
                        }
                        return;

                    case 'lt':
                        this.delClock.delete(key);
                        this.addClock.set(key, VectorClock.inc(clock, this.replicaId));
                        this._values.set(key, action.value);
                }
                break;
            }

            case 'CRDTMap.del': {
                const prevClock = this.addClock.get(key) ?? this.delClock.get(key) ?? VectorClock.empty();
                const compare = VectorClock.compare(prevClock, clock);
                switch (compare) {
                    case 'gt':
                    case 'concurrent': // Add-win, Del-lose
                        return;

                    case 'lt':
                        this.addClock.delete(key);
                        this.delClock.set(key, VectorClock.inc(clock, this.replicaId));
                        this._values.delete(key);
                }
                break;
            }
        }
    }
}

export type Action = AddEntityAction | RemoveEntityAction | UpdateEntityFormAction | UpdateEntityStyleAction;

interface AddEntityAction {
    type: 'AddEntity';
    clock: VectorClock;
    entity: Entity;
}

interface RemoveEntityAction {
    type: 'RemoveEntity';
    clock: VectorClock;
    entityId: string;
}

interface UpdateEntityFormAction {
    type: 'UpdateEntityForm';
    clock: VectorClock;
    entity: Patch<Entity>;
}

interface UpdateEntityStyleAction {
    type: 'UpdateEntityStyle';
    clock: VectorClock;
    entityId: string;
    fillColor: string;
    strokeColor: string;
}
