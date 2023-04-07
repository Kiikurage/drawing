import {
    CRDTLivePage,
    Entity,
    EntityMap,
    HistoryManager,
    LivePage,
    Patch,
    ReadonlyStore,
    Record,
    Store,
} from '@drawing/common';
import {
    AddEntitiesEditAction,
    DeleteEntitiesEditAction,
    EditAction,
    UpdateEntitiesEditAction,
} from '@drawing/common/src/model/EditAction';
import { PageEditSession } from './PageEditSession';
import { deps } from '../../../../config/dependency';
import { EditorState } from '../model/EditorState';

export class PageEditController {
    private readonly page: LivePage;

    constructor(private readonly store: Store<EditorState>, private readonly historyManager: HistoryManager) {
        this.historyManager.onAction = this.onAction;
        this.page = new CRDTLivePage({
            page: this.store.state.page,
            collaborationController: deps.createCollaborationController(),
        });
        this.page.onAddEntity = this.onAddEntity;
        this.page.onDeleteEntity = this.onDeleteEntity;
        this.page.onUpdateEntity = this.onUpdateEntity;
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

    private readonly onAction = (action: EditAction) => {
        switch (action.type) {
            case 'addEntities':
                this.onAddEntitiesAction(action);
                break;
            case 'deleteEntities':
                this.onDeleteEntitiesAction(action);
                break;
            case 'updateEntities':
                this.onUpdateEntitiesAction(action);
                break;
        }
    };

    private readonly onAddEntitiesAction = (action: AddEntitiesEditAction) => {
        this.page.transaction((transaction) => {
            for (const entity of Object.values(action.entities)) {
                transaction.add(entity);
            }
        });
    };

    private onDeleteEntitiesAction(action: DeleteEntitiesEditAction) {
        this.page.transaction((transaction) => {
            for (const entityId of Object.values(action.entityIds)) {
                transaction.delete(entityId);
            }
        });
    }

    private onUpdateEntitiesAction(action: UpdateEntitiesEditAction) {
        this.page.transaction((transaction) => {
            for (const [entityId, patch] of Object.entries(action.patch)) {
                transaction.update(entityId, action.type, patch);
            }
        });
    }

    private readonly onUpdateEntity = (entity: Entity) => {
        this.store.setState({
            page: {
                entities: { [entity.id]: entity },
            },
        });
    };

    private readonly onDeleteEntity = (entityId: string) => {
        this.store.setState({
            page: {
                entities: { [entityId]: undefined },
            },
            // selectMode: {
            //     entityIds: this.store.state.selectMode.entityIds.filter((id) => id !== entityId),
            // },
        });
    };

    private readonly onAddEntity = (entity: Entity) => {
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
