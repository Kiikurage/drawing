import { RectEntity } from '../../../../model/entity/RectEntity';
import { Size } from '../../../../model/Size';
import { TransformType } from '../../model/TransformType';
import { EditorModeController } from './EditorModeController';

export class RectModeController extends EditorModeController {
    onMouseDown = () => {
        const newEntity = RectEntity.create({
            p1: this.controller.currentPoint,
            size: Size.model(1, 1),
        });
        const newEntityMap = { [newEntity.id]: newEntity };
        this.controller.addEntities(newEntityMap);
        this.controller.setSelection([newEntity.id]);
        this.controller.startTransform(newEntityMap, TransformType.RESIZE_BOTTOM_RIGHT);
    };
}
