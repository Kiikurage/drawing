import { MouseEventButton, MouseEventInfo } from '../../model/MouseEventInfo';
import { ScrollSession } from '../../model/session/ScrollSession';
import { SelectRangeSession } from '../../model/session/SelectRangeSession';
import { TransformSession } from '../../model/session/TransformSession';
import { TransformType } from '../../model/TransformType';
import { EditorModeController } from './EditorModeController';

export class SelectModeController extends EditorModeController {
    onMouseDown = (ev: MouseEventInfo) => {
        this.store.setState({ contextMenu: { p1: null } });
        const { hover } = this.state;

        switch (ev.button) {
            case MouseEventButton.PRIMARY: {
                if (hover === null) {
                    this.store.setState({ selectedEntityIds: [] });
                    this.editorController.startSession(new SelectRangeSession(this.editorController.currentPoint));
                    return;
                }

                if (hover.type === 'entity') {
                    if (ev.shiftKey) {
                        this.store.setState({
                            selectedEntityIds: [...this.state.selectedEntityIds, hover.entityId],
                        });
                    } else {
                        this.store.setState({ selectedEntityIds: [hover.entityId] });
                    }
                    this.startTransformSelectedEntities('translate');
                    return;
                }

                if (hover.type === 'transformHandle') {
                    this.startTransformSelectedEntities(hover.transformType);
                    return;
                }

                return;
            }

            case MouseEventButton.WHEEL: {
                this.editorController.startSession(
                    new ScrollSession(this.editorController.currentPoint, this.editorController.store.state.camera)
                );
                return;
            }

            case MouseEventButton.SECONDARY: {
                if (hover === null) {
                    this.store.setState({ selectedEntityIds: [] });
                    return;
                }

                if (hover.type === 'entity') {
                    if (ev.shiftKey) {
                        this.store.setState({
                            selectedEntityIds: [...this.state.selectedEntityIds, hover.entityId],
                        });
                    } else {
                        this.store.setState({
                            contextMenu: { p1: this.editorController.currentPoint },
                            selectedEntityIds: [hover.entityId],
                        });
                    }
                    return;
                }

                if (hover.type === 'transformHandle') {
                    this.store.setState({
                        contextMenu: { p1: this.editorController.currentPoint },
                    });
                    return;
                }
            }
        }
    };

    onMouseMove = () => {
        if (this.editorController.session !== null) {
            this.editorController.updateSession();
        }
    };

    onMouseUp = () => {
        if (this.editorController.session !== null) {
            this.editorController.completeSession();
        }
    };

    onBeforeDeactivate = () => {
        this.store.setState({ selectedEntityIds: [], contextMenu: { p1: null } });
    };

    private startTransformSelectedEntities(type: TransformType) {
        this.editorController.saveSnapshot();
        this.editorController.startSession(
            new TransformSession(this.editorController.selectedEntities, type, this.editorController.currentPoint)
        );
    }
}
