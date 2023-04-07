import { LivePage, Transaction } from './LivePage';
import { Page } from '../Page';
import { VectorClock } from '../VectorClock';
import { randomId } from '../../lib/randomId';
import { Record } from '../Record';
import { Entity } from '../entity/Entity';
import { Patch } from '../Patch';
import { EntityMap } from '../EntityMap';
import { CollaborationController } from '../../../../client/src/view/Editor/core/controller/CollaborationController/CollaborationController';
import { DummyCollaborationController } from '../../../../client/src/view/Editor/core/controller/CollaborationController/DummyCollaborationController';

export class CRDTLivePage implements Page, LivePage {
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
        this.onAddEntity(entity);

        return { type: 'add', clock: nextClock, entityId: entity.id, body: entity };
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
        this.onDeleteEntity(entityId);

        return { type: 'delete', clock: nextClock, entityId };
    }

    private update(entityId: string, type: string, patch: Patch<Entity>): EntityUpdateAction {
        const prevMetadata = this.metadata[entityId];
        const prevEntity = this.entities[entityId];
        if (prevEntity === undefined) throw new Error('Impossible');

        const prevClock = prevMetadata?.clock?.[type] ?? VectorClock.empty();
        const nextClock = VectorClock.inc(prevClock, this.replicaId);

        const nextEntity = Patch.apply(prevEntity, patch);
        this.entities[entityId] = nextEntity;
        this.metadata[entityId] = {
            ...this.metadata[entityId],
            clock: {
                ...this.metadata[entityId]?.clock,
                [type]: nextClock,
            },
        };
        this.onUpdateEntity(nextEntity);

        return { type, clock: nextClock, entityId, body: patch };
    }

    private apply(action: CRDTPageAction) {
        switch (action.type) {
            case 'add': {
                const { clock, body: entity } = action as EntityAddAction;
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
                            this.onAddEntity(entity);
                        }
                        return;
                    }
                    case 'lt': {
                        this.entities[entity.id] = entity;
                        this.metadata[entity.id] = { clock: { addDel: clock } };
                        this.onAddEntity(entity);
                        return;
                    }
                }
                break;
            }

            case 'delete': {
                const { clock, entityId } = action as EntityDeleteAction;
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
                        this.onDeleteEntity(entityId);
                        return;
                    }
                }
                break;
            }

            default: {
                const { clock, entityId, type: updateType, body: patch } = action as EntityUpdateAction;
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

                            const nextEntity = Patch.apply(prevEntity, patch);
                            this.entities[entityId] = nextEntity;
                            this.metadata[entityId] = {
                                ...metadata,
                                clock: { ...metadata.clock, [updateType]: clock },
                            };
                            this.onUpdateEntity(nextEntity);
                        }
                        return;
                    }
                    case 'lt': {
                        const prevEntity = this.entities[entityId];
                        if (!prevEntity) throw new Error('Unreachable');

                        const nextEntity = Patch.apply(prevEntity, patch);
                        this.entities[entityId] = nextEntity;
                        this.metadata[entityId] = {
                            ...metadata,
                            clock: { ...metadata.clock, [updateType]: clock },
                        };
                        this.onUpdateEntity(nextEntity);
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

        this.dispatchActions(actions);
    }

    private dispatchActions(actions: CRDTPageAction[]) {
        // TODO
        this.collaborationController.dispatchActions(this.id, actions);
        this.collaborationController.savePage({
            id: this.id,
            entities: this.entities,
        });
    }

    private applyActions(actions: CRDTPageAction[]) {
        for (const action of actions) this.apply(action);
    }

    onAddEntity = (entity: Entity) => {};
    onDeleteEntity = (entityId: string) => {};
    onUpdateEntity = (entity: Entity) => {};
}

export interface CRDTLivePageWithTestVisibility extends Page, LivePage {
    readonly id: string;
    readonly entities: EntityMap;
    readonly orders: string[];

    add(entity: Entity): EntityAddAction;

    delete(entityId: string): EntityDeleteAction;

    update(entityId: string, type: string, patch: Patch<Entity>): EntityUpdateAction;

    apply(action: CRDTPageAction): void;

    transaction(fn: (transaction: Transaction) => void): void;

    dispatchActions(actions: CRDTPageAction[]): void;

    applyActions(actions: CRDTPageAction[]): void;

    onChangeByRemote?: () => void;
}

export type CRDTPageAction = EntityAddAction | EntityDeleteAction | EntityUpdateAction;

interface EntityAddAction {
    type: 'add';
    clock: VectorClock;
    entityId: string;
    body: Entity;
}

interface EntityDeleteAction {
    type: 'delete';
    clock: VectorClock;
    entityId: string;
    body?: undefined;
}

interface EntityUpdateAction {
    type: string;
    clock: VectorClock;
    entityId: string;
    body: Patch<Entity>;
}
