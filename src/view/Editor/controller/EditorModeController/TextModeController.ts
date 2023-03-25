import { TextEntity } from '../../../../model/entity/TextEntity';
import { Size } from '../../../../model/Size';
import { EditorModeController } from './EditorModeController';

export class TextModeController extends EditorModeController {
    onMouseDown = () => {
        const newEntity = TextEntity.create({
            p1: this.editorController.currentPoint,
            size: Size.model(200, 100),
        });
        const newEntityMap = { [newEntity.id]: newEntity };
        this.editorController.addEntities(newEntityMap);
        this.editorController.setSelection([newEntity.id]);
        this.editorController.startTextEdit(newEntity.id);
    };
}
