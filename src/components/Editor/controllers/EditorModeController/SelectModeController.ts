import { EventInfo } from '../../model/EventInfo';
import { TransformSession } from '../../model/session/TransformSession';
import { EditorModeController } from './EditorModeController';

export class SelectModeController extends EditorModeController {
    onMouseDown = (ev: EventInfo) => {
        const { hover } = this.state;
        if (hover === null) {
            return this.store.setState({ selectedEntityIds: [] });
        }

        if (hover.type === 'entity') {
            if (ev.shiftKey) {
                this.store.setState({
                    selectedEntityIds: [...this.state.selectedEntityIds, hover.entityId],
                });
            } else {
                this.store.setState({ selectedEntityIds: [hover.entityId] });
            }

            const selectedEntities = this.state.page.entities.filter((entity) =>
                this.state.selectedEntityIds.includes(entity.id)
            );
            this.editorController.saveSnapshot();
            this.editorController.startTransaction(
                new TransformSession(selectedEntities, 'translate', this.editorController.currentPoint)
            );
        }

        if (hover.type === 'transformHandle') {
            const selectedEntities = this.state.page.entities.filter((entity) =>
                this.state.selectedEntityIds.includes(entity.id)
            );
            this.editorController.saveSnapshot();
            this.editorController.startTransaction(
                new TransformSession(selectedEntities, hover.handle, this.editorController.currentPoint)
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
