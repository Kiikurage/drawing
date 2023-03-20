import { lighten } from 'polished';
import { Store } from '../../../lib/Store';
import { uuid } from '../../../lib/uuid';
import { Entity } from '../../../model/entity/Entity';
import { Page } from '../../../model/Page';
import { Patch } from '../../../model/Patch';
import { DisplayCordPoint, ModelCordPoint, Point } from '../../../model/Point';
import { DisplayCordSize, ModelCordSize, Size } from '../../../model/Size';
import { Camera } from '../model/Camera';
import { EditorMode } from '../model/EditorMode';
import { EditorState } from '../model/EditorState';
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

    private _currentPoint = Point.display({ x: 0, y: 0 });

    constructor(initialData: Patch<EditorState>) {
        this.store = new Store(EditorState.create(initialData));
        this.modeControllers = {
            rect: new RectModeController(this),
            select: new SelectModeController(this),
            line: new LineModeController(this),
        };
    }

    get currentPoint(): ModelCordPoint {
        return this.toModelPoint(this._currentPoint);
    }

    get modeController(): EditorModeController {
        return this.modeControllers[this.store.state.mode];
    }

    get camera(): Camera {
        return this.store.state.camera;
    }

    get selectedEntities(): Entity[] {
        return this.store.state.page.entities.filter((entity) =>
            this.store.state.selectedEntityIds.includes(entity.id)
        );
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
        this.updateSession();
    }

    updateSession() {
        const transaction = this.session;
        if (transaction === null) {
            console.warn('No transaction on going.');
            return;
        }
        this.store.setState(transaction.update(this));
    }

    completeSession() {
        const transaction = this.session;
        if (transaction === null) {
            console.warn('No transaction on going.');
            return;
        }
        this.session = null;
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
        if (this.store.state.hover === null) return;

        this.modeController.onUnhover?.(this.store.state.hover);
        this.store.setState({ hover: null });
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

    cut() {
        const selectedEntities = this.store.state.page.entities.filter((entity) => {
            return this.store.state.selectedEntityIds.includes(entity.id);
        });
        if (selectedEntities.length === 0) return;

        navigator.clipboard.writeText(JSON.stringify(selectedEntities));

        this.saveSnapshot();
        this.store.setState({
            page: {
                entities: this.store.state.page.entities.filter(
                    (entity) => !this.store.state.selectedEntityIds.includes(entity.id)
                ),
            },
            selectedEntityIds: [],
        });
    }

    copy() {
        const selectedEntities = this.store.state.page.entities.filter((entity) => {
            return this.store.state.selectedEntityIds.includes(entity.id);
        });
        if (selectedEntities.length === 0) return;

        navigator.clipboard.writeText(JSON.stringify(selectedEntities));
    }

    async paste() {
        const json = await navigator.clipboard.readText();
        let entities: Entity[] = [];
        try {
            entities = JSON.parse(json) as Entity[];
        } catch (ignored) {
            return;
        }
        const newEntities = entities.map((entity) => Patch.apply(entity, { id: uuid() }));

        this.saveSnapshot();
        this.store.setState({
            page: {
                entities: [...this.store.state.page.entities, ...newEntities],
            },
            selectedEntityIds: newEntities.map((entity) => entity.id),
            mode: 'select',
        });
    }

    selectAll() {
        this.store.setState({
            selectedEntityIds: this.store.state.page.entities.map((entity) => entity.id),
        });
    }

    deleteSelectedEntity() {
        this.store.setState({
            page: {
                entities: this.store.state.page.entities.filter(
                    (entity) => !this.store.state.selectedEntityIds.includes(entity.id)
                ),
            },
            selectedEntityIds: [],
        });
    }

    setColor(color: string) {
        this.store.setState({
            page: {
                entities: this.store.state.page.entities.map((entity) => {
                    if (this.store.state.selectedEntityIds.includes(entity.id)) {
                        return {
                            ...entity,
                            strokeColor: color,
                            fillColor: lighten(0.3, color),
                        };
                    } else {
                        return entity;
                    }
                }),
            },
        });
    }

    private toModelPoint(point: DisplayCordPoint): ModelCordPoint {
        return Point.toModel(this.camera, point);
    }

    private toModelSize(size: DisplayCordSize): ModelCordSize {
        return Size.toModel(this.camera, size);
    }
}
