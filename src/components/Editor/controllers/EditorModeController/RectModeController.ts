import { RectEntity } from '../../../../model/entity/RectEntity';
import { TransformEntitiesTransaction } from '../../model/transaction/TransformEntitiesTransaction';
import { EditorModeController } from './EditorModeController';

export class RectModeController extends EditorModeController {
    onMouseDown = () => {
        const newEntity = RectEntity.create({
            p1: this.editorController.currentPoint,
            width: 1,
            height: 1,
        });
        const newEntities = [...this.store.state.page.entities, newEntity];
        this.editorController.saveSnapshot();
        this.store.setState({
            page: { entities: newEntities },
        });

        this.editorController.startTransaction(
            new TransformEntitiesTransaction([newEntity], 'resize.bottomRight', this.editorController.currentPoint)
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
