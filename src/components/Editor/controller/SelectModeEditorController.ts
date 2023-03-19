import { Entity } from '../../../model/Entity';
import { EditorController } from './EditorController';

export class SelectModeEditorController extends EditorController {
    onMouseDown() {
        this.store.setState({ selectedEntities: [] });
    }

    onEntityMouseDown(entity: Entity) {
        this.store.setState({ selectedEntities: [entity] });
    }
}
