import { RectEntity } from '../../../../model/entity/RectEntity';
import { Size } from '../../../../model/Size';
import { EditorMode } from '../../model/EditorMode';
import { TransformType } from '../../model/TransformType';
import { EditorController, ModeChangeEvent, MouseEventInfo } from '../EditorController';
import { Extension } from './Extension';
import { TransformExtension } from './TransformExtension';

export class RectModeExtension implements Extension {
    private controller: EditorController = null as never;

    constructor(private readonly transformExtension: TransformExtension) {}

    onRegister = (controller: EditorController) => {
        this.controller = controller;
        controller.onModeChange.addListener(this.onModeChange);
        this.updateModeSpecificListener(controller.mode);
    };

    private readonly onModeChange = (ev: ModeChangeEvent) => {
        this.updateModeSpecificListener(ev.nextMode);
    };

    private updateModeSpecificListener(mode: EditorMode) {
        if (mode === 'rect') {
            this.controller.onMouseDown.addListener(this.onMouseDown);
        } else {
            this.controller.onMouseDown.removeListener(this.onMouseDown);
        }
    }

    private readonly onMouseDown = (ev: MouseEventInfo) => {
        const newEntity = RectEntity.create({ p1: ev.point, size: Size.model(1, 1) });
        const newEntityMap = { [newEntity.id]: newEntity };

        this.controller.addEntities(newEntityMap);
        this.transformExtension.startTransform(ev.point, newEntityMap, TransformType.RESIZE_BOTTOM_RIGHT);
        this.transformExtension.onTransformEnd.addListenerOnce(() => {
            this.controller.setMode('select');
        });
    };
}
