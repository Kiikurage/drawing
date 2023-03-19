import { EventInfo } from '../../model/EventInfo';
import { TransformEntitiesTransaction } from '../../model/transaction/TransformEntitiesTransaction';
import { EditorModeController } from './EditorModeController';

export class SelectModeController extends EditorModeController {
    onMouseDown = (ev: EventInfo) => {
        const { hover, selectedEntityIds } = this.state;
        if (hover === null) {
            return this.store.setState({ selectedEntityIds: [] });
        }

        if (hover.type === 'entity') {
            if (ev.shiftKey) {
                return this.store.setState((prevState) => ({
                    selectedEntityIds: [...prevState.selectedEntityIds, hover.entityId],
                }));
            } else {
                return this.store.setState({ selectedEntityIds: [hover.entityId] });
            }
        }

        if (hover.type === 'transformHandle') {
            const selectedEntities = this.state.page.entities.filter((entity) => selectedEntityIds.includes(entity.id));
            this.editorController.startTransaction(
                new TransformEntitiesTransaction(selectedEntities, hover.handle, this.editorController.currentPoint)
            );
        }

        return {};
    };

    onMouseMove = () => {
        if (this.editorController.transaction !== null) {
            this.editorController.updateTransaction();
        }
    };

    onMouseUp = () => {
        if (this.editorController.transaction !== null) {
            this.editorController.completeTransaction();
        }
    };

    onBeforeDeactivate = () => {
        this.store.setState({ selectedEntityIds: [] });
    };
}
