import {
    AddEntitiesEditAction,
    DeleteEntitiesEditAction,
    dispatcher,
    EditAction,
    Entity,
    HistoryManager,
    Message,
    MessageClient,
    Page,
    Patch,
    ReadonlyStore,
    Record,
    Store,
    UpdateEntitiesEditAction,
} from '@drawing/common';
import { PageEditSession } from './PageEditSession';
import { PageState } from './PageState';
import { Command } from '../CommandManager/Command';
import { KeyboardShortcutCommandManager } from '../CommandManager/KeyboardShortcutCommandManager';
import { MockMessageClient } from '../../lib/MockMessageClient';
import { ClientMessageClient } from '../../lib/ClientMessageClient';

export class PageController {
    readonly store = new Store(PageState.create());
    private readonly client: MessageClient;
    private readonly history = new HistoryManager();

    constructor(private readonly keyboardShortcutCommandManager: KeyboardShortcutCommandManager) {
        this.client = new ClientMessageClient();
        this.client = new MockMessageClient();
        this.client.onMessage.addListener(this.handleMessageClientMessage);

        this.store.onChange.addListener((state) => this.onChange.dispatch(state));

        const undoCommand = Command('undo', 'Undo', () => this.undo());
        this.keyboardShortcutCommandManager.set(['Control', 'Z'], undoCommand);

        const redoCommand = Command('redo', 'Redo', () => this.redo());
        this.keyboardShortcutCommandManager
            .set(['Control', 'Shift', 'Z'], redoCommand)
            .set(['Control', 'Y'], redoCommand);
    }

    get page(): Page {
        return this.store.state.page;
    }

    get entities(): Entity[] {
        return this.page.layouts.map((entityId) => this.page.entities[entityId]);
    }

    addEntities(entities: Entity[]) {
        const normal = AddEntitiesEditAction(entities);
        const reverse = DeleteEntitiesEditAction(entities.map((entity) => entity.id));
        this.history.addEntry(normal, reverse);
        this.applyAction(normal);
        this.client.send({ type: 'edit', edit: normal });
    }

    deleteEntities(entityIds: string[]) {
        const normal = DeleteEntitiesEditAction(entityIds);
        const reverse = AddEntitiesEditAction(entityIds.map((entityId) => this.store.state.page.entities[entityId]));

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

    readonly onChange = dispatcher<PageState>();
}

class Session implements PageEditSession {
    constructor(private readonly store: ReadonlyStore<PageState>, private readonly session: HistoryManager.Session) {}

    readonly onAction = dispatcher<EditAction>();

    commit() {
        this.session.commit();
    }

    addEntities(entities: Entity[]) {
        this.apply(AddEntitiesEditAction(entities), DeleteEntitiesEditAction(entities.map((entity) => entity.id)));
    }

    deleteEntities(entityIds: string[]) {
        this.apply(
            DeleteEntitiesEditAction(entityIds),
            AddEntitiesEditAction(entityIds.map((entityId) => this.store.state.page.entities[entityId]))
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
