import {
    AddEntitiesEditAction,
    DeleteEntitiesEditAction,
    dispatcher,
    EditAction,
    Entity,
    EntityMap,
    HistoryManager,
    Message,
    Patch,
    ReadonlyStore,
    Record,
    Store,
    UpdateEntitiesEditAction,
} from '@drawing/common';
import { PageEditSession } from './PageEditSession';
import { EditorState } from '../model/EditorState';
import { ClientMessageClient } from '../../../../lib/ClientMessageClient';

export class EditController {
    private readonly client: ClientMessageClient;
    private readonly history = new HistoryManager();

    constructor(private readonly store: Store<EditorState>) {
        this.client = new ClientMessageClient();
        this.client.onMessage.addListener(this.handleMessageClientMessage);
    }

    addEntities(entities: EntityMap) {
        const normal = AddEntitiesEditAction(entities);
        const reverse = DeleteEntitiesEditAction(Object.keys(entities));
        this.history.addEntry(normal, reverse);
        this.applyAction(normal);
        this.client.send({ type: 'edit', edit: normal });
    }

    deleteEntities(entityIds: string[]) {
        const normal = DeleteEntitiesEditAction(entityIds);
        const reverse = AddEntitiesEditAction(
            Record.mapToRecord(entityIds, (entityId) => [entityId, this.store.state.page.entities[entityId]])
        );

        this.history.addEntry(normal, reverse);
        this.applyAction(normal);
        this.client.send({ type: 'edit', edit: normal });
    }

    updateEntities(patches: Record<string, Patch<Entity>>) {
        const reversePatches = Patch.computeInversePatch(this.store.state.page.entities, patches) as Record<
            string,
            Patch<Entity>
        >;
        const normal = UpdateEntitiesEditAction(patches);
        const reverse = UpdateEntitiesEditAction(reversePatches);

        this.history.addEntry(normal, reverse);
        this.applyAction(normal);
        this.client.send({ type: 'edit', edit: normal });
    }

    undo() {
        const actions = this.history.undo();
        actions.forEach((action) => this.applyAction(action));
    }

    redo() {
        const actions = this.history.redo();
        actions.forEach((action) => this.applyAction(action));
    }

    newSession(): PageEditSession {
        const session = new Session(this.store, this.history.newSession());
        session.onAction.addListener(this.handleSessionAction);

        return session;
    }

    private applyAction(action: EditAction) {
        this.store.setState({ page: EditAction.toPatch(this.store.state.page, action) });
    }

    private readonly handleMessageClientMessage = (message: Message) => {
        switch (message.type) {
            case 'edit': {
                this.applyAction(message.edit);
                return;
            }
            case 'sync': {
                this.store.setState({
                    page: message.page,
                });
                return;
            }
            case 'request':
            case 'ack':
            default:
                return;
        }
    };

    private readonly handleSessionAction = (action: EditAction) => {
        this.applyAction(action);
        this.client.send({ type: 'edit', edit: action });
    };
}

class Session implements PageEditSession {
    constructor(private readonly store: ReadonlyStore<EditorState>, private readonly session: HistoryManager.Session) {}

    readonly onAction = dispatcher<EditAction>();

    commit() {
        this.session.commit();
    }

    addEntities(entities: EntityMap) {
        this.apply(AddEntitiesEditAction(entities), DeleteEntitiesEditAction(Object.keys(entities)));
    }

    deleteEntities(entityIds: string[]) {
        this.apply(
            DeleteEntitiesEditAction(entityIds),
            AddEntitiesEditAction(
                Record.mapToRecord(entityIds, (entityId) => [entityId, this.store.state.page.entities[entityId]])
            )
        );
    }

    updateEntities(patches: Record<string, Patch<Entity>>) {
        const reversePatches = Patch.computeInversePatch(this.store.state.page.entities, patches) as Record<
            string,
            Patch<Entity>
        >;
        this.apply(UpdateEntitiesEditAction(patches), UpdateEntitiesEditAction(reversePatches));
    }

    private apply(normal: EditAction, reverse: EditAction) {
        this.session.apply(normal, reverse);
        this.onAction.dispatch(normal);
    }
}
