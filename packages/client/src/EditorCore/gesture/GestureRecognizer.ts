import { DragSession } from './DragSession';
import { MYPointerEvent } from '../model/MYPointerEvent';
import { MYDragEvent } from '../model/MYDragEvent';
import { EditorViewEvents } from '../EditorViewEvents/EditorViewEvents';
import { dispatcher } from '@drawing/common/src/lib/Dispatcher';

const HOLD_THRESHOLD_IN_MS = 600;

export class GestureRecognizer {
    private readonly pointerDownEvents = new Map<number, MYPointerEvent>();
    private readonly sessions = new Map<number, DragSession>();

    constructor(private readonly editorViewEvents: EditorViewEvents) {
        editorViewEvents.onPointerDown.addListener(this.handlePointerDown);
        editorViewEvents.onPointerMove.addListener(this.handlePointerMove);
        editorViewEvents.onPointerUp.addListener(this.handlePointerUp);
    }

    readonly onDragStart = dispatcher<MYDragEvent>();
    readonly onPointerHold = dispatcher<MYPointerEvent>();
    readonly onClick = dispatcher<MYPointerEvent>();

    private handlePointerDown = (ev: MYPointerEvent) => {
        this.pointerDownEvents.set(ev.pointerId, ev);

        if (ev.pointerType === 'touch') {
            setTimeout(() => {
                if (this.pointerDownEvents.get(ev.pointerId) !== ev) return;
                this.pointerDownEvents.delete(ev.pointerId);

                this.onPointerHold.dispatch(ev);
            }, HOLD_THRESHOLD_IN_MS);
        }
    };

    private handlePointerMove = (ev: MYPointerEvent) => {
        let session = this.sessions.get(ev.pointerId);
        if (session === undefined) {
            const pointerDownEvent = this.pointerDownEvents.get(ev.pointerId);
            if (pointerDownEvent === undefined) return;
            this.pointerDownEvents.delete(ev.pointerId);

            session = new DragSession(pointerDownEvent);
            this.sessions.set(ev.pointerId, session);

            this.onDragStart.dispatch({ session, ...pointerDownEvent });
        }
        session.update(ev);
    };

    private handlePointerUp = (ev: MYPointerEvent) => {
        const session = this.sessions.get(ev.pointerId);
        if (session) {
            session.end();
        }
        this.sessions.delete(ev.pointerId);
        if (this.pointerDownEvents.has(ev.pointerId)) {
            this.onClick.dispatch(ev);
        }
        this.pointerDownEvents.delete(ev.pointerId);
    };
}
