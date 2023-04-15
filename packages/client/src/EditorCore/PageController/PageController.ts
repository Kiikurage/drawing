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
import { Box } from '@drawing/common/src/model/Box';
import { Action } from '@drawing/common/src/model/page/action/Action';
import { Message } from '@drawing/common/src/model/Message';
import { dispatcher } from '@drawing/common/src/lib/Dispatcher';
import { FractionalKey } from '@drawing/common/src/model/FractionalKey';

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
        return Object.values(this.page.entities)
            .filter(nonNull)
            .sort((e1, e2) => FractionalKey.comparator(e1.orderKey, e2.orderKey));
    }

    addEntities(entities: Entity[]) {
        const normal = AddEntitiesAction(entities);
        const reverse = DeleteEntitiesAction(entities.map((entity) => entity.id));
        this.history.addEntry(normal, reverse);
        this.applyAction(normal);
        this.client.send({ type: 'edit', edit: normal });
    }

    deleteEntities(entityIds: string[]) {
        const normal = DeleteEntitiesAction(entityIds);
        const reverse = AddEntitiesAction(
            entityIds.map((entityId) => this.store.state.page.entities[entityId]).filter(nonNull)
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
        const normal = UpdateEntitiesAction(patches);
        const reverse = UpdateEntitiesAction(reversePatches);

        this.history.addEntry(normal, reverse);
        this.applyAction(normal);
        this.client.send({ type: 'edit', edit: normal });
    }

    // order

    bringForward(entityId: string): void {
        const layout = this.layout;
        const entity = this.page.entities[entityId];
        if (entity === undefined) return;

        const entityBox = Entity.getBoundingBox(entity);
        const overlappedEntities = layout.filter((entity) => Box.isOverlap(Entity.getBoundingBox(entity), entityBox));

        const index = overlappedEntities.findIndex((e) => e.id === entity.id);
        if (index === overlappedEntities.length - 1) return;

        const forwardEntity1 = overlappedEntities[index + 1];

        this.updateEntities({
            [entityId]: {
                orderKey: FractionalKey.insertAfter(
                    layout.map((e) => e.orderKey),
                    forwardEntity1.orderKey
                ),
            },
        });
    }

    bringToTop(entityId: string): void {
        const layout = this.layout;
        const entityIndex = layout.findIndex((e) => e.id === entityId);
        if (entityIndex === layout.length - 1) return;

        this.updateEntities({
            [entityId]: {
                orderKey: FractionalKey.insertAfter(
                    layout.map((e) => e.orderKey),
                    layout[layout.length - 1].orderKey
                ),
            },
        });
    }

    sendBackward(entityId: string): void {
        const layout = this.layout;
        const entity = this.page.entities[entityId];
        if (entity === undefined) return;

        const entityBox = Entity.getBoundingBox(entity);
        const overlappedEntities = layout.filter((entity) => Box.isOverlap(Entity.getBoundingBox(entity), entityBox));

        const index = overlappedEntities.findIndex((e) => e.id === entity.id);
        if (index === 0) return;

        const backwardEntity1 = overlappedEntities[index - 1];

        this.updateEntities({
            [entityId]: {
                orderKey: FractionalKey.insertBefore(
                    layout.map((e) => e.orderKey),
                    backwardEntity1.orderKey
                ),
            },
        });
    }

    sendToBottom(entityId: string): void {
        const layout = this.layout;
        const entityIndex = layout.findIndex((e) => e.id === entityId);
        if (entityIndex === 0) return;

        this.updateEntities({
            [entityId]: {
                orderKey: FractionalKey.insertBefore(
                    layout.map((e) => e.orderKey),
                    layout[0].orderKey
                ),
            },
        });
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
        const reversePatches = Patch.computeInversePatch(this.store.state.page.entities, patches) as Record<
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
