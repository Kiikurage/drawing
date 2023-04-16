import { PageEditSession } from './PageEditSession';
import { PageState } from './PageState';
import { Command } from '../CommandManager/Command';
import { KeyboardShortcutCommandManager } from '../CommandManager/KeyboardShortcutCommandManager';
import { ClientMessageClient } from '../../lib/ClientMessageClient';
import { ReadonlyStore, Store } from '@drawing/common/src/lib/Store';
import { MessageClient } from '@drawing/common/src/lib/MessageClient';
import { HistoryManager } from '@drawing/common/src/lib/HistoryManager';
import { Page } from '@drawing/common/src/model/page/Page';
import { Entity } from '@drawing/common/src/model/page/entity/Entity';
import { nonNull } from '@drawing/common/src/lib/nonNull';
import { AddEntitiesAction } from '@drawing/common/src/model/page/action/AddEntitiesAction';
import { DeleteEntitiesAction } from '@drawing/common/src/model/page/action/DeleteEntitiesAction';
import { Patch } from '@drawing/common/src/model/Patch';
import { UpdateEntitiesAction } from '@drawing/common/src/model/page/action/UpdateEntitiesAction';
import { Action } from '@drawing/common/src/model/page/action/Action';
import { Message } from '@drawing/common/src/model/Message';
import { dispatcher } from '@drawing/common/src/lib/Dispatcher';

export class PageController {
    readonly store = new Store(PageState.create());
    private readonly client: MessageClient;
    private readonly history = new HistoryManager();

    constructor(private readonly keyboardShortcutCommandManager: KeyboardShortcutCommandManager) {
        this.client = new ClientMessageClient();
        this.client.onMessage.addListener(this.handleMessageClientMessage);

        this.store.onChange.addListener((state) => this.onChange.dispatch(state));

        const undoCommand = Command('undo', 'Undo', () => this.undo());
        this.keyboardShortcutCommandManager.set(['Control', 'Z'], undoCommand);

        const redoCommand = Command('redo', 'Redo', () => this.redo());
        this.keyboardShortcutCommandManager
            .set(['Control', 'Shift', 'Z'], redoCommand)
            .set(['Control', 'Y'], redoCommand);

        this.store.onChange.addListener((state) => console.log(state));
    }

    get page(): Page {
        return this.store.state.page;
    }

    get entities(): Record<string, Entity | undefined> {
        return this.page.entities;
    }

    get layout(): Entity[] {
        return Page.computeLayout(this.page);
    }

    addEntities(entities: Entity[]) {
        const action = AddEntitiesAction(entities);
        this.dispatchAction(action);
    }

    deleteEntities(entityIds: string[]) {
        const action = DeleteEntitiesAction(entityIds);
        this.dispatchAction(action);
    }

    updateEntities(patches: Record<string, Patch<Entity>>) {
        const action = UpdateEntitiesAction(patches);
        this.dispatchAction(action);
    }

    // order

    bringForward(entityId: string): void {
        const action = Page.bringForward(this.page, entityId);
        this.dispatchAction(action);
    }

    bringToTop(entityId: string): void {
        const action = Page.bringToTop(this.page, entityId);
        this.dispatchAction(action);
    }

    sendBackward(entityId: string): void {
        const action = Page.bringBackward(this.page, entityId);
        this.dispatchAction(action);
    }

    sendToBottom(entityId: string): void {
        const action = Page.bringToBack(this.page, entityId);
        this.dispatchAction(action);
    }

    // createNewGroup(entityIds: string[]) {
    //     const normal = AddGroupAction(entityIds);
    //     const reverse = DeleteGroupAction(normal.groupId);
    //
    //     this.history.addEntry(normal, reverse);
    //     this.applyAction(normal);
    //     this.client.send({ type: 'edit', edit: normal });
    // }

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

    private dispatchAction(action: Action) {
        this.history.addEntry(action, Action.computeInverse(this.page, action));
        this.applyAction(action);
        this.client.send({ type: 'edit', edit: action });
    }

    private applyAction(action: Action) {
        this.store.setState({ page: Action.toPatch(this.store.state.page, action) });
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

    private readonly handleSessionAction = (action: Action) => {
        this.applyAction(action);
        this.client.send({ type: 'edit', edit: action });
    };

    readonly onChange = dispatcher<PageState>();
}

class Session implements PageEditSession {
    constructor(private readonly store: ReadonlyStore<PageState>, private readonly session: HistoryManager.Session) {}

    readonly onAction = dispatcher<Action>();

    commit() {
        this.session.commit();
    }

    addEntities(entities: Entity[]) {
        this.apply(AddEntitiesAction(entities), DeleteEntitiesAction(entities.map((entity) => entity.id)));
    }

    deleteEntities(entityIds: string[]) {
        this.apply(
            DeleteEntitiesAction(entityIds),
            AddEntitiesAction(entityIds.map((entityId) => this.store.state.page.entities[entityId]).filter(nonNull))
        );
    }

    updateEntities(patches: Record<string, Patch<Entity>>) {
        const reversePatches = Patch.computeInverse(this.store.state.page.entities, patches) as Record<
            string,
            Patch<Entity>
        >;
        this.apply(UpdateEntitiesAction(patches), UpdateEntitiesAction(reversePatches));
    }

    private apply(normal: Action, reverse: Action) {
        this.session.apply(normal, reverse);
        this.onAction.dispatch(normal);
    }
}
