import { RectEntity } from '../../../../model/entity/RectEntity';
import { Size } from '../../../../model/Size';
import { TransformSession } from '../../model/session/TransformSession';
import { EditorModeController } from './EditorModeController';

export class RectModeController extends EditorModeController {
    onMouseDown = () => {
        const newEntity = RectEntity.create({
            p1: this.editorController.currentPoint,
            size: Size.model({ width: 1, height: 1 }),
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
