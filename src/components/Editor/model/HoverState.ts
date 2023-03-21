import { TransformType } from './TransformType';

export type HoverState = IdleHoverState | EntityHoverState | TransformHandleHoverState;

export interface IdleHoverState {
    type: 'idle';
}

export interface EntityHoverState {
    type: 'entity';
    entityId: string;
}

export interface TransformHandleHoverState {
    type: 'transformHandle';
    transformType: TransformType;
}

export module HoverState {
    export const IDLE: IdleHoverState = { type: 'idle' };
    export const RESIZE_HANDLE_TOP_LEFT: TransformHandleHoverState = {
        type: 'transformHandle',
        transformType: 'resize.topLeft',
    };
    export const RESIZE_HANDLE_TOP: TransformHandleHoverState = {
        type: 'transformHandle',
        transformType: 'resize.top',
    };
    export const RESIZE_HANDLE_TOP_RIGHT: TransformHandleHoverState = {
        type: 'transformHandle',
        transformType: 'resize.topRight',
    };
    export const RESIZE_HANDLE_LEFT: TransformHandleHoverState = {
        type: 'transformHandle',
        transformType: 'resize.left',
    };
    export const RESIZE_HANDLE_RIGHT: TransformHandleHoverState = {
        type: 'transformHandle',
        transformType: 'resize.right',
    };
    export const RESIZE_HANDLE_BOTTOM_LEFT: TransformHandleHoverState = {
        type: 'transformHandle',
        transformType: 'resize.bottomLeft',
    };
    export const RESIZE_HANDLE_BOTTOM: TransformHandleHoverState = {
        type: 'transformHandle',
        transformType: 'resize.bottom',
    };
    export const RESIZE_HANDLE_BOTTOM_RIGHT: TransformHandleHoverState = {
        type: 'transformHandle',
        transformType: 'resize.bottomRight',
    };
    export const TRANSLATE_HANDLE: TransformHandleHoverState = { type: 'transformHandle', transformType: 'translate' };
    export const ROTATE_HANDLE: TransformHandleHoverState = { type: 'transformHandle', transformType: 'rotate' };
}
