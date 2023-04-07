import { PageEditController } from './PageEditController';
import {
    Camera,
    DisplayCordSize,
    Entity,
    EntityMap,
    EventDispatcher,
    HistoryManager,
    HoverState,
    Patch,
    Point,
    Record,
    Size,
    Store,
} from '@drawing/common';
import { PageEditSession } from './PageEditSession';
import {
    IEditorController,
    KeyboardEventInfo,
    MouseEventInfo,
    ScrollEvent,
    UIMouseEvent,
    UIZoomEvent,
    ZoomEvent,
} from './IEditorController';
import { Extension } from './Extension';
import { ShortcutController } from './ShortcutController';
import { ExtensionConstructor } from './ExtensionHost';
import { EditorState } from '../model/EditorState';

/**
 * Root controller for Editor view
 */
export class EditorController implements IEditorController {
    readonly shortcuts = new ShortcutController();
    readonly store: Store<EditorState>;
    readonly core: PageEditController;
    readonly historyManager = new HistoryManager();
    private readonly extensions = new Map<ExtensionConstructor, Extension>();

    constructor(initialData: Patch<EditorState>) {
        this.store = new Store(EditorState.create(initialData));
        this.core = new PageEditController(this.store, this.historyManager);
        this.initializeShortcuts();
    }

    // Extension

    addExtension(ExtensionConstructor: ExtensionConstructor): this {
        if (!this.extensions.has(ExtensionConstructor)) {
            const extension = new ExtensionConstructor();
            extension.onRegister(this);
            this.extensions.set(ExtensionConstructor, extension);
        }
        return this;
    }

    requireExtension<T extends Extension>(ExtensionConstructor: ExtensionConstructor<T>): T {
        let extension = this.extensions.get(ExtensionConstructor);
        if (extension === undefined) {
            extension = new ExtensionConstructor();
            extension.onRegister(this);
            this.extensions.set(ExtensionConstructor, extension);
        }

        return extension as T;
    }

    getExtension<T extends Extension>(ExtensionConstructor: ExtensionConstructor<T>): T {
        const extension = this.extensions.get(ExtensionConstructor);
        if (extension === undefined) throw new Error(`Extension "${ExtensionConstructor.name}" is not registered`);

        return extension as T;
    }

    // Utility getters
    get state(): EditorState {
        return this.store.state;
    }

    get camera(): Camera {
        return this.state.camera;
    }

    // Core editing

    addEntities(entities: EntityMap) {
        this.core.addEntities(entities);
    }

    deleteEntities(entityIds: string[]) {
        this.core.deleteEntities(entityIds);
    }

    updateEntities(type: string, patches: Record<string, Patch<Entity>>) {
        this.core.updateEntities(type, patches);
    }

    // history

    undo() {
        this.historyManager.undo();
    }

    redo() {
        this.historyManager.redo();
    }

    newSession(): PageEditSession {
        return this.core.newSession();
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

    readonly onHover = (hover: HoverState) => {
        this.store.setState({ hover });
    };

    readonly onUnhover = () => {
        this.store.setState({ hover: HoverState.IDLE });
    };

    readonly onKeyDown = (ev: KeyboardEventInfo) => {
        this.shortcuts.onKeyDown(ev);
    };

    readonly onKeyUp = (ev: KeyboardEventInfo) => {
        this.shortcuts.onKeyUp(ev);
    };

    private initializeShortcuts() {
        this.shortcuts
            .addPatternListener(['Control', 'Z'], (ev) => {
                ev.preventDefault();
                this.undo();
            })
            .addPatternListener(['Control', 'Shift', 'Z'], (ev) => {
                ev.preventDefault();
                this.redo();
            })
            .addPatternListener(['Control', 'Y'], (ev) => {
                ev.preventDefault();
                this.redo();
            });
    }
}
