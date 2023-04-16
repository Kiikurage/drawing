import { MYPointerEvent } from './MYPointerEvent';
import { DragSession } from '@drawing/common/src/Editor/GestureRecognizer/DragSession';

export interface MYDragEvent extends MYPointerEvent {
    session: DragSession;
}
