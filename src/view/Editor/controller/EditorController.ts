import { randomId } from '../../../lib/randomId';
import { Record } from '../../../lib/Record';
import { ReadonlyStore, Store } from '../../../lib/Store';
import { ModelCordBox } from '../../../model/Box';
import { Entity } from '../../../model/entity/Entity';
import { LineEntity } from '../../../model/entity/LineEntity';
import { Patch } from '../../../model/Patch';
import { DisplayCordPoint, ModelCordPoint, Point } from '../../../model/Point';
import { DisplayCordSize, Size } from '../../../model/Size';
import { HorizontalAlign, VerticalAlign } from '../../../model/TextAlign';
import { createCollaborationController } from '../dependency';
import { Camera } from '../model/Camera';
import { ColorPaletteKey } from '../model/ColorPalette';
import { EditorMode } from '../model/EditorMode';
import { EditorState } from '../model/EditorState';
import { EntityMap } from '../model/EntityMap';
import { HoverState } from '../model/HoverState';
import { Key } from '../model/Key';
import { KeyboardEventInfo, MouseEventButton, MouseEventInfo } from '../model/MouseEventInfo';
import { TransformType } from '../model/TransformType';
import { EditController } from './EditController';
import { EditorModeController } from './EditorModeController/EditorModeController';
import { LineModeController } from './EditorModeController/LineModeController';
import { RectModeController } from './EditorModeController/RectModeController';
import { SelectModeController } from './EditorModeController/SelectModeController';
import { TextModeController } from './EditorModeController/TextModeController';
import { ScrollSessionController } from './ScrollSessionController';
import { SingleLineTransformSessionController } from './SingleLineTransformSessionController';
import { TransformSessionController } from './TransformSessionController';

/**
 * Root controller for Editor view
 */
export class EditorController {
    readonly collaborationController = createCollaborationController();
    readonly editController: EditController;
    private _currentPoint = Point.display(0, 0);
    private readonly _store: Store<EditorState>;
    private readonly modeControllers: Record<EditorMode, EditorModeController>;
    private scrollSession: ScrollSessionController | null = null;
    private transformSession: TransformSessionController | null = null;
    private singleLineTransformSession: SingleLineTransformSessionController | null = null;

    constructor(initialData: Patch<EditorState>) {
        this._store = new Store(EditorState.create(initialData));
        this.modeControllers = {
            rect: new RectModeController(this),
            select: new SelectModeController(this),
            line: new LineModeController(this),
            text: new TextModeController(this),
        };
        this.editController = new EditController(this._store, this.collaborationController);
    }

    // Utility getters
    get store(): ReadonlyStore<EditorState> {
        return this._store;
    }

    get state(): EditorState {
        return this.store.state;
    }

    private setState(patch: Patch<EditorState>) {
        this._store.setState(patch);
    }

    get currentPoint(): ModelCordPoint {
        return Point.toModel(this.store.state.camera, this._currentPoint);
    }

    private set currentPoint(point: ModelCordPoint) {
        this._currentPoint = Point.toDisplay(this.state.camera, point);
    }

    get modeController(): EditorModeController {
        return this.modeControllers[this.store.state.mode];
    }

    computeSelectedEntities(): EntityMap {
        const result: EntityMap = {};

        for (const id of this.state.selectMode.entityIds) {
            const entity = this.store.state.page.entities[id];
            if (!entity) continue;
            result[id] = entity;
        }

        return result;
    }

    // Commands

    setMode(mode: EditorMode) {
        this.modeController.onBeforeDeactivate?.();
        this.setState({ mode });
        this.modeController.onAfterActivate?.();
    }

    cut() {
        const selectedEntities = this.computeSelectedEntities();
        if (Record.size(selectedEntities) === 0) return;

        navigator.clipboard.writeText(JSON.stringify(selectedEntities));

        this.deleteEntities(this.store.state.selectMode.entityIds);
    }

    copy() {
        const selectedEntities = this.computeSelectedEntities();
        if (Record.size(selectedEntities) === 0) return;

        navigator.clipboard.writeText(JSON.stringify(selectedEntities));
    }

    async paste() {
        const json = await navigator.clipboard.readText();
        let copiedEntities: EntityMap;
        try {
            copiedEntities = JSON.parse(json);
        } catch (ignored) {
            return;
        }
        const entities = Record.map(copiedEntities, (_, entity) => {
            const id = randomId();
            return [id, Patch.apply(entity, { id })];
        });

        this.addEntities(entities);
        this.setSelection(Object.keys(entities));
    }

    addEntities(entities: EntityMap) {
        this.editController.addEntities(entities);
    }

    deleteEntities(entityIds: string[]) {
        this.editController.deleteEntities(entityIds);
    }

    deleteSelectedEntities() {
        this.deleteEntities(this.state.selectMode.entityIds);
    }

    setColor(palette: ColorPaletteKey) {
        this.editController.setColor(palette);
    }

    setVerticalTextAlign(align: VerticalAlign) {
        this.editController.setVerticalTextAlign(align);
    }

    setHorizontalTextAlign(align: HorizontalAlign) {
        this.editController.setHorizontalTextAlign(align);
    }

    setSelection(entityIds: string[]) {
        this.setState({
            selectMode: {
                entityIds: entityIds.filter((entityId) => entityId in this.state.page.entities),
            },
            mode: 'select',
        });
    }

    addSelection(entityId: string) {
        this.setSelection([...this.state.selectMode.entityIds, entityId]);
    }

    selectAll() {
        this.setSelection(Object.keys(this.store.state.page.entities));
    }

    clearSelection() {
        this.setSelection([]);
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
        this.setState({ contextMenu: { open: true, point } });
    }

    closeContextMenu() {
        this.setState({ contextMenu: { open: false } });
    }

    undo() {
        this.editController.undo();
    }

    redo() {
        this.editController.redo();
    }

    moveCamera(point: ModelCordPoint) {
        this.setState({ camera: { point } });
    }

    setCameraScale(focus: ModelCordPoint, scale: number) {
        this.setState({
            camera: Camera.setScale(this.state.camera, focus, scale),
        });
    }

    enableSnap() {
        this._store.setState({ selectMode: { snapEnabled: true } });
    }

    disableSnap() {
        this._store.setState({ selectMode: { snapEnabled: false } });
    }

    startTextEdit(entityId: string) {
        const entity = this.state.page.entities[entityId];
        if (entity === undefined) return;

        this._store.setState({ textEditMode: { editing: true, entityId } });
    }

    setEntityText(entityId: string, text: string) {
        this.editController.setEntityText(entityId, text);
    }

    completeTextEdit() {
        this._store.setState({ textEditMode: { editing: false } });
    }

    startTransform(entities: EntityMap, transformType: TransformType) {
        this.editController.saveSnapshot();
        this.transformSession = new TransformSessionController(this, entities, transformType);
        this._store.setState({ selectMode: { transforming: true } });
    }

    startSingleLineTransform(entity: LineEntity, pointKey: 'p1' | 'p2') {
        this.editController.saveSnapshot();
        this.singleLineTransformSession = new SingleLineTransformSessionController(this, entity, pointKey);
        this._store.setState({ selectMode: { transforming: true } });
    }

    // Event handlers

    onZoom = (diff: number) => {
        const newScale = Math.max(0.1, Math.min(this.state.camera.scale + diff, 5));

        this.setCameraScale(this.currentPoint, newScale);
    };

    onScroll = (diff: DisplayCordSize) => {
        const diffInModel = Size.toModel(this.store.state.camera, diff);

        const point = Point.model(
            this.state.camera.point.x + diffInModel.width,
            this.state.camera.point.y + diffInModel.height
        );

        this.moveCamera(point);
    };

    onMouseDown = (info: MouseEventInfo) => {
        if (info.button === MouseEventButton.WHEEL) {
            this.scrollSession = new ScrollSessionController(this);
        }
        this.modeController.onMouseDown?.(info);
    };

    onMouseMove = (point: DisplayCordPoint) => {
        const prevPoint = this.currentPoint;
        const nextPoint = Point.toModel(this.store.state.camera, point);
        this.currentPoint = nextPoint;

        this.scrollSession?.onMouseMove(prevPoint, nextPoint);
        this.transformSession?.onMouseMove(prevPoint, nextPoint);
        this.singleLineTransformSession?.onMouseMove(prevPoint, nextPoint);
        this.modeController.onMouseMove?.(prevPoint, nextPoint);
    };

    onMouseUp = () => {
        this._store.setState({ selectMode: { transforming: false } });

        this.scrollSession = null;
        this.transformSession = null;
        this.singleLineTransformSession = null;

        this.modeController.onMouseUp?.();
    };

    onDoubleClick = () => {
        if (this.checkIfHoveredEntityTextEditable()) {
            this.startTextEdit(this.state.selectMode.entityIds[0]!);
        }
    };

    onHover = (hover: HoverState) => {
        this.setState({ hover });
    };

    onUnhover = () => {
        if (this.store.state.hover === HoverState.IDLE) return;

        this.setState({ hover: HoverState.IDLE });
    };

    onKeyDown = (ev: KeyboardEventInfo) => {
        if (ev.key === 'Control') this.enableSnap();

        const keys = [ev.key];
        if (ev.shiftKey) keys.push('Shift');
        if (ev.ctrlKey) keys.push('Control');

        switch (Key.serialize(keys)) {
            case Key.serialize(['V']): {
                this.setMode('select');
                return;
            }
            case Key.serialize(['R']): {
                this.setMode('rect');
                return;
            }
            case Key.serialize(['L']): {
                this.setMode('line');
                return;
            }
            case Key.serialize(['A']): {
                this.setMode('line');
                return;
            }
            case Key.serialize(['Delete']):
            case Key.serialize(['Backspace']): {
                ev.preventDefault();
                this.deleteSelectedEntities();
                return;
            }
            case Key.serialize(['Control', 'A']): {
                ev.preventDefault();
                this.selectAll();
                return;
            }
            case Key.serialize(['Control', 'X']): {
                ev.preventDefault();
                this.cut();
                return;
            }
            case Key.serialize(['Control', 'C']): {
                ev.preventDefault();
                this.copy();
                return;
            }
            case Key.serialize(['Control', 'V']): {
                ev.preventDefault();
                this.paste();
                return;
            }
            case Key.serialize(['Control', 'Z']): {
                ev.preventDefault();
                this.undo();
                return;
            }
            case Key.serialize(['Control', 'Shift', 'Z']):
            case Key.serialize(['Control', 'Y']): {
                ev.preventDefault();
                this.redo();
                return;
            }
        }
    };

    onKeyUp = (ev: KeyboardEventInfo) => {
        if (ev.key === 'Control') this.disableSnap();
    };

    private checkIfHoveredEntityTextEditable(): boolean {
        if (this.state.hover.type !== 'transformHandle') return false;
        if (this.state.selectMode.entityIds.length !== 1) return false;

        const selectedEntity = Object.values(this.computeSelectedEntities())[0]!;
        if (!Entity.isTextEditable(selectedEntity)) return false;

        return true;
    }
}
