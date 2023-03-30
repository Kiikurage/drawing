import { Box, ModelCordBox } from '../../../../model/Box';
import { Entity } from '../../../../model/entity/Entity';
import { ModelCordPoint } from '../../../../model/Point';
import { EditorController, MouseEventButton, MouseEventInfo } from '../EditorController';
import { Extension } from './Extension';

export class RangeSelectExtension implements Extension {
    private controller: EditorController = null as never;
    private startPoint: ModelCordPoint | null = null;
    private preSelectedEntityIds: string[] = [];

    onActivate = (controller: EditorController) => {
        this.controller = controller;
        controller.onMouseDown.addListener(this.onMouseDown);
        controller.onMouseMove.addListener(this.onMouseMove);
        controller.onMouseUp.addListener(this.onMouseUp);
    };

    private readonly onMouseDown = (ev: MouseEventInfo) => {
        if (this.controller.mode !== 'select') return;

        if (ev.button === MouseEventButton.PRIMARY) {
            if (this.controller.state.hover.type === 'idle') {
                if (!ev.shiftKey) this.controller.clearSelection();

                this.preSelectedEntityIds = this.controller.state.selectMode.entityIds;
                this.startPoint = ev.point;
            }
        }
    };

    private readonly onMouseMove = (ev: MouseEventInfo) => {
        if (this.controller.mode !== 'select') return;
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
        if (this.controller.mode !== 'select') return;

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
