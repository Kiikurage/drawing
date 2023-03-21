import { LineEntity } from '../../../../model/entity/LineEntity';
import { Point } from '../../../../model/Point';
import { TransformSession } from '../../model/session/TransformSession';
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
            new TransformSession(newEntityMap, 'resize.bottomRight', this.editorController.currentPoint)
        );
    };

    onMouseMove = () => {
        if (this.editorController.session !== null) {
            this.editorController.updateSession();
        }
    };

    onMouseUp = () => {
        if (this.editorController.session !== null) {
            this.editorController.completeSession();
            this.editorController.setMode('select');
        }
    };
}
