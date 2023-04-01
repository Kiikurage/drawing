import { randomId } from '../lib/randomId';
import { Record } from '../lib/Record';
import { EntityMap } from '../view/Editor/model/EntityMap';
import { Entity } from './entity/Entity';
import { Page } from './Page';
import { Patch } from './Patch';
import { VectorClock } from './VectorClock';
import { CollaborationController } from '../view/Editor/controller/CollaborationController/CollaborationController';
import { DummyCollaborationController } from '../view/Editor/controller/CollaborationController/DummyCollaborationController';

export interface CRDTPageWithTestVisibility {
    readonly id: string;
    readonly entities: EntityMap;

    add(entity: Entity): EntityAddAction;

    delete(entityId: string): EntityDeleteAction;

    update(entityId: string, type: string, patch: Patch<Entity>): EntityUpdateAction;

    apply(action: CRDTPageAction): void;

    transaction(fn: (transaction: Transaction) => void): void;

    dispatchActions(actions: CRDTPageAction[]): void;

    applyActions(actions: CRDTPageAction[]): void;

    onChangeByRemote?: () => void;
}

export class CRDTPage implements Page {
    readonly id: string;
    readonly entities: EntityMap;
    private readonly metadata: Record<
        string,
        {
            clock: { [fieldType: string]: VectorClock };
            deleted?: boolean;
        }
    >;
    private readonly replicaId = randomId();
    private readonly collaborationController: CollaborationController;

    constructor(options: { page?: Page; collaborationController?: CollaborationController } = {}) {
        const { page = Page.create(), collaborationController = new DummyCollaborationController() } = options;

        this.id = page.id;
        this.entities = { ...page.entities };
        this.metadata = Record.mapValue(page.entities, () => ({
            clock: { addDel: VectorClock.inc({}, this.replicaId) },
        }));
        this.collaborationController = collaborationController;

        this.collaborationController.addActionListener(this.id, (action) => {
            this.applyActions([action]);
        });
    }

    private add(entity: Entity): EntityAddAction {
        const prevClock = this.metadata[entity.id]?.clock?.addDel ?? VectorClock.empty();
        const nextClock = VectorClock.inc(prevClock, this.replicaId);

        this.entities[entity.id] = entity;
        this.metadata[entity.id] = {
            clock: { addDel: nextClock },
        };

        return { type: 'add', clock: nextClock, entity };
    }

    private delete(entityId: string): EntityDeleteAction {
        const prevClock = this.metadata[entityId]?.clock?.addDel ?? VectorClock.empty();
        const nextClock = VectorClock.inc(prevClock, this.replicaId);

        delete this.entities[entityId];
        this.metadata[entityId] = {
            clock: {
                addDel: nextClock,
            },
            deleted: true,
        };

        return { type: 'delete', clock: nextClock, entityId };
    }

    private update(entityId: string, type: string, patch: Patch<Entity>): EntityUpdateAction {
        const prevMetadata = this.metadata[entityId];
        const prevEntity = this.entities[entityId];
        if (prevEntity === undefined) throw new Error('Impossible');

        const prevClock = prevMetadata?.clock?.[type] ?? VectorClock.empty();
        const nextClock = VectorClock.inc(prevClock, this.replicaId);

        this.entities[entityId] = Patch.apply(prevEntity, patch);
        this.metadata[entityId] = {
            ...this.metadata[entityId],
            clock: {
                ...this.metadata[entityId]?.clock,
                [type]: nextClock,
            },
        };

        return { type: 'update', clock: nextClock, entityId, updateType: type, patch };
    }

    private apply(action: CRDTPageAction) {
        const { type, clock } = action;

        switch (type) {
            case 'add': {
                const entity = action.entity;
                const prevClock = this.metadata[entity.id]?.clock?.addDel ?? VectorClock.empty();
                switch (VectorClock.compare(prevClock, clock)) {
                    case 'gt':
                        return;
                    case 'concurrent': {
                        // Value is concurrently updated by multiple replicas
                        const metadata = this.metadata[entity.id];
                        if (!metadata) throw new Error('Unreachable');
                        if (metadata.deleted) return;
                        if (VectorClock.hardCompare(prevClock, clock) === 'lt') {
                            this.entities[entity.id] = entity;
                            this.metadata[entity.id] = { clock: { addDel: clock } };
                        }
                        return;
                    }
                    case 'lt': {
                        this.entities[entity.id] = entity;
                        this.metadata[entity.id] = { clock: { addDel: clock } };
                        return;
                    }
                }
                break;
            }

            case 'delete': {
                const entityId = action.entityId;
                const prevClock = this.metadata[entityId]?.clock?.addDel ?? VectorClock.empty();
                switch (VectorClock.compare(prevClock, clock)) {
                    case 'gt':
                        return;
                    case 'concurrent':
                    case 'lt': {
                        // Delete is prioritized than others
                        delete this.entities[entityId];
                        this.metadata[entityId] = {
                            clock: { addDel: clock },
                            deleted: true,
                        };
                        return;
                    }
                }
                break;
            }

            case 'update': {
                const { entityId, updateType, patch } = action;
                const prevClock = this.metadata[entityId]?.clock?.[updateType] ?? VectorClock.empty();
                const metadata = this.metadata[entityId];
                if (!metadata) throw new Error('Unreachable');

                if (metadata.deleted) return;

                switch (VectorClock.compare(prevClock, clock)) {
                    case 'gt':
                        return;
                    case 'concurrent': {
                        // Value is concurrently updated by multiple replicas
                        if (VectorClock.hardCompare(prevClock, clock) === 'lt') {
                            const prevEntity = this.entities[entityId];
                            if (!prevEntity) throw new Error('Unreachable');

                            this.entities[entityId] = Patch.apply(prevEntity, patch);
                            this.metadata[entityId] = {
                                ...metadata,
                                clock: { ...metadata.clock, [updateType]: clock },
                            };
                        }
                        return;
                    }
                    case 'lt': {
                        const prevEntity = this.entities[entityId];
                        if (!prevEntity) throw new Error('Unreachable');

                        this.entities[entityId] = Patch.apply(prevEntity, patch);
                        this.metadata[entityId] = {
                            ...metadata,
                            clock: { ...metadata.clock, [updateType]: clock },
                        };
                        return;
                    }
                }
                break;
            }
        }
    }

    transaction(fn: (transaction: Transaction) => void) {
        const actions: CRDTPageAction[] = [];
        const dataModifier: Transaction = {
            add: (entity: Entity) => actions.push(this.add(entity)),
            delete: (entityId: string) => actions.push(this.delete(entityId)),
            update: (entityId: string, type: string, patch: Patch<Entity>) =>
                actions.push(this.update(entityId, type, patch)),
        };

        fn(dataModifier);
        this.onChange?.();

        this.dispatchActions(actions);
    }

    private dispatchActions(actions: CRDTPageAction[]) {
        // TODO
        this.collaborationController.dispatchActions(this.id, actions);
        this.collaborationController.savePage({
            entities: this.entities,
            id: this.id,
        });
    }

    private applyActions(actions: CRDTPageAction[]) {
        for (const action of actions) this.apply(action);

        this.onChange?.();
    }

    onChange?: () => void;
}

interface Transaction {
    add(entity: Entity): void;

    delete(entityId: string): void;

    update(entityId: string, type: string, patch: Patch<Entity>): void;
}

export type CRDTPageAction = EntityAddAction | EntityDeleteAction | EntityUpdateAction;

interface EntityAddAction {
    type: 'add';
    clock: VectorClock;
    entity: Entity;
}

interface EntityDeleteAction {
    type: 'delete';
    clock: VectorClock;
    entityId: string;
}

interface EntityUpdateAction {
    type: 'update';
    clock: VectorClock;
    entityId: string;
    updateType: string;
    patch: Patch<Entity>;
}
