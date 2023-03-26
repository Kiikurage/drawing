import { TextEntity } from '../../../../model/entity/TextEntity';
import { TransformType } from '../../model/TransformType';
import { EditorModeController } from './EditorModeController';

export class TextModeController extends EditorModeController {
    private newEntity: TextEntity | null = null;
    onMouseDown = () => {
        this.newEntity = TextEntity.create({
            p1: this.controller.currentPoint,
        });
        const newEntityMap = { [this.newEntity.id]: this.newEntity };
        this.controller.addEntities(newEntityMap);
        this.controller.startTransform(newEntityMap, TransformType.RESIZE_BOTTOM_RIGHT);
    };

    onMouseUp = () => {
        if (this.newEntity === null) return;
        this.controller.startTextEdit(this.newEntity.id);
        this.newEntity = null;
    };
}
