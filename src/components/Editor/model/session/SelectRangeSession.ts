import { Box } from '../../../../model/Box';
import { Entity } from '../../../../model/entity/Entity';
import { ModelCordPoint } from '../../../../model/Point';
import { EditorController } from '../../controllers/EditorController';
import { Session } from './Session';

export class SelectRangeSession implements Session {
    readonly type = 'selectRange';

    public readonly originPoint: ModelCordPoint;
    public readonly preSelectedEntityIds: string[];

    constructor(originPoint: ModelCordPoint, preSelectedEntityIds: string[]) {
        this.originPoint = originPoint;
        this.preSelectedEntityIds = preSelectedEntityIds;
    }

    start(controller: EditorController) {
        controller.setSelectingRange(Box.model(this.originPoint.x, this.originPoint.y, 0, 0));
    }

    update(controller: EditorController) {
        const width = controller.currentPoint.x - this.originPoint.x;
        const height = controller.currentPoint.y - this.originPoint.y;

        const range = Box.model(
            Math.min(this.originPoint.x, this.originPoint.x + width),
            Math.min(this.originPoint.y, this.originPoint.y + height),
            Math.abs(width),
            Math.abs(height)
        );

        const overlappedEntityIds = Object.values(controller.state.page.entities)
            .filter((entity) => Box.isOverlap(Entity.getBoundingBox(entity), range))
            .map((entity) => entity.id);

        controller.setSelectingRange(range);
        controller.setSelection([...this.preSelectedEntityIds, ...overlappedEntityIds]);
    }

    complete(controller: EditorController) {
        controller.clearSelectingRange();
    }
}
