import { randomId } from '../../../lib/randomId';
import { Record } from '../../../lib/Record';
import { ReadonlyStore, Store } from '../../../lib/Store';
import { ModelCordBox } from '../../../model/Box';
import { Patch } from '../../../model/Patch';
import { DisplayCordPoint, ModelCordPoint, Point } from '../../../model/Point';
import { DisplayCordSize, Size } from '../../../model/Size';
import { createCollaborationController } from '../dependency';
import { Camera } from '../model/Camera';
import { EditorMode } from '../model/EditorMode';
import { EditorState } from '../model/EditorState';
import { EntityMap } from '../model/EntityMap';
import { HoverState } from '../model/HoverState';
import { Key } from '../model/Key';
import { KeyboardEventInfo, MouseEventButton, MouseEventInfo } from '../model/MouseEventInfo';
import { ScrollSession } from '../model/session/ScrollSession';
import { Session } from '../model/session/Session';
import { EditController } from './EditController';
import { EditorModeController } from './EditorModeController/EditorModeController';
import { LineModeController } from './EditorModeController/LineModeController';
import { RectModeController } from './EditorModeController/RectModeController';
import { SelectModeController } from './EditorModeController/SelectModeController';

/**
 * Root controller for Editor view
 */
export class EditorController {
    readonly collaborationController = createCollaborationController();
    readonly editController: EditController;
    private _session: Session | null = null;
    private _currentPoint = Point.display(0, 0);
    private readonly _store: Store<EditorState>;
    private readonly modeControllers: Record<EditorMode, EditorModeController>;

    constructor(initialData: Patch<EditorState>) {
        this._store = new Store(EditorState.create(initialData));
        this.modeControllers = {
            rect: new RectModeController(this),
            select: new SelectModeController(this),
            line: new LineModeController(this),
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

    get session(): Session | null {
        return this._session;
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
        return Record.mapToRecord(this.state.selectedEntityIds, (id) => [id, this.store.state.page.entities[id]]);
    }

    // Session

    startSession(session: Session) {
        if (this.session !== null) {
            console.warn('Another session on going.');
            console.dir(this.session);
            return;
        }

        this._session = session;
        session.start?.(this);
    }

    updateSession() {
        const session = this.session;
        if (session === null) {
            console.warn('No session on going.');
            return;
        }
        session.update?.(this);
    }

    completeSession() {
        const session = this.session;
        if (session === null) {
            console.warn('No session on going.');
            return;
        }
        session.complete?.(this);
        this._session = null;
    }

    // Commands

    private setState(patch: Patch<EditorState>) {
        this._store.setState(patch);
    }

    setMode(mode: EditorMode) {
        this.modeController.onBeforeDeactivate?.();
        this.setState({ mode });
        this.modeController.onAfterActivate?.();
    }

    cut() {
        const selectedEntities = this.computeSelectedEntities();
        if (Record.size(selectedEntities) === 0) return;

        navigator.clipboard.writeText(JSON.stringify(selectedEntities));

        this.deleteEntities(this.store.state.selectedEntityIds);
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
        this.deleteEntities(this.state.selectedEntityIds);
    }

    setColor(color: string) {
        this.editController.setColor(color);
    }

    setSelection(entityIds: string[]) {
        this.setState({
            selectedEntityIds: entityIds.filter((entityId) => entityId in this.state.page.entities),
            mode: 'select',
        });
    }

    addSelection(entityId: string) {
        this.setSelection([...this.state.selectedEntityIds, entityId]);
    }

    selectAll() {
        this.setSelection(Object.keys(this.store.state.page.entities));
    }

    clearSelection() {
        this.setSelection([]);
    }

    setSelectingRange(range: ModelCordBox) {
        return this._store.setState({
            selectingRange: {
                selecting: true,
                range,
            },
        });
    }

    clearSelectingRange() {
        return this._store.setState({
            selectingRange: {
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
            this.startSession(new ScrollSession(this.currentPoint, this.state.camera));
        }
        this.modeController.onMouseDown?.(info);
    };

    onMouseMove = (point: DisplayCordPoint) => {
        const prevPoint = this.currentPoint;
        const nextPoint = Point.toModel(this.store.state.camera, point);
        this.currentPoint = nextPoint;

        if (this.session !== null) {
            this.updateSession();
        }
        this.modeController.onMouseMove?.(prevPoint, nextPoint);
    };

    onMouseUp = () => {
        if (this.session !== null) {
            this.completeSession();
        }
        this.modeController.onMouseUp?.();
    };

    onHover = (hover: HoverState) => {
        this.modeController.onHover?.(hover);
        this.setState({ hover });
    };

    onUnhover = () => {
        if (this.store.state.hover === HoverState.IDLE) return;

        this.modeController.onUnhover?.(this.store.state.hover);
        this.setState({ hover: HoverState.IDLE });
    };

    onKeyDown = (ev: KeyboardEventInfo) => {
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
}
