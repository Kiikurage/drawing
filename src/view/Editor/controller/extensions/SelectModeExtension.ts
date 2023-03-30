import { EditorMode } from '../../model/EditorMode';
import { TransformType } from '../../model/TransformType';
import { EditorController, ModeChangeEvent, MouseEventButton, MouseEventInfo } from '../EditorController';
import { Extension } from './Extension';
import { TransformExtension } from './TransformExtension';

export class SelectModeExtension implements Extension {
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
        if (mode === 'select') {
            this.controller.onMouseDown.addListener(this.onMouseDown);
        } else {
            this.controller.onMouseDown.removeListener(this.onMouseDown);
        }
    }

    private readonly onMouseDown = (ev: MouseEventInfo) => {
        const { hover } = this.controller.state;

        switch (ev.button) {
            case MouseEventButton.PRIMARY: {
                switch (hover.type) {
                    case 'entity': {
                        if (ev.shiftKey) {
                            this.controller.addSelection(hover.entityId);
                        } else {
                            this.controller.setSelection([hover.entityId]);
                        }
                        this.transformExtension.startTransform(
                            ev.point,
                            this.controller.computeSelectedEntities(),
                            TransformType.TRANSLATE
                        );
                        return;
                    }

                    case 'transformHandle': {
                        this.transformExtension.startTransform(
                            ev.point,
                            this.controller.computeSelectedEntities(),
                            hover.transformType
                        );
                        return;
                    }
                }
                return;
            }
        }
    };
}
