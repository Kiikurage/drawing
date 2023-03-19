import { Entity } from '../../../model/Entity';
import { EditorController } from './EditorController';

export class SelectModeEditorController extends EditorController {
    onMouseDown() {
        this.store.setState({ selectedEntities: [] });
    }

    onEntityMouseDown(entity: Entity, shiftKey: boolean) {
        if (shiftKey) {
            this.store.setState((prevState) => {
                if (prevState.selectedEntities.includes(entity)) {
                    return {
                        selectedEntities: prevState.selectedEntities.filter((e) => e !== entity),
                    };
                } else {
                    return { selectedEntities: [...prevState.selectedEntities, entity] };
                }
            });
        } else {
            this.store.setState({ selectedEntities: [entity] });
        }
    }
}
