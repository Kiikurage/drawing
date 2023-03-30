import { Record } from '../../../lib/Record';
import { Entity } from '../../../model/entity/Entity';
import { LineEntity } from '../../../model/entity/LineEntity';
import { ModelCordPoint, Point } from '../../../model/Point';
import { EntityMap } from '../model/EntityMap';
import { snapPoint } from '../model/SnapUtil';
import { EditorController } from './EditorController';

export class SingleLineTransformSessionController {
    private readonly originPoint: ModelCordPoint;

    constructor(
        private readonly controller: EditorController,
        private readonly entity: LineEntity,
        private readonly pointKey: 'p1' | 'p2'
    ) {
        this.originPoint = controller.currentPoint;
    }

    onMouseMove(prevPoint: ModelCordPoint, nextPoint: ModelCordPoint) {
        const prevLinePoint = this.entity[this.pointKey];
        let nextLinePoint = Point.model(
            prevLinePoint.x + (nextPoint.x - this.originPoint.x),
            prevLinePoint.y + (nextPoint.y - this.originPoint.y)
        );

        if (this.controller.state.selectMode.snapEnabled) {
            const { transform } = snapPoint(
                nextLinePoint,
                Record.filter(this.controller.state.page.entities, (entity) => entity.id !== this.entity.id),
                16 / this.controller.state.camera.scale
            );
            nextLinePoint = transform.apply(nextLinePoint);
        }

        const linkedEntity = this.findLinkTarget(nextLinePoint, this.controller.state.page.entities);

        this.controller.updateEntities({
            [this.entity.id]: {
                [this.pointKey]: nextLinePoint,
                linkedEntityId1: this.pointKey === 'p1' ? linkedEntity?.id ?? null : this.entity.linkedEntityId1,
                linkedEntityId2: this.pointKey === 'p2' ? linkedEntity?.id ?? null : this.entity.linkedEntityId2,
            },
        });
    }

    private findLinkTarget(point: ModelCordPoint, entities: EntityMap): Entity | undefined {
        for (const entity of Object.values(entities)) {
            if (entity.type === 'line') continue;

            if (Entity.includes(entity, point)) {
                return entity;
            }
        }

        return undefined;
    }
}
