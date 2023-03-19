import { RectEntity } from '../../../model/entity/RectEntity';
import { EditorController } from './EditorController';

export class RectModeEditorController extends EditorController {
    onMouseDown(x: number, y: number) {
        const newEntities = [
            ...this.store.state.page.entities,
            RectEntity.create({
                x,
                y,
                width: 100,
                height: 100,
            }),
        ];
        this.store.setState({
            page: { entities: newEntities },
            mode: 'select',
        });

        // TODO: Resizeを開始する
    }

    onMouseUp(x: number, y: number) {
        // TODO: Resizeが終了する
        //       長方形のサイズが(0,0)なら、追加しない
    }
}
