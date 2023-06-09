import { MYPointerEvent } from '../model/MYPointerEvent';
import { DisplayCordPoint, ModelCordPoint } from '@drawing/common/src/model/Point';
import { dispatcher } from '@drawing/common/src/lib/Dispatcher';

export class DragSession {
    startPoint: ModelCordPoint;
    startPointInDisplay: DisplayCordPoint;
    currentPoint: ModelCordPoint;
    currentPointInDisplay: DisplayCordPoint;

    constructor(ev: MYPointerEvent) {
        this.startPoint = ev.point;
        this.startPointInDisplay = ev.pointInDisplay;
        this.currentPoint = this.startPoint;
        this.currentPointInDisplay = this.startPointInDisplay;
    }

    update(ev: MYPointerEvent) {
        this.currentPoint = ev.point;
        this.currentPointInDisplay = ev.pointInDisplay;
        this.onUpdate.dispatch();
    }

    end() {
        this.onEnd.dispatch();
    }

    readonly onUpdate = dispatcher<void>();
    readonly onEnd = dispatcher<void>();
}
