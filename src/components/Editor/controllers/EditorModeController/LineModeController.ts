import { LineEntity } from '../../../../model/entity/LineEntity';
import { Point } from '../../../../model/Point';
import { TransformSession } from '../../model/session/TransformSession';
import { EditorModeController } from './EditorModeController';

export class LineModeController extends EditorModeController {
    onMouseDown = () => {
        const newEntity = LineEntity.create({
            p1: this.editorController.currentPoint,
            p2: Point.model({
                x: this.editorController.currentPoint.x + 1,
                y: this.editorController.currentPoint.y + 1,
            }),
        });

        const newEntities = [...this.store.state.page.entities, newEntity];
        this.editorController.saveSnapshot();
        this.store.setState({
            page: { entities: newEntities },
        });

        this.editorController.startTransaction(
            new TransformSession([newEntity], 'resize.bottomRight', this.editorController.currentPoint)
        );
    };

    onMouseMove = () => {
        if (this.editorController.transaction !== null) {
            this.editorController.updateTransaction();
        }
    };

    onMouseUp = () => {
        if (this.editorController.transaction !== null) {
            this.editorController.completeTransaction();
            this.store.setState({ mode: 'select' });
        }
    };
}
