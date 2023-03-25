import { Record } from '../../../../lib/Record';
import { LineEntity } from '../../../../model/entity/LineEntity';
import { ModelCordPoint, Point } from '../../../../model/Point';
import { EditorController } from '../../controller/EditorController';
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

        controller.editController.updateEntities({
            [this.entity.id]: {
                [this.pointKey]: nextPoint,
            },
        });
    }

    complete(controller: EditorController) {
        controller.setMode('select');
        // this.checkLinks(controller);
        controller.onTransformEnd();
    }

    // private checkLinks(controller: EditorController) {
    //     if (controller.state.selectMode.snapEnabled) return;
    //
    //     const targetEntity = this.findLinkableEntity(controller);
    //     if (targetEntity === undefined) return;
    //
    //     const entity = Object.values(this.entities)[0] as LineEntity;
    //     switch (this.transformType) {
    //     }
    // }
    //
    // private findLinkableEntity(controller: EditorController): Entity | undefined {
    //     if (Object.values(this.entities).length > 1) return undefined;
    //     if (this.transformType === TransformType.TRANSLATE) return undefined;
    //
    //     const entity = Object.values(this.entities)[0];
    //     if (entity.type !== 'line') return undefined;
    //
    //     for (const targetEntity of Object.values(controller.state.page.entities)) {
    //         if (targetEntity.type === 'line') continue;
    //
    //         if (Entity.includes(targetEntity, controller.currentPoint)) {
    //             return targetEntity;
    //         }
    //     }
    //
    //     return undefined;
    // }
}
