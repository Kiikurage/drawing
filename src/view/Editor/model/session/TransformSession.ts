import { Record } from '../../../../lib/Record';
import { Entity } from '../../../../model/entity/Entity';
import { LineEntity } from '../../../../model/entity/LineEntity';
import { RectEntity } from '../../../../model/entity/RectEntity';
import { Patch } from '../../../../model/Patch';
import { ModelCordPoint } from '../../../../model/Point';
import { EditorController } from '../../controller/EditorController';
import { EntityMap } from '../EntityMap';
import { TransformType } from '../TransformType';
import { Session } from './Session';
import { snap, transform } from './SnapUtil';

export class TransformSession implements Session {
    public entities: EntityMap;
    public linkedLines: Record<string, LineEntity[]>; // (Rect ID, linked Line[])
    public transformType: TransformType;
    public originPoint: ModelCordPoint;

    constructor(entities: EntityMap, handle: TransformType, originPoint: ModelCordPoint) {
        this.entities = entities;
        this.linkedLines = {};
        this.transformType = handle;
        this.originPoint = originPoint;
    }

    start(controller: EditorController) {
        controller.editController.saveSnapshot();
        for (const entity of Object.values(controller.state.page.entities)) {
            if (!LineEntity.isLine(entity)) continue;

            if (entity.linkedEntityId1 !== null) {
                (this.linkedLines[entity.linkedEntityId1] ?? (this.linkedLines[entity.linkedEntityId1] = [])).push(
                    entity
                );
            }
            if (entity.linkedEntityId2 !== null) {
                (this.linkedLines[entity.linkedEntityId2] ?? (this.linkedLines[entity.linkedEntityId2] = [])).push(
                    entity
                );
            }
        }

        controller.onTransformStart();
    }

    update(controller: EditorController) {
        const {
            currentPoint,
            state: {
                selectMode: { snapEnabled },
            },
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

        const patches = Record.mapValue(this.entities, (prevEntity) => {
            const patch = Entity.transform(prevEntity, prevBoundingBox, nextBoundingBox);
            if (prevEntity.type === 'rect') {
                const nextEntity = Patch.apply(prevEntity, patch) as RectEntity;

                const scaleX = nextEntity.size.width / prevEntity.size.width;
                const scaleY = nextEntity.size.height / prevEntity.size.height;

                for (const line of this.linkedLines[prevEntity.id] ?? []) {
                    if (line.linkedEntityId1 === prevEntity.id) {
                        controller.editController.updateEntities({
                            [line.id]: {
                                p1: {
                                    x: (line.p1.x - prevEntity.p1.x) * scaleX + nextEntity.p1.x,
                                    y: (line.p1.y - prevEntity.p1.y) * scaleY + nextEntity.p1.y,
                                },
                            },
                        });
                    }
                    if (line.linkedEntityId2 === prevEntity.id) {
                        controller.editController.updateEntities({
                            [line.id]: {
                                p2: {
                                    x: (line.p2.x - prevEntity.p1.x) * scaleX + nextEntity.p1.x,
                                    y: (line.p2.y - prevEntity.p1.y) * scaleY + nextEntity.p1.y,
                                },
                            },
                        });
                    }
                }
            }

            return patch;
        });
        controller.editController.updateEntities(patches);
    }

    complete(controller: EditorController) {
        controller.setMode('select');
        controller.onTransformEnd();
    }
}
