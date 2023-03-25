import { Record } from '../../../lib/Record';
import { Store } from '../../../lib/Store';
import { CRDTPage, CRDTPageAction } from '../../../model/CRDTPage';
import { Entity } from '../../../model/entity/Entity';
import { Page } from '../../../model/Page';
import { Patch } from '../../../model/Patch';
import { ColorPalette } from '../model/ColorPalette';
import { EditorState } from '../model/EditorState';
import { EntityMap } from '../model/EntityMap';
import { CollaborationController } from './CollaborationController/CollaborationController';

export class EditController {
    private page = new CRDTPage();
    private readonly undoStack: Page[] = [];
    private readonly redoStack: Page[] = [];

    constructor(
        private readonly store: Store<EditorState>,
        private readonly collaborationController: CollaborationController
    ) {
        this.page = new CRDTPage(this.store.state.page);
        this.collaborationController.addActionListener(this.store.state.page.id, (action) =>
            this.applyActions([action])
        );
    }

    addEntities(entities: EntityMap) {
        this.saveSnapshot();
        const actions = Object.values(entities).map((entity) => this.page.addEntity(entity));
        this.dispatchActions(actions);
    }

    deleteEntities(entityIds: string[]) {
        this.saveSnapshot();
        const actions = entityIds.map((entityId) => this.page.deleteEntity(entityId));
        this.dispatchActions(actions);
    }

    updateEntities(patches: Record<string, Patch<Entity>>) {
        const actions = Object.entries(patches).map(([entityId, patch]) =>
            this.page.updateEntity(entityId, 'transform', patch)
        );
        this.dispatchActions(actions);
    }

    setEntityText(entityId: string, text: string) {
        this.saveSnapshot();
        const entity = this.page.entities()[entityId];
        if (entity === undefined) return;
        if (entity.type !== 'rect') return;

        const actions = this.page.updateEntity(entityId, 'text', { text });
        this.dispatchActions([actions]);
    }

    setColor(palette: ColorPalette) {
        this.saveSnapshot();
        const actions = this.store.state.selectMode.selectedEntityIds.map((entityId) =>
            this.page.updateEntity(entityId, 'style', palette)
        );
        this.dispatchActions(actions);
    }

    dispatchActions(actions: CRDTPageAction[]) {
        this.applyActions(actions);
        this.collaborationController.dispatchActions(this.store.state.page.id, actions);
        this.collaborationController.savePage(this.store.state.page);
    }

    applyActions(actions: CRDTPageAction[]) {
        for (const action of actions) this.page.apply(action);

        const newEntities = this.page.entities();
        this.store.setState({
            page: {
                entities: {
                    ...Record.mapValue(this.store.state.page.entities, () => undefined),
                    ...newEntities,
                },
            },
            selectMode: {
                selectedEntityIds: this.store.state.selectMode.selectedEntityIds.filter((id) => id in newEntities),
            },
        });
    }

    undo() {
        const page = this.undoStack.pop();
        if (page === undefined) return;

        const currentPage = this.store.state.page;
        this.store.setState({ page });
        this.redoStack.push(currentPage);
    }

    redo() {
        const page = this.redoStack.pop();
        if (page === undefined) return;

        const currentPage = this.store.state.page;
        this.store.setState({ page });
        this.undoStack.push(currentPage);
    }

    saveSnapshot() {
        this.undoStack.push(this.store.state.page);
        this.redoStack.length = 0;
    }
}
