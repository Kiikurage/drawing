import { TextEntity } from '../../../../model/entity/TextEntity';
import { Size } from '../../../../model/Size';
import { EditorModeController } from './EditorModeController';

export class TextModeController extends EditorModeController {
    onMouseDown = () => {
        const newEntity = TextEntity.create({
            p1: this.controller.currentPoint,
            size: Size.model(200, 100),
        });
        const newEntityMap = { [newEntity.id]: newEntity };
        this.controller.addEntities(newEntityMap);
        this.controller.setSelection([newEntity.id]);
        this.controller.startTextEdit(newEntity.id);
    };
}
