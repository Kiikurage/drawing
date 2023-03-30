import { Record } from '../../../lib/Record';
import { ModelCordBox } from '../../../model/Box';
import { Entity } from '../../../model/entity/Entity';
import { LineEntity } from '../../../model/entity/LineEntity';
import { Patch } from '../../../model/Patch';
import { ModelCordPoint } from '../../../model/Point';
import { EntityMap } from '../model/EntityMap';
import { snapBox } from '../model/SnapUtil';
import { TransformType } from '../model/TransformType';
import { EditorController } from './EditorController';

export class TransformSessionController {
    private readonly startPoint: ModelCordPoint;
    private readonly startBox: ModelCordBox;
    public linkedLines: Record<string, LineEntity[]>; // (Rect ID, linked Line[])

    constructor(
        private readonly controller: EditorController,
        private readonly entities: EntityMap,
        private readonly transformType: TransformType
    ) {
        this.startPoint = controller.currentPoint;
        this.startBox = Entity.computeBoundingBox(this.entities);

        this.linkedLines = {};
        for (const entity of Object.values(this.controller.state.page.entities)) {
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
    }

    onMouseMove(prevPoint: ModelCordPoint, nextPoint: ModelCordPoint) {
        const transform = this.transformType(this.startBox, this.startPoint, nextPoint);

        if (this.controller.state.selectMode.snapEnabled) {
            const { transform: snapTransform } = snapBox(
                transform.apply(this.startBox),
                Record.filter(this.controller.state.page.entities, (entity) => !(entity.id in this.entities)),
                this.transformType,
                16 / this.controller.state.camera.scale
            );
            transform.then(snapTransform);
        }

        const patches: Record<string, Patch<any>> = {};
        for (const prevEntity of Object.values(this.entities)) {
            patches[prevEntity.id] = Entity.transform(prevEntity, transform);

            if (prevEntity.type === 'rect') {
                for (const line of this.linkedLines[prevEntity.id] ?? []) {
                    if (line.linkedEntityId1 === prevEntity.id) {
                        patches[line.id] = { p1: transform.apply(line.p1) };
                    }
                    if (line.linkedEntityId2 === prevEntity.id) {
                        patches[line.id] = { p2: transform.apply(line.p2) };
                    }
                }
            }
        }

        this.controller.updateEntities(patches);
    }
}
