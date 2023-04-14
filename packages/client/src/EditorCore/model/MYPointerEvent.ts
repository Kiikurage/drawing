import { MYMouseEvent } from './MYMouseEvent';

export interface MYPointerEvent extends MYMouseEvent {
    pointerType: string;
    pointerId: number;
}
