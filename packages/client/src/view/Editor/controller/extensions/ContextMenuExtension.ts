import { EditorMode } from '@drawing/common';
import { EditorController, ModeChangeEvent, MouseEventButton, MouseEventInfo } from '../EditorController';
import { Extension } from './Extension';

export class ContextMenuExtension implements Extension {
    private controller: EditorController = null as never;

    onRegister(controller: EditorController) {
        this.controller = controller;
        controller.onModeChange.addListener(this.onModeChange);
        this.updateModeSpecificListener(controller.mode);
    }

    private readonly onModeChange = (ev: ModeChangeEvent) => {
        this.updateModeSpecificListener(ev.nextMode);
        if (ev.nextMode !== 'select') {
            this.controller.closeContextMenu();
        }
    };

    private updateModeSpecificListener(mode: EditorMode) {
        if (mode === 'select') {
            this.controller.onMouseDown.addListener(this.onMouseDown);
        } else {
            this.controller.onMouseDown.removeListener(this.onMouseDown);
        }
    }

    private readonly onMouseDown = (ev: MouseEventInfo) => {
        this.controller.closeContextMenu();
        if (ev.button === MouseEventButton.SECONDARY) {
            switch (this.controller.state.hover.type) {
                case 'entity': {
                    this.controller.setSelection([this.controller.state.hover.entityId]);
                    this.controller.openContextMenu(ev.point);
                    return;
                }

                case 'transformHandle': {
                    this.controller.openContextMenu(ev.point);
                    return;
                }
            }
        }
    };
}
