import { RectEntity } from '../../model/RectEntity';
import { EditorController } from './EditorController';

export class RectModeEditorController extends EditorController {
    onMouseDown(x: number, y: number) {
        const newEntities = [...this.store.state.page.entities, RectEntity.create({ x, y })];
        this.store.setState({ page: { entities: newEntities } });
    }
}
