import { Record } from '../../../../lib/Record';
import { Entity } from '../../../../model/entity/Entity';
import { LineEntity } from '../../../../model/entity/LineEntity';
import { ModelCordPoint, Point } from '../../../../model/Point';
import { EditorController } from '../../controller/EditorController';
import { EntityMap } from '../EntityMap';
import { getSnap } from './SnapUtil';

export class SingleLineTransformSession {
    public entity: LineEntity;
    public pointKey: 'p1' | 'p2';
    public originPoint: ModelCordPoint;

    constructor(entity: LineEntity, point: 'p1' | 'p2', originPoint: ModelCordPoint) {
        this.entity = entity;
        this.pointKey = point;
        this.originPoint = originPoint;
    }

    start(controller: EditorController) {
        controller.editController.saveSnapshot();
        controller.onTransformStart();
    }

    update(controller: EditorController) {
        const currentPoint = controller.currentPoint;
        const {
            state: {
                selectMode: { snapEnabled },
            },
        } = controller;

        const prevPoint = this.entity[this.pointKey];
        const nextPoint = Point.model(
            prevPoint.x + (currentPoint.x - this.originPoint.x),
            prevPoint.y + (currentPoint.y - this.originPoint.y)
        );

        if (snapEnabled) {
            const delta = 16 / controller.state.camera.scale;
            const snapTargets = Record.filter(controller.state.page.entities, (entity) => entity.id !== this.entity.id);

            const snapTargetX = getSnap(nextPoint, snapTargets, 'x', delta);
            if (snapTargetX.pairs.length > 0) nextPoint.x = snapTargetX.pairs[0][1].x;

            const snapTargetY = getSnap(nextPoint, snapTargets, 'y', delta);
            if (snapTargetY.pairs.length > 0) nextPoint.y = snapTargetY.pairs[0][1].y;
        }

        const linkedEntity = this.findLinkTarget(nextPoint, controller.state.page.entities);

        controller.editController.updateEntities({
            [this.entity.id]: {
                [this.pointKey]: nextPoint,
                linkedEntityId1: this.pointKey === 'p1' ? linkedEntity?.id ?? null : this.entity.linkedEntityId1,
                linkedEntityId2: this.pointKey === 'p2' ? linkedEntity?.id ?? null : this.entity.linkedEntityId2,
            },
        });
    }

    complete(controller: EditorController) {
        controller.setMode('select');
        controller.onTransformEnd();
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
