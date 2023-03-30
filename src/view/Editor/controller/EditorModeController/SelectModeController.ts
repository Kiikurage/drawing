import { LineEntity } from '../../../../model/entity/LineEntity';
import { ModelCordPoint } from '../../../../model/Point';
import { MouseEventButton, MouseEventInfo } from '../../model/MouseEventInfo';
import { TransformType } from '../../model/TransformType';
import { RangeSelectSessionController } from '../RangeSelectSessionController';
import { EditorModeController } from './EditorModeController';

export class SelectModeController extends EditorModeController {
    public rangeSelectSession: RangeSelectSessionController | null = null;

    onMouseDown = (ev: MouseEventInfo) => {
        const { hover } = this.controller.state;

        switch (ev.button) {
            case MouseEventButton.PRIMARY: {
                switch (hover.type) {
                    case 'idle': {
                        if (!ev.shiftKey) this.controller.clearSelection();

                        this.rangeSelectSession = new RangeSelectSessionController(
                            this.controller,
                            this.controller.state.selectMode.entityIds
                        );
                        return;
                    }

                    case 'entity': {
                        if (ev.shiftKey) {
                            this.controller.addSelection(hover.entityId);
                        } else {
                            this.controller.setSelection([hover.entityId]);
                        }
                        this.startTransformSelectedEntities(TransformType.TRANSLATE);
                        return;
                    }

                    case 'singleLineTransformHandle': {
                        const entity = Object.values(this.controller.computeSelectedEntities())[0] as LineEntity;
                        this.controller.startSingleLineTransform(entity, hover.point);
                        return;
                    }

                    case 'transformHandle': {
                        this.startTransformSelectedEntities(hover.transformType);
                        return;
                    }
                }
                return;
            }
        }
    };

    onMouseMove = (prevPoint: ModelCordPoint, nextPoint: ModelCordPoint) => {
        this.rangeSelectSession?.onMouseMove(prevPoint, nextPoint);
    };

    onMouseUp = () => {
        this.rangeSelectSession?.onMouseUp();
        this.rangeSelectSession = null;
    };

    private startTransformSelectedEntities(type: TransformType) {
        this.controller.startTransform(this.controller.computeSelectedEntities(), type);
    }
}
