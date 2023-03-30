import { EditorMode } from '../../model/EditorMode';
import { EditorController, ModeChangeEvent, MouseEventButton, MouseEventInfo } from '../EditorController';
import { Extension } from './Extension';

export class TextEditModeExtension implements Extension {
    private controller: EditorController = null as never;
    onRegister = (controller: EditorController) => {
        this.controller = controller;
        controller.onModeChange.addListener(this.onModeChange);
        this.updateModeSpecificListener(controller.mode);
    };

    private readonly onModeChange = (ev: ModeChangeEvent) => {
        this.updateModeSpecificListener(ev.nextMode);
    };

    private updateModeSpecificListener(mode: EditorMode) {
        if (mode === 'textEditing') {
            this.controller.onMouseDown.addListener(this.onMouseDown);
        } else {
            this.controller.onMouseDown.removeListener(this.onMouseDown);
        }
    }

    private readonly onMouseDown = (ev: MouseEventInfo) => {
        switch (ev.button) {
            case MouseEventButton.PRIMARY: {
                this.controller.completeTextEdit();
                return;
            }
        }
    };
}
