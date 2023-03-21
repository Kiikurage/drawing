import { Patch } from '../../../../model/Patch';
import { ModelCordPoint } from '../../../../model/Point';
import { EditorController } from '../../controllers/EditorController';
import { Session } from './Session';

export class SelectRangeSession extends Session {
    readonly type = 'SelectRange';
    public originPoint: ModelCordPoint;

    constructor(originPoint: ModelCordPoint) {
        super();
        this.originPoint = originPoint;
    }

    start(controller: EditorController) {
        return {
            selectingRange: Patch.apply(controller.state.selectingRange, {
                selecting: true,
                range: {
                    point: this.originPoint,
                    size: { width: 0, height: 0 },
                },
            }),
        };
    }

    update(controller: EditorController) {
        const {
            currentPoint,
            state: { selectingRange: prevSelectingRange },
        } = controller;

        const width = currentPoint.x - this.originPoint.x;
        const height = currentPoint.y - this.originPoint.y;

        return {
            selectingRange: Patch.apply(prevSelectingRange, {
                selecting: true,
                range: {
                    point: {
                        x: Math.min(this.originPoint.x, this.originPoint.x + width),
                        y: Math.min(this.originPoint.y, this.originPoint.y + height),
                    },
                    size: {
                        width: Math.abs(width),
                        height: Math.abs(height),
                    },
                },
            }),
        };
    }

    complete(controller: EditorController) {
        return {
            selectingRange: Patch.apply(controller.state.selectingRange, {
                selecting: false,
            }),
        };
    }
}
