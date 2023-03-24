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
        transformType: TransformType.RESIZE_TOP_LEFT,
    };
    export const RESIZE_HANDLE_TOP: TransformHandleHoverState = {
        type: 'transformHandle',
        transformType: TransformType.RESIZE_TOP,
    };
    export const RESIZE_HANDLE_TOP_RIGHT: TransformHandleHoverState = {
        type: 'transformHandle',
        transformType: TransformType.RESIZE_TOP_RIGHT,
    };
    export const RESIZE_HANDLE_LEFT: TransformHandleHoverState = {
        type: 'transformHandle',
        transformType: TransformType.RESIZE_LEFT,
    };
    export const RESIZE_HANDLE_RIGHT: TransformHandleHoverState = {
        type: 'transformHandle',
        transformType: TransformType.RESIZE_RIGHT,
    };
    export const RESIZE_HANDLE_BOTTOM_LEFT: TransformHandleHoverState = {
        type: 'transformHandle',
        transformType: TransformType.RESIZE_BOTTOM_LEFT,
    };
    export const RESIZE_HANDLE_BOTTOM: TransformHandleHoverState = {
        type: 'transformHandle',
        transformType: TransformType.RESIZE_BOTTOM,
    };
    export const RESIZE_HANDLE_BOTTOM_RIGHT: TransformHandleHoverState = {
        type: 'transformHandle',
        transformType: TransformType.RESIZE_BOTTOM_RIGHT,
    };
    export const TRANSLATE_HANDLE: TransformHandleHoverState = {
        type: 'transformHandle',
        transformType: TransformType.TRANSLATE,
    };
}
