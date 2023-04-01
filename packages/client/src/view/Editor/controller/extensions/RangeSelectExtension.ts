import { EditorController, ModeChangeEvent, MouseEventButton, MouseEventInfo } from '../EditorController';
import { Extension } from './Extension';
import { Box, EditorMode, Entity, ModelCordBox, ModelCordPoint } from '@drawing/common';

export class RangeSelectExtension implements Extension {
    private controller: EditorController = null as never;
    private startPoint: ModelCordPoint | null = null;
    private preSelectedEntityIds: string[] = [];

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
            this.controller.onMouseMove.addListener(this.onMouseMove);
            this.controller.onMouseUp.addListener(this.onMouseUp);
        } else {
            this.controller.onMouseDown.removeListener(this.onMouseDown);
            this.controller.onMouseMove.removeListener(this.onMouseMove);
            this.controller.onMouseUp.removeListener(this.onMouseUp);
        }
    }

    private readonly onMouseDown = (ev: MouseEventInfo) => {
        if (ev.button === MouseEventButton.PRIMARY) {
            if (this.controller.state.hover.type === 'idle') {
                if (!ev.shiftKey) this.controller.clearSelection();

                this.preSelectedEntityIds = this.controller.state.selectMode.entityIds;
                this.startPoint = ev.point;
            }
        }
    };

    private readonly onMouseMove = (ev: MouseEventInfo) => {
        if (this.startPoint === null) return;

        const width = ev.point.x - this.startPoint.x;
        const height = ev.point.y - this.startPoint.y;

        const range = Box.model(
            Math.min(this.startPoint.x, this.startPoint.x + width),
            Math.min(this.startPoint.y, this.startPoint.y + height),
            Math.abs(width),
            Math.abs(height)
        );

        this.setRange(range);
    };

    private readonly onMouseUp = () => {
        this.controller.clearSelectingRange();
        this.startPoint = null;
    };

    private setRange(range: ModelCordBox) {
        const overlappedEntityIds = Object.values(this.controller.state.page.entities)
            .filter((entity) => Box.isOverlap(Entity.getBoundingBox(entity), range))
            .map((entity) => entity.id);

        this.controller.setSelectingRange(range);
        this.controller.setSelection([...this.preSelectedEntityIds, ...overlappedEntityIds]);
    }
}
