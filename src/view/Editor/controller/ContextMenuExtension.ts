import { MouseEventButton, MouseEventInfo } from '../model/MouseEventInfo';
import { EditorController, ModeChangeEvent } from './EditorController';
import { Extension } from './Extension';

export class ContextMenuExtension implements Extension {
    private controller: EditorController = null as never;

    onActivate(controller: EditorController) {
        this.controller = controller;
        controller.onMouseDown.addListener(this.onMouseDown);
        controller.onModeChange.addListener(this.onModeChange);
    }

    private readonly onMouseDown = (ev: MouseEventInfo) => {
        this.controller.closeContextMenu();
        if (ev.button === MouseEventButton.SECONDARY) {
            switch (this.controller.state.hover.type) {
                case 'entity': {
                    this.controller.setSelection([this.controller.state.hover.entityId]);
                    this.controller.openContextMenu(this.controller.currentPoint);
                    return;
                }

                case 'transformHandle': {
                    this.controller.openContextMenu(this.controller.currentPoint);
                    return;
                }
            }
        }
    };

    private readonly onModeChange = (ev: ModeChangeEvent) => {
        if (ev.prevMode === 'select') {
            this.controller.closeContextMenu();
        }
    };
}
