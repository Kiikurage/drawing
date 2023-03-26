import { Box, ModelCordBox } from '../../../model/Box';
import { Entity } from '../../../model/entity/Entity';
import { ModelCordPoint } from '../../../model/Point';
import { EditorController } from './EditorController';

export class RangeSelectSessionController {
    private readonly originPoint: ModelCordPoint;

    constructor(private readonly controller: EditorController, private readonly preSelectedEntityIds: string[]) {
        this.originPoint = controller.currentPoint;
    }

    onMouseMove(prevPoint: ModelCordPoint, nextPoint: ModelCordPoint) {
        const width = nextPoint.x - this.originPoint.x;
        const height = nextPoint.y - this.originPoint.y;

        const range = Box.model(
            Math.min(this.originPoint.x, this.originPoint.x + width),
            Math.min(this.originPoint.y, this.originPoint.y + height),
            Math.abs(width),
            Math.abs(height)
        );

        this.setRange(range);
    }

    onMouseUp() {
        this.controller.clearSelectingRange();
    }

    private setRange(range: ModelCordBox) {
        const overlappedEntityIds = Object.values(this.controller.state.page.entities)
            .filter((entity) => Box.isOverlap(Entity.getBoundingBox(entity), range))
            .map((entity) => entity.id);

        this.controller.setSelectingRange(range);
        this.controller.setSelection([...this.preSelectedEntityIds, ...overlappedEntityIds]);
    }
}
