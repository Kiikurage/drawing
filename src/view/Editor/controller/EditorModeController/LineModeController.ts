import { LineEntity } from '../../../../model/entity/LineEntity';
import { Point } from '../../../../model/Point';
import { EditorModeController } from './EditorModeController';

export class LineModeController extends EditorModeController {
    onMouseDown = () => {
        const newEntity = LineEntity.create({
            p1: this.controller.currentPoint,
            p2: Point.model(this.controller.currentPoint.x + 1, this.controller.currentPoint.y + 1),
        });
        const newEntityMap = { [newEntity.id]: newEntity };
        this.controller.addEntities(newEntityMap);
        this.controller.setSelection([newEntity.id]);
        this.controller.startSingleLineTransform(newEntity, 'p2');
    };
}
