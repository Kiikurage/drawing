import { MouseEventButton, MouseEventInfo } from '../../model/MouseEventInfo';
import { ScrollSession } from '../../model/session/ScrollSession';
import { SelectRangeSession } from '../../model/session/SelectRangeSession';
import { TransformSession } from '../../model/session/TransformSession';
import { TransformType } from '../../model/TransformType';
import { EditorModeController } from './EditorModeController';

export class SelectModeController extends EditorModeController {
    onMouseDown = (ev: MouseEventInfo) => {
        this.store.setState({ contextMenu: { open: false } });
        const { hover } = this.state;

        switch (ev.button) {
            case MouseEventButton.PRIMARY: {
                switch (hover.type) {
                    case 'idle': {
                        this.store.setState({ selectedEntityIds: [] });
                        this.editorController.startSession(new SelectRangeSession(this.editorController.currentPoint));
                        return;
                    }

                    case 'entity': {
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

                    case 'transformHandle': {
                        this.startTransformSelectedEntities(hover.transformType);
                        return;
                    }
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
                switch (hover.type) {
                    case 'idle': {
                        return;
                    }

                    case 'entity': {
                        this.store.setState({
                            contextMenu: { open: true, point: this.editorController.currentPoint },
                            selectedEntityIds: [hover.entityId],
                        });
                        return;
                    }

                    case 'transformHandle': {
                        this.store.setState({
                            contextMenu: { open: true, point: this.editorController.currentPoint },
                        });
                        return;
                    }
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
        this.store.setState({ selectedEntityIds: [], contextMenu: { open: false } });
    };

    private startTransformSelectedEntities(type: TransformType) {
        this.editorController.saveSnapshot();
        this.editorController.startSession(
            new TransformSession(
                this.editorController.computeSelectedEntities(),
                type,
                this.editorController.currentPoint
            )
        );
    }
}
