import { LineEntity } from '../../../../model/entity/LineEntity';
import { ModelCordPoint } from '../../../../model/Point';
import { TransformEntitiesTransaction } from '../../model/transaction/TransformEntitiesTransaction';
import { EditorModeController } from './EditorModeController';

export class LineModeController extends EditorModeController {
    onMouseDown = () => {
        const newEntity = LineEntity.create({
            p1: this.editorController.currentPoint,
            p2: ModelCordPoint({
                x: this.editorController.currentPoint.x + 1,
                y: this.editorController.currentPoint.y + 1,
            }),
        });

        const newEntities = [...this.store.state.page.entities, newEntity];
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
