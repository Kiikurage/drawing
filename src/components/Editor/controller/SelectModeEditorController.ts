import { Entity } from '../../../model/entity/Entity';
import { EditorMode } from '../model/EditorMode';
import { EventInfo } from '../model/EventInfo';
import { EditorController } from './EditorController';

export class SelectModeEditorController extends EditorController {
    onMouseDown() {
        this.store.setState({ selectedEntities: [] });
    }

    onEntityMouseDown(entity: Entity, info: EventInfo) {
        info.stopPropagation();

        if (info.shiftKey) {
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

    setMode(mode: EditorMode) {
        super.setMode(mode);
        this.store.setState({ selectedEntities: [] });
    }
}
