import { IEditorController, MouseEventInfo } from '../../core/controller/IEditorController';
import { Extension } from '../../core/controller/Extension';
import { TransformExtension } from '../transform/TransformExtension';
import { RectEntity, Size, TransformType } from '@drawing/common';
import { ModeExtension } from '../mode/ModeExtension';
import { ModeChangeEvent } from '../mode/ModeChangeEvent';
import { SelectExtension } from '../select/SelectExtension';

export class RectExtension extends Extension {
    static readonly MODE_KEY = 'rect';
    private transformExtension: TransformExtension = null as never;
    private selectExtension: SelectExtension = null as never;
    private modeExtension: ModeExtension = null as never;

    onRegister(controller: IEditorController) {
        super.onRegister(controller);

        this.transformExtension = controller.requireExtension(TransformExtension);
        this.selectExtension = controller.requireExtension(SelectExtension);

        this.modeExtension = controller.requireExtension(ModeExtension);
        this.modeExtension.onModeChange.addListener(this.onModeChange);
        this.updateModeSpecificListener(this.modeExtension.mode);

        controller.shortcuts.addPatternListener(['R'], () => {
            this.modeExtension.setMode(RectExtension.MODE_KEY);
        });
    }

    private readonly onModeChange = (ev: ModeChangeEvent) => {
        this.updateModeSpecificListener(ev.nextMode);
    };

    private updateModeSpecificListener(mode: string) {
        if (mode === RectExtension.MODE_KEY) {
            this.controller.onMouseDown.addListener(this.onMouseDown);
        } else {
            this.controller.onMouseDown.removeListener(this.onMouseDown);
        }
    }

    private readonly onMouseDown = (ev: MouseEventInfo) => {
        const newEntity = RectEntity.create({ p1: ev.point, size: Size.model(1, 1) });
        const newEntityMap = { [newEntity.id]: newEntity };

        const session = this.controller.newSession();
        session.addEntities(newEntityMap);
        this.selectExtension.addSelection(newEntity.id);

        this.transformExtension.startTransform(ev.point, newEntityMap, TransformType.RESIZE_BOTTOM_RIGHT, { session });
        this.transformExtension.onTransformEnd.addListenerOnce(() => {
            this.modeExtension.setMode(SelectExtension.MODE_KEY);
        });
    };
}
