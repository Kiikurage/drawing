import { LineEntity } from '../../../../model/entity/LineEntity';
import { Point } from '../../../../model/Point';
import { SingleLineTransformSession } from '../../model/session/SingleLineTransformSession';
import { EditorModeController } from './EditorModeController';

export class LineModeController extends EditorModeController {
    onMouseDown = () => {
        const newEntity = LineEntity.create({
            p1: this.editorController.currentPoint,
            p2: Point.model(this.editorController.currentPoint.x + 1, this.editorController.currentPoint.y + 1),
        });
        const newEntityMap = { [newEntity.id]: newEntity };
        this.editorController.addEntities(newEntityMap);
        this.editorController.setSelection([newEntity.id]);
        this.editorController.startSession(
            new SingleLineTransformSession(newEntity, 'p2', this.editorController.currentPoint)
        );
    };
}