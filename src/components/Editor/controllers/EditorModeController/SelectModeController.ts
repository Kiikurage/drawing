import { MouseEventButton, MouseEventInfo } from '../../model/MouseEventInfo';
import { ScrollSession } from '../../model/session/ScrollSession';
import { SelectRangeSession } from '../../model/session/SelectRangeSession';
import { TransformSession } from '../../model/session/TransformSession';
import { TransformType } from '../../model/TransformType';
import { EditorModeController } from './EditorModeController';

export class SelectModeController extends EditorModeController {
    onMouseDown = (ev: MouseEventInfo) => {
        this.editorController.closeContextMenu();
        const { hover } = this.editorController.state;

        switch (ev.button) {
            case MouseEventButton.PRIMARY: {
                switch (hover.type) {
                    case 'idle': {
                        this.editorController.clearSelection();
                        this.editorController.startSession(new SelectRangeSession(this.editorController.currentPoint));
                        return;
                    }

                    case 'entity': {
                        if (ev.shiftKey) {
                            this.editorController.addSelection(hover.entityId);
                        } else {
                            this.editorController.setSelection([hover.entityId]);
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
                    new ScrollSession(this.editorController.currentPoint, this.editorController.state.camera)
                );
                return;
            }

            case MouseEventButton.SECONDARY: {
                switch (hover.type) {
                    case 'idle': {
                        return;
                    }

                    case 'entity': {
                        this.editorController.setSelection([hover.entityId]);
                        this.editorController.openContextMenu(this.editorController.currentPoint);
                        return;
                    }

                    case 'transformHandle': {
                        this.editorController.openContextMenu(this.editorController.currentPoint);
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
        this.editorController.closeContextMenu();
    };

    private startTransformSelectedEntities(type: TransformType) {
        this.editorController.startSession(
            new TransformSession(
                this.editorController.computeSelectedEntities(),
                type,
                this.editorController.currentPoint
            )
        );
    }
}
