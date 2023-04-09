import { EditController } from './EditController';
import {
    Camera,
    dispatcher,
    DisplayCordPoint,
    DisplayCordSize,
    Entity,
    EntityMap,
    HoverState,
    ModelCordPoint,
    ModelCordSize,
    Patch,
    Point,
    Record,
    Size,
    Store,
} from '@drawing/common';
import { PageEditSession } from './PageEditSession';
import { Extension } from './Extension';
import { KeyboardController } from './KeyboardController';
import { ExtensionConstructor, ExtensionHost } from './ExtensionHost';
import { EditorState } from '../model/EditorState';
import { CoreExtensions } from '../extensions/coreExtensions';

/**
 * Root controller for Editor view
 */
export class Editor implements ExtensionHost {
    readonly store: Store<EditorState>;
    readonly keyboard = new KeyboardController();
    readonly edit: EditController;
    private readonly extensions = new Map<ExtensionConstructor, Extension>();

    constructor(initialData: Patch<EditorState>) {
        this.store = new Store(EditorState.create(initialData));
        this.edit = new EditController(this.store);
        this.initializeShortcuts();

        CoreExtensions.forEach((extension) => this.addExtension(extension));
    }

    // Extension

    addExtension(ExtensionConstructor: ExtensionConstructor): this {
        if (!this.extensions.has(ExtensionConstructor)) {
            const extension = new ExtensionConstructor();
            extension.initialize(this);
            this.extensions.set(ExtensionConstructor, extension);
        }
        return this;
    }

    requireExtension<T extends Extension>(ExtensionConstructor: ExtensionConstructor<T>): T {
        let extension = this.extensions.get(ExtensionConstructor);
        if (extension === undefined) {
            extension = new ExtensionConstructor();
            extension.initialize(this);
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
        this.edit.addEntities(entities);
    }

    deleteEntities(entityIds: string[]) {
        this.edit.deleteEntities(entityIds);
    }

    updateEntities(patches: Record<string, Patch<Entity>>) {
        this.edit.updateEntities(patches);
    }

    // history

    undo() {
        this.edit.undo();
    }

    redo() {
        this.edit.redo();
    }

    newSession(): PageEditSession {
        return this.edit.newSession();
    }

    // Event handlers

    readonly handleZoom = (pointInDisplay: DisplayCordPoint, diff: number) => {
        this.onZoom.dispatch({
            diff,
            point: Point.toModel(this.state.camera, pointInDisplay),
            pointInDisplay,
        });
    };

    readonly handleScroll = (diffInDisplay: DisplayCordSize) => {
        this.onScroll.dispatch({
            diff: Size.toModel(this.state.camera, diffInDisplay),
            diffInDisplay,
        });
    };

    readonly handleMouseDown = (ev: UIMouseEvent) => {
        this.onMouseDown.dispatch({
            ...ev,
            point: Point.toModel(this.state.camera, ev.pointInDisplay),
        });
    };

    readonly handleMouseMove = (ev: UIMouseEvent) => {
        this.onMouseMove.dispatch({
            ...ev,
            point: Point.toModel(this.state.camera, ev.pointInDisplay),
        });
    };

    readonly handleMouseUp = (ev: UIMouseEvent) => {
        this.onMouseUp.dispatch({
            ...ev,
            point: Point.toModel(this.state.camera, ev.pointInDisplay),
        });
    };

    readonly handleDoubleClick = (ev: UIMouseEvent) => {
        this.onDoubleClick.dispatch({
            ...ev,
            point: Point.toModel(this.state.camera, ev.pointInDisplay),
        });
    };

    readonly handleHover = (hover: HoverState) => {
        this.store.setState({ hover });
    };

    readonly handleUnhover = () => {
        this.store.setState({ hover: HoverState.IDLE });
    };

    readonly handleKeyDown = (ev: KeyboardEventInfo) => {
        this.keyboard.handleKeyDown(ev);
    };

    readonly handleKeyUp = (ev: KeyboardEventInfo) => {
        this.keyboard.handleKeyUp(ev);
    };

    // Events

    readonly onZoom = dispatcher<ZoomEvent>();

    readonly onScroll = dispatcher<ScrollEvent>();

    readonly onMouseDown = dispatcher<MouseEventInfo>();

    readonly onMouseMove = dispatcher<MouseEventInfo>();

    readonly onMouseUp = dispatcher<MouseEventInfo>();

    readonly onDoubleClick = dispatcher<MouseEventInfo>();

    private initializeShortcuts() {
        this.keyboard
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
