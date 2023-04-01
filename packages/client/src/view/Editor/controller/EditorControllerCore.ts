import {
    ArrowHeadType,
    Camera,
    ColorPaletteKey,
    EditorMode,
    EditorState,
    Entity,
    EntityMap,
    HorizontalAlign,
    HoverState,
    LivePage,
    ModelCordBox,
    ModelCordPoint,
    Page,
    Patch,
    Point,
    ReadonlyStore,
    Store,
    TextEntity,
    VerticalAlign,
} from '@drawing/common';
import { deps } from '../../../config/dependency';

export class EditorControllerCore {
    private readonly page: LivePage;
    private readonly undoStack: Page[] = [];
    private readonly redoStack: Page[] = [];

    constructor(private readonly _store: Store<EditorState>) {
        this.page = deps.createLivePage(this._store.state.page);
        this.page.onChange = () => {
            this._store.setState({
                page: {
                    entities: { ...this.page.entities },
                },
                selectMode: {
                    entityIds: this._store.state.selectMode.entityIds.filter((id) => id in this.page.entities),
                },
            });
        };
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
        this.page.transaction((transaction) => {
            for (const entity of Object.values(entities)) {
                transaction.add(entity);
            }
        });
    }

    deleteEntities(entityIds: string[]) {
        this.saveSnapshot();
        this.page.transaction((transaction) => {
            for (const entityId of Object.values(entityIds)) {
                transaction.delete(entityId);
            }
        });
    }

    updateEntities(patches: Record<string, Patch<Entity>>) {
        this.page.transaction((transaction) => {
            for (const [entityId, patch] of Object.entries(patches)) {
                transaction.update(entityId, 'transform', patch);
            }
        });
    }

    setEntityText(entityId: string, text: string) {
        this.saveSnapshot();
        const entity = this.page.entities[entityId];
        if (entity === undefined) return;
        if (!Entity.isTextEditable(entity)) return;

        this.page.transaction((transaction) => {
            transaction.update(entityId, 'text', { text });
        });
    }

    setColor(entityIds: string[], palette: ColorPaletteKey) {
        this.saveSnapshot();
        this.page.transaction((transaction) => {
            for (const entityId of entityIds) {
                transaction.update(entityId, 'style', { palette });
            }
        });
    }

    setArrowHeadType(entityIds: string[], point: 'p1' | 'p2', type: ArrowHeadType) {
        this.saveSnapshot();
        this.page.transaction((transaction) => {
            for (const entityId of entityIds) {
                const entity = this.state.page.entities[entityId];
                if (entity?.type !== 'line') return null;

                transaction.update(entityId, 'arrowHeadType', {
                    arrowHeadType1: point === 'p1' ? type : entity.arrowHeadType1,
                    arrowHeadType2: point === 'p2' ? type : entity.arrowHeadType2,
                });
            }
        });
    }

    setLineLabelText(entityId: string, label: string) {
        this.saveSnapshot();
        this.page.transaction((transaction) => {
            transaction.update(entityId, 'label', { label });
        });
    }

    setVerticalTextAlign(entityIds: string[], verticalAlign: VerticalAlign) {
        this.saveSnapshot();
        this.page.transaction((transaction) => {
            for (const entityId of entityIds) {
                transaction.update(entityId, 'verticalAlign', { verticalAlign });
            }
        });
    }

    setHorizontalTextAlign(entityIds: string[], horizontalAlign: HorizontalAlign) {
        this.saveSnapshot();
        this.page.transaction((transaction) => {
            for (const entityId of entityIds) {
                transaction.update(entityId, 'horizontalAlign', { horizontalAlign });
            }
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
