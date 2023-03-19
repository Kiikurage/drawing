import { TransformHandle } from './TransformHandle';

export type HoverState = EntityHoverState | TransformHandleHoverState;

export interface EntityHoverState {
    type: 'entity';
    entityId: string;
}

export interface TransformHandleHoverState {
    type: 'transformHandle';
    handle: TransformHandle;
}

export module TransformHandleHoverState {
    export const RESIZE_TOP_LEFT: TransformHandleHoverState = { type: 'transformHandle', handle: 'resize.topLeft' };
    export const RESIZE_TOP: TransformHandleHoverState = { type: 'transformHandle', handle: 'resize.top' };
    export const RESIZE_TOP_RIGHT: TransformHandleHoverState = { type: 'transformHandle', handle: 'resize.topRight' };
    export const RESIZE_LEFT: TransformHandleHoverState = { type: 'transformHandle', handle: 'resize.left' };
    export const RESIZE_RIGHT: TransformHandleHoverState = { type: 'transformHandle', handle: 'resize.right' };
    export const RESIZE_BOTTOM_LEFT: TransformHandleHoverState = {
        type: 'transformHandle',
        handle: 'resize.bottomLeft',
    };
    export const RESIZE_BOTTOM: TransformHandleHoverState = { type: 'transformHandle', handle: 'resize.bottom' };
    export const RESIZE_BOTTOM_RIGHT: TransformHandleHoverState = {
        type: 'transformHandle',
        handle: 'resize.bottomRight',
    };
    export const TRANSLATE: TransformHandleHoverState = { type: 'transformHandle', handle: 'translate' };
    export const ROTATE: TransformHandleHoverState = { type: 'transformHandle', handle: 'rotate' };
}
