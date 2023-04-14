import { MYPointerEvent } from './MYPointerEvent';
import { DragSession } from '../gesture/DragSession';

export interface MYDragEvent extends MYPointerEvent {
    session: DragSession;
}
