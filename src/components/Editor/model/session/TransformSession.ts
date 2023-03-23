import { Record } from '../../../../lib/Record';
import { ModelCordBox } from '../../../../model/Box';
import { Entity } from '../../../../model/entity/Entity';
import { Patch } from '../../../../model/Patch';
import { ModelCordPoint } from '../../../../model/Point';
import { EditorController } from '../../controllers/EditorController';
import { EntityMap } from '../EntityMap';
import { TransformType } from '../TransformType';
import { Session } from './Session';
import { snap } from './SnapUtil';

export class TransformSession implements Session {
    static readonly TYPE = 'transform';

    readonly type = TransformSession.TYPE;

    public entities: EntityMap;
    public transformType: TransformType;
    public originPoint: ModelCordPoint;

    constructor(entities: EntityMap, handle: TransformType, originPoint: ModelCordPoint) {
        this.entities = entities;
        this.transformType = handle;
        this.originPoint = originPoint;
    }

    start(controller: EditorController) {
        controller.editController.saveSnapshot();
    }

    update(controller: EditorController) {
        const {
            currentPoint,
            state: { snapEnabled },
        } = controller;

        const prevBoundingBox = Entity.computeBoundingBox(this.entities);

        let nextBoundingBox = this.computeNextBoundingBox(
            prevBoundingBox,
            this.originPoint,
            currentPoint,
            this.transformType
        );

        if (snapEnabled) {
            const delta = 16 / controller.state.camera.scale;
            const snapTargets = Record.filter(
                controller.state.page.entities,
                (entity) => !(entity.id in this.entities)
            );
            nextBoundingBox = snap(nextBoundingBox, snapTargets, this.transformType, delta);
        }

        const patch = Record.mapValue(this.entities, (entity) =>
            Entity.transform(entity, prevBoundingBox, nextBoundingBox)
        );
        controller.editController.updateEntities(patch);
    }

    complete(controller: EditorController) {
        controller.setMode('select');
    }

    private computeNextBoundingBox(
        prevBoundingBox: ModelCordBox,
        prevPoint: ModelCordPoint,
        nextPoint: ModelCordPoint,
        handle: TransformType
    ): ModelCordBox {
        const diffX = nextPoint.x - prevPoint.x;
        const diffY = nextPoint.y - prevPoint.y;

        if (handle === 'translate') {
            return Patch.apply(prevBoundingBox, {
                point: {
                    x: prevBoundingBox.point.x + diffX,
                    y: prevBoundingBox.point.y + diffY,
                },
            });
        } else {
            let nextBoundingBox = prevBoundingBox;

            if (handle.x === 'start') {
                nextBoundingBox = Patch.apply(nextBoundingBox, {
                    point: { x: prevBoundingBox.point.x + diffX },
                    size: { width: prevBoundingBox.size.width - diffX },
                });
            } else if (handle.x === 'end') {
                nextBoundingBox = Patch.apply(nextBoundingBox, {
                    size: { width: prevBoundingBox.size.width + diffX },
                });
            }

            if (handle.y === 'start') {
                nextBoundingBox = Patch.apply(nextBoundingBox, {
                    point: { y: prevBoundingBox.point.y + diffY },
                    size: { height: prevBoundingBox.size.height - diffY },
                });
            } else if (handle.y === 'end') {
                nextBoundingBox = Patch.apply(nextBoundingBox, {
                    size: { height: prevBoundingBox.size.height + diffY },
                });
            }

            return nextBoundingBox;
        }
    }
}
