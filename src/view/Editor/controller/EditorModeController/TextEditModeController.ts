import { MouseEventButton, MouseEventInfo } from '../../model/MouseEventInfo';
import { EditorModeController } from './EditorModeController';

export class TextEditModeController extends EditorModeController {
    onMouseDown = (ev: MouseEventInfo) => {
        switch (ev.button) {
            case MouseEventButton.PRIMARY: {
                this.controller.completeTextEdit();
                return;
            }
        }
    };
}
