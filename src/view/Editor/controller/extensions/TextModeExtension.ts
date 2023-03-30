import { TextEntity } from '../../../../model/entity/TextEntity';
import { EditorMode } from '../../model/EditorMode';
import { TransformType } from '../../model/TransformType';
import { EditorController, ModeChangeEvent, MouseEventInfo } from '../EditorController';
import { Extension } from './Extension';
import { TransformExtension } from './TransformExtension';

export class TextModeExtension implements Extension {
    private controller: EditorController = null as never;
    private newEntity: TextEntity | null = null;

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
        if (mode === 'text') {
            this.controller.onMouseDown.addListener(this.onMouseDown);
            this.controller.onMouseUp.addListener(this.onMouseUp);
        } else {
            this.controller.onMouseDown.removeListener(this.onMouseDown);
            this.controller.onMouseUp.removeListener(this.onMouseUp);
        }
    }

    private readonly onMouseDown = (ev: MouseEventInfo) => {
        this.newEntity = TextEntity.create({ p1: ev.point });
        const newEntityMap = { [this.newEntity.id]: this.newEntity };
        this.controller.addEntities(newEntityMap);
        this.transformExtension.startTransform(ev.point, newEntityMap, TransformType.RESIZE_BOTTOM_RIGHT);
    };

    private readonly onMouseUp = () => {
        if (this.newEntity === null) return;
        this.controller.startTextEdit(this.newEntity.id);
        this.newEntity = null;
    };
}
