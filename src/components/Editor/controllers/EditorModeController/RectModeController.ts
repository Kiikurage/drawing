import { RectEntity } from '../../../../model/entity/RectEntity';
import { TransformEntitiesTransaction } from '../../model/transaction/TransformEntitiesTransaction';
import { EditorModeController } from './EditorModeController';

export class RectModeController extends EditorModeController {
    onMouseDown = () => {
        const newEntity = RectEntity.create({
            point: this.editorController.currentPoint,
            width: 1,
            height: 1,
        });
        const newEntities = [...this.store.state.page.entities, newEntity];
        this.store.setState({
            page: { entities: newEntities },
            mode: 'select',
        });

        this.editorController.startTransaction(
            new TransformEntitiesTransaction([newEntity], 'resize.bottomRight', this.editorController.currentPoint)
        );
    };
}
