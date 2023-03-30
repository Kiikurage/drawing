import { TextEntity } from '../../../../model/entity/TextEntity';
import { TransformType } from '../../model/TransformType';
import { EditorController, MouseEventInfo } from '../EditorController';
import { Extension } from './Extension';
import { TransformExtension } from './TransformExtension';

export class TextModeExtension implements Extension {
    private controller: EditorController = null as never;
    private newEntity: TextEntity | null = null;

    constructor(private readonly transformExtension: TransformExtension) {}

    onActivate = (controller: EditorController) => {
        this.controller = controller;
        controller.onMouseDown.addListener(this.onMouseDown);
        controller.onMouseUp.addListener(this.onMouseUp);
    };
    private readonly onMouseDown = (ev: MouseEventInfo) => {
        if (this.controller.mode !== 'text') return;

        this.newEntity = TextEntity.create({ p1: ev.point });
        const newEntityMap = { [this.newEntity.id]: this.newEntity };
        this.controller.addEntities(newEntityMap);
        this.transformExtension.startTransform(ev.point, newEntityMap, TransformType.RESIZE_BOTTOM_RIGHT);
    };

    private readonly onMouseUp = () => {
        if (this.controller.mode !== 'text') return;

        if (this.newEntity === null) return;
        this.controller.startTextEdit(this.newEntity.id);
        this.newEntity = null;
    };
}
