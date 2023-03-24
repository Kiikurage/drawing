import { Record } from '../../../../lib/Record';
import { Entity } from '../../../../model/entity/Entity';
import { ModelCordPoint } from '../../../../model/Point';
import { EditorController } from '../../controllers/EditorController';
import { EntityMap } from '../EntityMap';
import { TransformType } from '../TransformType';
import { Session } from './Session';
import { snap, transform } from './SnapUtil';

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

        let nextBoundingBox = transform(prevBoundingBox, this.transformType, this.originPoint, currentPoint);
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
}
