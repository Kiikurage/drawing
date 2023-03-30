import { EditorController, MouseEventButton, MouseEventInfo } from '../EditorController';
import { Extension } from './Extension';

export class TextEditModeExtension implements Extension {
    private controller: EditorController = null as never;
    onActivate = (controller: EditorController) => {
        this.controller = controller;
        controller.onMouseDown.addListener(this.onMouseDown);
    };

    private readonly onMouseDown = (ev: MouseEventInfo) => {
        if (this.controller.mode !== 'textEditing') return;

        switch (ev.button) {
            case MouseEventButton.PRIMARY: {
                this.controller.completeTextEdit();
                return;
            }
        }
    };
}
