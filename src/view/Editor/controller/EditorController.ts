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
import { ColorPaletteKey } from '../model/ColorPalette';
import { EditorMode } from '../model/EditorMode';
import { EditorState } from '../model/EditorState';
import { EntityMap } from '../model/EntityMap';
import { HoverState } from '../model/HoverState';
import { Key } from '../model/Key';
import { KeyboardEventInfo, MouseEventButton, MouseEventInfo } from '../model/MouseEventInfo';
import { TransformType } from '../model/TransformType';
import { EditorControllerCore } from './EditorControllerCore';
import { EditorModeController } from './EditorModeController/EditorModeController';
import { LineModeController } from './EditorModeController/LineModeController';
import { RectModeController } from './EditorModeController/RectModeController';
import { SelectModeController } from './EditorModeController/SelectModeController';
import { TextEditModeController } from './EditorModeController/TextEditModeController';
import { TextModeController } from './EditorModeController/TextModeController';
import { ScrollSessionController } from './ScrollSessionController';
import { SingleLineTransformSessionController } from './SingleLineTransformSessionController';
import { TransformSessionController } from './TransformSessionController';

/**
 * Root controller for Editor view
 */
export class EditorController {
    readonly collaborationController = createCollaborationController();
    readonly core: EditorControllerCore;
    private _currentPoint = Point.display(0, 0);
    private readonly modeControllers: Record<EditorMode, EditorModeController>;
    private scrollSession: ScrollSessionController | null = null;
    private transformSession: TransformSessionController | null = null;
    private singleLineTransformSession: SingleLineTransformSessionController | null = null;

    constructor(initialData: Patch<EditorState>) {
        this.modeControllers = {
            rect: new RectModeController(this),
            select: new SelectModeController(this),
            line: new LineModeController(this),
            text: new TextModeController(this),
            textEditing: new TextEditModeController(this),
        };
        this.core = new EditorControllerCore(new Store(EditorState.create(initialData)), this.collaborationController);
    }

    // Utility getters
    get store(): ReadonlyStore<EditorState> {
        return this.core.store;
    }

    get state(): EditorState {
        return this.store.state;
    }

    get currentPoint(): ModelCordPoint {
        return Point.toModel(this.state.camera, this._currentPoint);
    }

    private set currentPoint(point: ModelCordPoint) {
        this._currentPoint = Point.toDisplay(this.state.camera, point);
    }

    get modeController(): EditorModeController {
        return this.modeControllers[this.state.mode];
    }

    computeSelectedEntities(): EntityMap {
        const result: EntityMap = {};

        for (const id of this.state.selectMode.entityIds) {
            const entity = this.state.page.entities[id];
            if (!entity) continue;
            result[id] = entity;
        }

        return result;
    }

    // Commands

    setMode(mode: EditorMode) {
        this.modeController.onBeforeDeactivate?.();
        this.core.setMode(mode);
        this.modeController.onAfterActivate?.();
    }

    cut() {
        const selectedEntities = this.computeSelectedEntities();
        if (Record.size(selectedEntities) === 0) return;

        navigator.clipboard.writeText(JSON.stringify(selectedEntities));

        this.deleteEntities(this.state.selectMode.entityIds);
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
        this.core.addEntities(entities);
    }

    deleteEntities(entityIds: string[]) {
        this.core.deleteEntities(entityIds);
    }

    updateEntities(patches: Record<string, Patch<Entity>>) {
        this.core.updateEntities(patches);
    }

    deleteSelectedEntities() {
        this.deleteEntities(this.state.selectMode.entityIds);
    }

    setColor(palette: ColorPaletteKey) {
        this.core.setColor(palette);
    }

    setVerticalTextAlign(align: VerticalAlign) {
        this.core.setVerticalTextAlign(align);
    }

    setHorizontalTextAlign(align: HorizontalAlign) {
        this.core.setHorizontalTextAlign(align);
    }

    setSelection(entityIds: string[]) {
        const prevEntityIds = this.state.selectMode.entityIds;
        const nextEntityIds = entityIds.filter((entityId) => entityId in this.state.page.entities);

        this.core.setSelection(entityIds);
        this.setMode('select');

        const unselectedEntityIds = prevEntityIds.filter((entityId) => !nextEntityIds.includes(entityId));

        for (const entityId of unselectedEntityIds) {
            const entity = this.state.page.entities[entityId];
            if (!entity) continue;

            if (entity.type === 'text') {
                if (entity.text.trim() === '') {
                    this.core.deleteEntities([entity.id]);
                }
            }
        }

        this.modeController.onSelectedEntityChange?.(prevEntityIds, nextEntityIds);
    }

    addSelection(entityId: string) {
        this.setSelection([...this.state.selectMode.entityIds, entityId]);
    }

    selectAll() {
        this.setSelection(Object.keys(this.state.page.entities));
    }

    clearSelection() {
        this.setSelection([]);
    }

    setSelectingRange(range: ModelCordBox) {
        return this.core.setSelectingRange(range);
    }

    clearSelectingRange() {
        return this.core.clearSelectingRange();
    }

    openContextMenu(point: ModelCordPoint) {
        this.core.openContextMenu(point);
    }

    closeContextMenu() {
        this.core.closeContextMenu();
    }

    undo() {
        this.core.undo();
    }

    redo() {
        this.core.redo();
    }

    moveCamera(point: ModelCordPoint) {
        this.core.moveCamera(point);
    }

    setCameraScale(focus: ModelCordPoint, scale: number) {
        this.core.setCameraScale(focus, scale);
    }

    enableSnap() {
        this.core.enableSnap();
    }

    disableSnap() {
        this.core.disableSnap();
    }

    tryStartTextEditForSelectedEntity(editStartPoint = Point.display(0, 0)) {
        if (this.checkIfHoveredEntityTextEditable()) {
            this.startTextEdit(this.state.selectMode.entityIds[0]!, editStartPoint);
        }
    }

    startTextEdit(entityId: string, editStartPoint = Point.display(0, 0)) {
        this.core.startTextEdit(entityId, editStartPoint);
    }

    setEntityText(entityId: string, text: string) {
        this.core.setEntityText(entityId, text);
    }

    completeTextEdit() {
        this.core.completeTextEdit();
    }

    startTransform(entities: EntityMap, transformType: TransformType) {
        this.transformSession = new TransformSessionController(this, entities, transformType);
        this.core.startTransform(entities, transformType);
    }

    startSingleLineTransform(entity: LineEntity, pointKey: 'p1' | 'p2') {
        this.singleLineTransformSession = new SingleLineTransformSessionController(this, entity, pointKey);
        this.core.startSingleLineTransform(entity, pointKey);
    }

    // Event handlers

    onZoom = (diff: number) => {
        const newScale = Math.max(0.1, Math.min(this.state.camera.scale + diff, 5));

        this.setCameraScale(this.currentPoint, newScale);
    };

    onScroll = (diff: DisplayCordSize) => {
        const diffInModel = Size.toModel(this.state.camera, diff);

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
        const nextPoint = Point.toModel(this.state.camera, point);
        this.currentPoint = nextPoint;

        this.scrollSession?.onMouseMove(prevPoint, nextPoint);
        this.transformSession?.onMouseMove(prevPoint, nextPoint);
        this.singleLineTransformSession?.onMouseMove(prevPoint, nextPoint);
        this.modeController.onMouseMove?.(prevPoint, nextPoint);
    };

    onMouseUp = () => {
        this.core.completeTransform();

        this.scrollSession = null;
        this.transformSession = null;
        this.singleLineTransformSession = null;

        this.modeController.onMouseUp?.();
    };

    onClick = (info: MouseEventInfo) => {
        this.modeController.onClick?.(info);
    };

    onDoubleClick = (point: DisplayCordPoint) => {
        this.tryStartTextEditForSelectedEntity(point);
    };

    onHover = (hover: HoverState) => {
        this.core.setHover(hover);
    };

    onUnhover = () => {
        this.core.setHover(undefined);
    };

    onKeyDown = (ev: KeyboardEventInfo) => {
        if (ev.key === 'Control') this.enableSnap();

        const keys = [ev.key];
        if (ev.shiftKey) keys.push('Shift');
        if (ev.ctrlKey) keys.push('Control');

        switch (Key.serialize(keys)) {
            case Key.serialize(['Enter']): {
                if (this.state.mode !== 'textEditing') {
                    ev.preventDefault();
                    this.tryStartTextEditForSelectedEntity();
                }
                return;
            }
            case Key.serialize(['Escape']): {
                if (this.state.mode === 'textEditing') {
                    ev.preventDefault();
                    this.completeTextEdit();
                }
                return;
            }
            case Key.serialize(['V']): {
                if (this.state.mode === 'textEditing') return;
                this.setMode('select');
                return;
            }
            case Key.serialize(['R']): {
                if (this.state.mode === 'textEditing') return;
                this.setMode('rect');
                return;
            }
            case Key.serialize(['L']): {
                if (this.state.mode === 'textEditing') return;
                this.setMode('line');
                return;
            }
            case Key.serialize(['A']): {
                if (this.state.mode === 'textEditing') return;
                this.setMode('line');
                return;
            }
            case Key.serialize(['Delete']):
            case Key.serialize(['Backspace']): {
                if (this.state.mode === 'textEditing') return;
                ev.preventDefault();
                this.deleteSelectedEntities();
                return;
            }
            case Key.serialize(['Control', 'A']): {
                if (this.state.mode === 'textEditing') return;
                ev.preventDefault();
                this.selectAll();
                return;
            }
            case Key.serialize(['Control', 'X']): {
                if (this.state.mode === 'textEditing') return;
                ev.preventDefault();
                this.cut();
                return;
            }
            case Key.serialize(['Control', 'C']): {
                if (this.state.mode === 'textEditing') return;
                ev.preventDefault();
                this.copy();
                return;
            }
            case Key.serialize(['Control', 'V']): {
                if (this.state.mode === 'textEditing') return;
                ev.preventDefault();
                this.paste();
                return;
            }
            case Key.serialize(['Control', 'Z']): {
                if (this.state.mode === 'textEditing') return;
                ev.preventDefault();
                this.undo();
                return;
            }
            case Key.serialize(['Control', 'Shift', 'Z']):
            case Key.serialize(['Control', 'Y']): {
                if (this.state.mode === 'textEditing') return;
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
