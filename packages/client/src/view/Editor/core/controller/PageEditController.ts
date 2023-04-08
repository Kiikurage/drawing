import {
    AddEntitiesEditAction,
    DeleteEntitiesEditAction,
    EditAction,
    Entity,
    EntityMap,
    HistoryManager,
    Patch,
    ReadonlyStore,
    Record,
    Store,
    UpdateEntitiesEditAction,
} from '@drawing/common';
import { PageEditSession } from './PageEditSession';
import { deps } from '../../../../config/dependency';
import { EditorState } from '../model/EditorState';
import { CRDTLivePage } from '../model/LivePage/CRDTLivePage';
import { LivePage } from '../model/LivePage/LivePage';

export class PageEditController {
    private readonly page: LivePage;

    constructor(private readonly store: Store<EditorState>, private readonly historyManager: HistoryManager) {
        this.historyManager.onAction.addListener(this.handleAction);
        this.page = new CRDTLivePage({
            page: this.store.state.page,
            collaborationController: deps.createCollaborationController(),
        });
        this.page.onAddEntity.addListener(this.handleAddEntity);
        this.page.onDeleteEntity.addListener(this.handleDeleteEntity);
        this.page.onUpdateEntity.addListener(this.handleUpdateEntity);
    }

    addEntities(entities: EntityMap) {
        this.historyManager.apply(AddEntitiesEditAction(entities), DeleteEntitiesEditAction(Object.keys(entities)));
    }

    deleteEntities(entityIds: string[]) {
        this.historyManager.apply(
            DeleteEntitiesEditAction(entityIds),
            AddEntitiesEditAction(
                Record.mapToRecord(entityIds, (entityId) => [entityId, this.store.state.page.entities[entityId]])
            )
        );
    }

    updateEntities(type: string, patches: Record<string, Patch<Entity>>) {
        const reversePatches = Patch.computeInversePatch(this.store.state.page.entities, patches) as Record<
            string,
            Patch<Entity>
        >;
        this.historyManager.apply(
            UpdateEntitiesEditAction(type, patches),
            UpdateEntitiesEditAction(type, reversePatches)
        );
    }

    newSession(): PageEditSession {
        return new Session(this.store, this.historyManager.newSession());
    }

    private readonly handleAction = (action: EditAction) => {
        switch (action.type) {
            case 'addEntities':
                this.handleAddEntitiesAction(action);
                break;
            case 'deleteEntities':
                this.handleDeleteEntitiesAction(action);
                break;
            case 'updateEntities':
                this.handleUpdateEntitiesAction(action);
                break;
        }
    };

    private readonly handleAddEntitiesAction = (action: AddEntitiesEditAction) => {
        this.page.transaction((transaction) => {
            for (const entity of Object.values(action.entities)) {
                transaction.add(entity);
            }
        });
    };

    private handleDeleteEntitiesAction(action: DeleteEntitiesEditAction) {
        this.page.transaction((transaction) => {
            for (const entityId of Object.values(action.entityIds)) {
                transaction.delete(entityId);
            }
        });
    }

    private handleUpdateEntitiesAction(action: UpdateEntitiesEditAction) {
        this.page.transaction((transaction) => {
            for (const [entityId, patch] of Object.entries(action.patch)) {
                transaction.update(entityId, action.type, patch);
            }
        });
    }

    private readonly handleUpdateEntity = (entity: Entity) => {
        this.store.setState({
            page: {
                entities: { [entity.id]: entity },
            },
        });
    };

    private readonly handleDeleteEntity = ({ entityId }: { entityId: string }) => {
        this.store.setState({
            page: {
                entities: { [entityId]: undefined },
            },
        });
    };

    private readonly handleAddEntity = (entity: Entity) => {
        this.store.setState({
            page: {
                entities: { [entity.id]: entity },
            },
        });
    };
}

class Session implements PageEditSession {
    constructor(private readonly store: ReadonlyStore<EditorState>, private readonly session: HistoryManager.Session) {}

    apply(normal: EditAction, reverse: EditAction) {
        this.session.apply(normal, reverse);
    }

    commit() {
        this.session.commit();
    }

    addEntities(entities: EntityMap) {
        this.session.apply(AddEntitiesEditAction(entities), DeleteEntitiesEditAction(Object.keys(entities)));
    }

    deleteEntities(entityIds: string[]) {
        this.session.apply(
            DeleteEntitiesEditAction(entityIds),
            AddEntitiesEditAction(
                Record.mapToRecord(entityIds, (entityId) => [entityId, this.store.state.page.entities[entityId]])
            )
        );
    }

    updateEntities(type: string, patches: Record<string, Patch<Entity>>) {
        const reversePatches = Patch.computeInversePatch(this.store.state.page.entities, patches) as Record<
            string,
            Patch<Entity>
        >;
        this.session.apply(UpdateEntitiesEditAction(type, patches), UpdateEntitiesEditAction(type, reversePatches));
    }
}
