import { Record } from '../../../lib/Record';
import { ReadonlyStore, Store } from '../../../lib/Store';
import { ModelCordBox } from '../../../model/Box';
import { CRDTPage, CRDTPageAction } from '../../../model/CRDTPage';
import { Entity } from '../../../model/entity/Entity';
import { TextEntity } from '../../../model/entity/TextEntity';
import { Page } from '../../../model/Page';
import { Patch } from '../../../model/Patch';
import { ModelCordPoint, Point } from '../../../model/Point';
import { HorizontalAlign, VerticalAlign } from '../../../model/TextAlign';
import { Camera } from '../model/Camera';
import { ColorPaletteKey } from '../model/ColorPalette';
import { EditorMode } from '../model/EditorMode';
import { EditorState } from '../model/EditorState';
import { EntityMap } from '../model/EntityMap';
import { HoverState } from '../model/HoverState';
import { CollaborationController } from './CollaborationController/CollaborationController';
import { ArrowHeadType } from '../../../model/ArrowHeadType';
import { nonNull } from '../../../lib/nonNull';

export class EditorControllerCore {
    private page = new CRDTPage();
    private readonly undoStack: Page[] = [];
    private readonly redoStack: Page[] = [];

    constructor(
        private readonly _store: Store<EditorState>,
        private readonly collaborationController: CollaborationController
    ) {
        this.page = new CRDTPage(this._store.state.page);
        this.collaborationController.addActionListener(this._store.state.page.id, (action) =>
            this.applyActions([action])
        );
    }

    /**
     *@deprecated
     */
    get store(): ReadonlyStore<EditorState> {
        return this._store;
    }

    get state(): EditorState {
        return this._store.state;
    }

    setMode(mode: EditorMode) {
        this._store.setState({ mode });
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
        const entity = this.page.entities[entityId];
        if (entity === undefined) return;
        if (!Entity.isTextEditable(entity)) return;

        const actions = this.page.updateEntity(entityId, 'text', { text });
        this.dispatchActions([actions]);
    }

    setColor(palette: ColorPaletteKey) {
        this.saveSnapshot();
        const actions = this._store.state.selectMode.entityIds.map((entityId) =>
            this.page.updateEntity(entityId, 'style', { palette })
        );
        this.dispatchActions(actions);
    }

    setArrowHeadType(entityIds: string[], point: 'p1' | 'p2', type: ArrowHeadType) {
        this.saveSnapshot();
        const actions = this._store.state.selectMode.entityIds
            .map((entityId) => {
                const entity = this.state.page.entities[entityId];
                if (entity?.type !== 'line') return null;

                return this.page.updateEntity(entityId, 'arrowHeadType', {
                    arrowHeadType1: point === 'p1' ? type : entity.arrowHeadType1,
                    arrowHeadType2: point === 'p2' ? type : entity.arrowHeadType2,
                });
            })
            .filter(nonNull);
        this.dispatchActions(actions);
    }

    setLineLabelText(entityId: string, label: string) {
        this.saveSnapshot();
        const action = this.page.updateEntity(entityId, 'label', { label });
        this.dispatchActions([action]);
    }

    setVerticalTextAlign(verticalAlign: VerticalAlign) {
        this.saveSnapshot();
        const actions = this._store.state.selectMode.entityIds.map((entityId) =>
            this.page.updateEntity(entityId, 'verticalAlign', { verticalAlign })
        );
        this.dispatchActions(actions);
    }

    setHorizontalTextAlign(horizontalAlign: HorizontalAlign) {
        this.saveSnapshot();
        const actions = this._store.state.selectMode.entityIds.map((entityId) =>
            this.page.updateEntity(entityId, 'horizontalAlign', { horizontalAlign })
        );
        this.dispatchActions(actions);
    }

    dispatchActions(actions: CRDTPageAction[]) {
        this.applyActions(actions);
        this.collaborationController.dispatchActions(this._store.state.page.id, actions);
        this.collaborationController.savePage(this._store.state.page);
    }

    applyActions(actions: CRDTPageAction[]) {
        for (const action of actions) this.page.apply(action);

        const newEntities = this.page.entities;
        this._store.setState({
            page: {
                entities: {
                    ...Record.mapValue(this._store.state.page.entities, () => undefined),
                    ...newEntities,
                },
            },
            selectMode: {
                entityIds: this._store.state.selectMode.entityIds.filter((id) => id in newEntities),
            },
        });
    }

    undo() {
        const page = this.undoStack.pop();
        if (page === undefined) return;

        const currentPage = this._store.state.page;
        this._store.setState({ page });
        this.redoStack.push(currentPage);
    }

    redo() {
        const page = this.redoStack.pop();
        if (page === undefined) return;

        const currentPage = this._store.state.page;
        this._store.setState({ page });
        this.undoStack.push(currentPage);
    }

    saveSnapshot() {
        this.undoStack.push(this._store.state.page);
        this.redoStack.length = 0;
    }

    setSelection(entityIds: string[]) {
        this._store.setState({ selectMode: { entityIds } });
    }

    setSelectingRange(range: ModelCordBox) {
        return this._store.setState({
            selectMode: {
                selecting: true,
                range,
            },
        });
    }

    clearSelectingRange() {
        return this._store.setState({
            selectMode: {
                selecting: false,
            },
        });
    }

    openContextMenu(point: ModelCordPoint) {
        this._store.setState({ contextMenu: { open: true, point } });
    }

    closeContextMenu() {
        this._store.setState({ contextMenu: { open: false } });
    }

    setCamera(camera: Camera) {
        this._store.setState({ camera });
    }

    enableSnap() {
        this._store.setState({ selectMode: { snapEnabled: true } });
    }

    disableSnap() {
        this._store.setState({ selectMode: { snapEnabled: false } });
    }

    startTextEdit(entityId: string, editStartPoint = Point.display(0, 0)) {
        const entity = this._store.state.page.entities[entityId];
        if (entity === undefined) return;

        this._store.setState({ textEditMode: { entityId, editStartPoint } });
        this.setMode('textEditing');
    }

    completeTextEdit() {
        const entity = this._store.state.page.entities[this._store.state.textEditMode.entityId];
        if (entity) {
            if (!this._store.state.selectMode.entityIds.includes(entity.id)) {
                if ((entity as TextEntity).text.trim() === '') {
                    this.deleteEntities([entity.id]);
                }
            }
        }

        this.setMode('select');
        this.setSelection([]);
    }

    setHover(hover: HoverState = HoverState.IDLE) {
        this._store.setState({ hover });
    }
}
