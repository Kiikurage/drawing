import { EventDispatcher } from '../../../lib/EventDispatcher';
import { randomId } from '../../../lib/randomId';
import { Record } from '../../../lib/Record';
import { ReadonlyStore, Store } from '../../../lib/Store';
import { ModelCordBox } from '../../../model/Box';
import { Entity } from '../../../model/entity/Entity';
import { Patch } from '../../../model/Patch';
import { DisplayCordPoint, ModelCordPoint, Point } from '../../../model/Point';
import { DisplayCordSize, ModelCordSize, Size } from '../../../model/Size';
import { HorizontalAlign, VerticalAlign } from '../../../model/TextAlign';
import { deps } from '../../../config/dependency';
import { Camera } from '../model/Camera';
import { ColorPaletteKey } from '../model/ColorPalette';
import { EditorMode } from '../model/EditorMode';
import { EditorState } from '../model/EditorState';
import { EntityMap } from '../model/EntityMap';
import { HoverState } from '../model/HoverState';
import { Key } from '../model/Key';
import { EditorControllerCore } from './EditorControllerCore';
import { Extension } from './extensions/Extension';
import { ArrowHeadType } from '../../../model/ArrowHeadType';

/**
 * Root controller for Editor view
 */
export class EditorController {
    readonly collaborationController = deps.createCollaborationController();
    readonly core: EditorControllerCore;

    constructor(initialData: Patch<EditorState>) {
        this.core = new EditorControllerCore(new Store(EditorState.create(initialData)), this.collaborationController);
    }

    addExtension(extension: Extension): this {
        extension.onRegister(this);
        return this;
    }

    // Utility getters
    get store(): ReadonlyStore<EditorState> {
        return this.core.store;
    }

    get state(): EditorState {
        return this.store.state;
    }

    get mode(): EditorMode {
        return this.state.mode;
    }

    get camera(): Camera {
        return this.state.camera;
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
        this.onModeChange(mode);
        this.core.setMode(mode);
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
        this.core.setColor(this.state.selectMode.entityIds, palette);
    }

    setArrowHeadType(entityIds: string[], point: 'p1' | 'p2', type: ArrowHeadType) {
        this.core.setArrowHeadType(entityIds, point, type);
    }

    setArrowHeadTypeForSelectedEntities(point: 'p1' | 'p2', type: ArrowHeadType) {
        this.core.setArrowHeadType(this.state.selectMode.entityIds, point, type);
    }

    setLineLabelText(entityId: string, label: string) {
        this.core.setLineLabelText(entityId, label);
    }

    setVerticalTextAlign(align: VerticalAlign) {
        this.core.setVerticalTextAlign(this.state.selectMode.entityIds, align);
    }

    setHorizontalTextAlign(align: HorizontalAlign) {
        this.core.setHorizontalTextAlign(this.state.selectMode.entityIds, align);
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

        // this.modeController.onSelectedEntityChange?.(prevEntityIds, nextEntityIds);
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

    setCamera(camera: Camera) {
        this.core.setCamera(camera);
    }

    enableSnap() {
        this.core.enableSnap();
    }

    disableSnap() {
        this.core.disableSnap();
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

    // Event handlers

    readonly onZoom = EventDispatcher((ev: UIZoomEvent) => {
        return {
            ...ev,
            point: Point.toModel(this.state.camera, ev.pointInDisplay),
        } satisfies ZoomEvent;
    });

    readonly onScroll = EventDispatcher((diffInDisplay: DisplayCordSize) => {
        return {
            diff: Size.toModel(this.state.camera, diffInDisplay),
            diffInDisplay,
        } satisfies ScrollEvent;
    });

    readonly onMouseDown = EventDispatcher((ev: UIMouseEvent) => {
        return {
            ...ev,
            point: Point.toModel(this.state.camera, ev.pointInDisplay),
        } satisfies MouseEventInfo;
    });

    readonly onMouseMove = EventDispatcher((ev: UIMouseEvent) => {
        return {
            ...ev,
            point: Point.toModel(this.state.camera, ev.pointInDisplay),
        };
    });

    readonly onMouseUp = EventDispatcher((ev: UIMouseEvent) => {
        return {
            ...ev,
            point: Point.toModel(this.camera, ev.pointInDisplay),
        };
    });

    readonly onDoubleClick = EventDispatcher((ev: UIMouseEvent) => {
        return {
            ...ev,
            point: Point.toModel(this.camera, ev.pointInDisplay),
        };
    });

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
            // case Key.serialize(['Enter']): {
            //     if (this.state.mode !== 'textEditing') {
            //         ev.preventDefault();
            //         this.tryStartTextEditForSelectedEntity();
            //     }
            //     return;
            // }
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

    readonly onModeChange = EventDispatcher((nextMode: EditorMode) => {
        const prevMode = this.state.mode;

        return { prevMode, nextMode } satisfies ModeChangeEvent;
    });
}

export interface UIMouseEvent {
    pointInDisplay: DisplayCordPoint;
    shiftKey: boolean;
    button: number;
}

export interface MouseEventInfo {
    point: ModelCordPoint;
    pointInDisplay: DisplayCordPoint;
    shiftKey: boolean;
    button: number;
}

export module MouseEventButton {
    export const PRIMARY = 0;
    export const WHEEL = 1;
    export const SECONDARY = 2;
}
export type MouseEventButton =
    | typeof MouseEventButton.PRIMARY
    | typeof MouseEventButton.WHEEL
    | typeof MouseEventButton.SECONDARY;

export interface KeyboardEventInfo {
    preventDefault: () => void;
    shiftKey: boolean;
    ctrlKey: boolean;
    key: string;
}

export interface UIZoomEvent {
    pointInDisplay: DisplayCordPoint;
    diff: number;
}

export interface ZoomEvent {
    point: ModelCordPoint;
    pointInDisplay: DisplayCordPoint;
    diff: number;
}

export interface ScrollEvent {
    diff: ModelCordSize;
    diffInDisplay: DisplayCordSize;
}

export interface ModeChangeEvent {
    prevMode: EditorMode;
    nextMode: EditorMode;
}
