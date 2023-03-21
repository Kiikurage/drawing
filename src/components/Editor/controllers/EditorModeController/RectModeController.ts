import { RectEntity } from '../../../../model/entity/RectEntity';
import { Size } from '../../../../model/Size';
import { TransformSession } from '../../model/session/TransformSession';
import { EditorModeController } from './EditorModeController';

export class RectModeController extends EditorModeController {
    onMouseDown = () => {
        const newEntity = RectEntity.create({
            p1: this.editorController.currentPoint,
            size: Size.model(1, 1),
        });
        const newEntityMap = { [newEntity.id]: newEntity };
        this.editorController.saveSnapshot();
        this.store.setState({
            page: { entities: newEntityMap },
        });

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
            this.store.setState({ mode: 'select' });
        }
    };
}
