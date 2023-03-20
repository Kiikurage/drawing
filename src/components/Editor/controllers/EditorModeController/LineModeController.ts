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

        this.editorController.startSession(
            new TransformSession([newEntity], 'resize.bottomRight', this.editorController.currentPoint)
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
            this.store.setState({ mode: 'select' });
        }
    };
}
