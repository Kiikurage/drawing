import { RectEntity } from '../../../../model/entity/RectEntity';
import { Size } from '../../../../model/Size';
import { TransformType } from '../../model/TransformType';
import { EditorController, MouseEventInfo } from '../EditorController';
import { Extension } from './Extension';
import { TransformExtension } from './TransformExtension';

export class RectModeExtension implements Extension {
    private controller: EditorController = null as never;

    constructor(private readonly transformExtension: TransformExtension) {}

    onActivate = (controller: EditorController) => {
        this.controller = controller;
        controller.onMouseDown.addListener(this.onMouseDown);
    };

    private readonly onMouseDown = (ev: MouseEventInfo) => {
        if (this.controller.mode !== 'rect') return;

        const newEntity = RectEntity.create({ p1: ev.point, size: Size.model(1, 1) });
        const newEntityMap = { [newEntity.id]: newEntity };

        this.controller.addEntities(newEntityMap);
        this.transformExtension.startTransform(ev.point, newEntityMap, TransformType.RESIZE_BOTTOM_RIGHT);
    };
}
