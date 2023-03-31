import { EditorMode } from '../../model/EditorMode';
import { EditorController, ModeChangeEvent, MouseEventButton, MouseEventInfo } from '../EditorController';
import { Extension } from './Extension';
import { Point } from '../../../../model/Point';
import { Entity } from '../../../../model/entity/Entity';

export class TextEditModeExtension implements Extension {
    private controller: EditorController = null as never;
    onRegister = (controller: EditorController) => {
        this.controller = controller;
        controller.onDoubleClick.addListener(this.onDoubleClick);
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

    private readonly onDoubleClick = (ev: MouseEventInfo) => {
        this.tryStartTextEditForSelectedEntity(ev.pointInDisplay);
    };

    private tryStartTextEditForSelectedEntity(editStartPoint = Point.display(0, 0)) {
        if (this.checkIfHoveredEntityTextEditable()) {
            this.controller.startTextEdit(this.controller.state.selectMode.entityIds[0]!, editStartPoint);
        }
    }

    private checkIfHoveredEntityTextEditable(): boolean {
        if (this.controller.state.selectMode.entityIds.length !== 1) return false;

        const selectedEntity = Object.values(this.controller.computeSelectedEntities())[0]!;
        if (!Entity.isTextEditable(selectedEntity)) return false;

        return true;
    }
}
