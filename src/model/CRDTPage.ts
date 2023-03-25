import { randomId } from '../lib/randomId';
import { Record } from '../lib/Record';
import { EntityMap } from '../view/Editor/model/EntityMap';
import { Entity } from './entity/Entity';
import { Page } from './Page';
import { Patch } from './Patch';
import { VectorClock } from './VectorClock';

export class CRDTPage {
    private readonly replicaId = randomId();
    private readonly entries: Record<
        string,
        {
            entity?: Entity;
            clock: {
                addDel: VectorClock;
                [fieldType: string]: VectorClock | undefined;
            };
            deleted?: boolean;
        }
    >;

    constructor(page?: Page) {
        this.entries = Record.mapValue(page?.entities ?? {}, (entity) => ({
            entity,
            clock: { addDel: VectorClock.inc({}, this.replicaId) },
        }));
    }

    entities(): EntityMap {
        return Record.mapValue(
            Record.filter(this.entries, (entry) => !entry.deleted),
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            (entry) => entry.entity!
        );
    }

    addEntity(entity: Entity): EntityAddAction {
        const prevClock = this.entries[entity.id]?.clock?.addDel ?? VectorClock.empty();
        const nextClock = VectorClock.inc(prevClock, this.replicaId);

        this.entries[entity.id] = {
            entity,
            clock: { addDel: nextClock },
        };

        return [ActionType.ENTITY_ADD, nextClock, entity];
    }

    deleteEntity(entityId: string): EntityDeleteAction {
        const prevClock = this.entries[entityId]?.clock?.addDel ?? VectorClock.empty();
        const nextClock = VectorClock.inc(prevClock, this.replicaId);

        this.entries[entityId] = {
            clock: {
                addDel: nextClock,
            },
            deleted: true,
        };

        return [ActionType.ENTITY_DELETE, nextClock, entityId];
    }

    updateEntity(entityId: string, type: 'transform' | 'style' | 'text', patch: Patch<any>): EntityUpdateAction {
        const prevClock = this.entries[entityId]?.clock?.[type] ?? VectorClock.empty();
        const nextClock = VectorClock.inc(prevClock, this.replicaId);

        this.entries[entityId] = {
            ...this.entries[entityId],
            entity: Patch.apply(this.entries[entityId].entity, patch),
            clock: {
                ...this.entries[entityId]?.clock,
                [type]: nextClock,
            },
        };

        return [ActionType.ENTITY_UPDATE, nextClock, entityId, type, patch];
    }

    apply(action: CRDTPageAction) {
        const [type, clock] = action;

        switch (type) {
            case ActionType.ENTITY_ADD: {
                const entity = action[2];
                const prevClock = this.entries[entity.id]?.clock?.addDel ?? VectorClock.empty();
                switch (VectorClock.compare(prevClock, clock)) {
                    case 'gt':
                        return;
                    case 'concurrent': {
                        // Value is concurrently updated by multiple replicas
                        const entry = this.entries[entity.id].clock.addDel;
                        if (entry.deleted) return;
                        if (VectorClock.hardCompare(prevClock, clock) === 'lt') {
                            this.entries[entity.id] = {
                                entity,
                                clock: { addDel: clock },
                            };
                        }
                        return;
                    }
                    case 'lt': {
                        this.entries[entity.id] = {
                            entity,
                            clock: { addDel: clock },
                        };
                        return;
                    }
                }
                break;
            }

            case ActionType.ENTITY_DELETE: {
                const entityId = action[2];
                const prevClock = this.entries[entityId]?.clock?.addDel ?? VectorClock.empty();
                switch (VectorClock.compare(prevClock, clock)) {
                    case 'gt':
                        return;
                    case 'concurrent':
                    case 'lt': {
                        // Delete is prioritized than others
                        this.entries[entityId] = {
                            clock: { addDel: clock },
                            deleted: true,
                        };
                        return;
                    }
                }
                break;
            }

            case ActionType.ENTITY_UPDATE: {
                const [, , entityId, updateType, patch] = action;
                const prevClock = this.entries[entityId]?.clock?.[updateType] ?? VectorClock.empty();
                const entry = this.entries[entityId];
                if (entry.deleted) return;

                switch (VectorClock.compare(prevClock, clock)) {
                    case 'gt':
                        return;
                    case 'concurrent': {
                        // Value is concurrently updated by multiple replicas
                        if (VectorClock.hardCompare(prevClock, clock) === 'lt') {
                            this.entries[entityId] = {
                                ...entry,
                                entity: Patch.apply(entry.entity!, patch),
                                clock: {
                                    ...entry.clock,
                                    [updateType]: clock,
                                },
                            };
                        }
                        return;
                    }
                    case 'lt': {
                        const entry = this.entries[entityId];
                        this.entries[entityId] = {
                            ...entry,
                            entity: Patch.apply(entry.entity!, patch),
                            clock: {
                                ...entry.clock,
                                [updateType]: clock,
                            },
                        };
                        return;
                    }
                }
                break;
            }
        }
    }
}

export type CRDTPageAction = EntityAddAction | EntityDeleteAction | EntityUpdateAction;

enum ActionType {
    ENTITY_ADD = 0,
    ENTITY_DELETE = 1,
    ENTITY_UPDATE = 2,
}

type EntityAddAction = [type: ActionType.ENTITY_ADD, clock: VectorClock, entity: Entity];
type EntityDeleteAction = [type: ActionType.ENTITY_DELETE, clock: VectorClock, entityId: string];
type EntityUpdateAction = [
    type: ActionType.ENTITY_UPDATE,
    clock: VectorClock,
    entityId: string,
    updateType: 'transform' | 'style' | 'text',
    patch: Patch<Entity>
];
