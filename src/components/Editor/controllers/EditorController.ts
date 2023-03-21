import { signInAnonymously } from 'firebase/auth';
import { get, onValue, ref, set } from 'firebase/database';
import { lighten } from 'polished';
import { getAuth, getDatabase } from '../../../firebaseConfig';
import { Record } from '../../../lib/Record';
import { Store } from '../../../lib/Store';
import { uuid } from '../../../lib/uuid';
import { Page } from '../../../model/Page';
import { Patch } from '../../../model/Patch';
import { DisplayCordPoint, ModelCordPoint, Point } from '../../../model/Point';
import { DisplayCordSize, ModelCordSize, Size } from '../../../model/Size';
import { Camera } from '../model/Camera';
import { EditorMode } from '../model/EditorMode';
import { EditorState } from '../model/EditorState';
import { EntityMap } from '../model/EntityMap';
import { HoverState } from '../model/HoverState';
import { Key } from '../model/Key';
import { KeyboardEventInfo, MouseEventInfo } from '../model/MouseEventInfo';
import { Session } from '../model/session/Session';
import { EditorModeController } from './EditorModeController/EditorModeController';
import { LineModeController } from './EditorModeController/LineModeController';
import { RectModeController } from './EditorModeController/RectModeController';
import { SelectModeController } from './EditorModeController/SelectModeController';

/**
 * Root controller for Editor view
 */
export class EditorController {
    readonly store: Store<EditorState>;
    session: Session | null = null;
    readonly undoStack: Page[] = [];
    readonly redoStack: Page[] = [];

    private modeControllers: Record<EditorMode, EditorModeController>;

    private _currentPoint = Point.display(0, 0);

    constructor(initialData: Patch<EditorState>) {
        this.store = new Store(EditorState.create(initialData));
        this.initializeDBConnection();
        this.modeControllers = {
            rect: new RectModeController(this),
            select: new SelectModeController(this),
            line: new LineModeController(this),
        };
    }

    private initializeDBConnection() {
        const page = this.store.state.page;
        const db = getDatabase();
        const pageRef = ref(db, `page/${page.id}`);
        onValue(pageRef, (snapshot) => {
            const nextPage = snapshot.val() as Page | null;
            if (nextPage === null) return;
            this.onPageUpdated(nextPage);
        });
    }

    onPageUpdated = (nextPage: Page) => {
        this.store.setState({ page: nextPage });
    };

    get currentPoint(): ModelCordPoint {
        return this.toModelPoint(this._currentPoint);
    }

    get modeController(): EditorModeController {
        return this.modeControllers[this.store.state.mode];
    }

    get camera(): Camera {
        return this.store.state.camera;
    }

    computeSelectedEntities(): EntityMap {
        return Record.mapToRecord(this.store.state.selectedEntityIds, (id) => [id, this.store.state.page.entities[id]]);
    }

    setMode(mode: EditorMode) {
        this.modeController.onBeforeDeactivate?.();
        this.store.setState({ mode });
        this.modeController.onAfterActivate?.();
    }

    // Session

    startSession(session: Session) {
        if (this.session !== null) {
            console.warn('Another session on going.');
            console.dir(this.session);
            return;
        }

        this.session = session;
        this.store.setState(session.start(this));
    }

    updateSession() {
        const session = this.session;
        if (session === null) {
            console.warn('No session on going.');
            return;
        }
        this.store.setState(session.update(this));
    }

    completeSession() {
        const session = this.session;
        if (session === null) {
            console.warn('No session on going.');
            return;
        }
        this.store.setState(session.complete(this));
        this.session = null;
        this.syncToDB();
    }

    // Event handlers

    onZoom = (diff: number) => {
        this.modeController.onZoom?.(diff);
    };

    onScroll = (diff: DisplayCordSize) => {
        this.modeController.onScroll?.(this.toModelSize(diff));
    };

    onMouseDown = (info: MouseEventInfo) => this.modeController.onMouseDown?.(info);

    onMouseMove = (point: DisplayCordPoint) => {
        const prevPoint = this.currentPoint;
        const nextPoint = this.toModelPoint(point);
        this.modeController.onMouseMove?.(prevPoint, nextPoint);
        this._currentPoint = point;
    };

    onMouseUp = () => this.modeController.onMouseUp?.();

    onHover = (hover: HoverState) => {
        this.modeController.onHover?.(hover);
        this.store.setState({ hover });
    };

    onUnhover = () => {
        if (this.store.state.hover === HoverState.IDLE) return;

        this.modeController.onUnhover?.(this.store.state.hover);
        this.store.setState({ hover: HoverState.IDLE });
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
                this.deleteSelectedEntity();
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

    saveSnapshot() {
        this.undoStack.push(this.store.state.page);
        this.redoStack.length = 0;
    }

    private async syncToDB() {
        const page = this.store.state.page;

        const db = getDatabase();
        const pageRef = ref(db, `page/${page.id}`);
        set(pageRef, page);

        const auth = getAuth();
        const { user } = await signInAnonymously(auth);

        const historyRef = ref(db, `history/${user.uid}`);
        const prevHistory = (await get(historyRef)).val() as string[] | null;
        if (!prevHistory?.includes(page.id)) {
            const nextHistory = [...(prevHistory ?? []), page.id];
            set(historyRef, nextHistory);
        }
    }

    undo() {
        const page = this.undoStack.pop();
        if (page === undefined) return;

        const currentPage = this.store.state.page;
        this.store.setState({ page });
        this.redoStack.push(currentPage);

        this.syncToDB();
    }

    redo() {
        const page = this.redoStack.pop();
        if (page === undefined) return;

        const currentPage = this.store.state.page;
        this.store.setState({ page });
        this.undoStack.push(currentPage);

        this.syncToDB();
    }

    cut() {
        const selectedEntities = this.computeSelectedEntities();
        if (Record.size(selectedEntities) === 0) return;

        navigator.clipboard.writeText(JSON.stringify(selectedEntities));

        this.deleteSelectedEntity();
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
            const id = uuid();
            return [id, Patch.apply(entity, { id })];
        });

        this.saveSnapshot();
        this.store.setState({
            page: { entities },
            selectedEntityIds: Object.keys(entities),
            mode: 'select',
        });
        this.syncToDB();
    }

    selectAll() {
        this.store.setState({
            selectedEntityIds: Object.keys(this.store.state.page.entities),
        });
    }

    deleteSelectedEntity() {
        const deletedEntityMask = Record.mapToRecord(this.store.state.selectedEntityIds, (id) => [id, undefined]);
        this.store.setState({
            page: {
                entities: deletedEntityMask,
            },
            selectedEntityIds: [],
        });
        this.syncToDB();
    }

    setColor(color: string) {
        this.saveSnapshot();

        const entitiesPatch = Object.fromEntries(
            this.store.state.selectedEntityIds.map((id) => {
                return [
                    id,
                    {
                        strokeColor: color,
                        fillColor: lighten(0.3, color),
                    },
                ];
            })
        );
        this.store.setState({ page: { entities: entitiesPatch } });
        this.syncToDB();
    }

    private toModelPoint(point: DisplayCordPoint): ModelCordPoint {
        return Point.toModel(this.camera, point);
    }

    private toModelSize(size: DisplayCordSize): ModelCordSize {
        return Size.toModel(this.camera, size);
    }
}
