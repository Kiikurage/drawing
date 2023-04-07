import {
    Camera,
    DisplayCordPoint,
    DisplayCordSize,
    Entity,
    EntityMap,
    EventDispatcher,
    HoverState,
    ModelCordPoint,
    ModelCordSize,
    Patch,
    Record,
    Store,
} from '@drawing/common';
import { PageEditSession } from './PageEditSession';
import { ShortcutController } from './ShortcutController';
import { ExtensionHost } from './ExtensionHost';
import { EditorState } from '../model/EditorState';

/**
 * Root controller for Editor view
 */
export interface IEditorController extends ExtensionHost {
    // Utility getters

    readonly shortcuts: ShortcutController;

    readonly store: Store<EditorState>;

    readonly state: EditorState;

    readonly camera: Camera;

    // computeSelectedEntities(): EntityMap;

    // Core Edit

    addEntities(entities: EntityMap): void;

    deleteEntities(entityIds: string[]): void;

    updateEntities(type: string, patches: Record<string, Patch<Entity>>): void;

    // history

    undo(): void;

    redo(): void;

    newSession(): PageEditSession;

    // Event handlers

    readonly onZoom: EventDispatcher<ZoomEvent, [UIZoomEvent]>;
    readonly onScroll: EventDispatcher<ScrollEvent, [DisplayCordSize]>;
    readonly onMouseDown: EventDispatcher<MouseEventInfo, [UIMouseEvent]>;
    readonly onMouseMove: EventDispatcher<MouseEventInfo, [UIMouseEvent]>;
    readonly onMouseUp: EventDispatcher<MouseEventInfo, [UIMouseEvent]>;
    readonly onDoubleClick: EventDispatcher<MouseEventInfo, [UIMouseEvent]>;

    onHover(hover: HoverState): void;

    onUnhover(): void;

    onKeyDown(ev: KeyboardEventInfo): void;

    onKeyUp(ev: KeyboardEventInfo): void;
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
