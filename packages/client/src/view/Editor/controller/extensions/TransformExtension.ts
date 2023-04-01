import {
    Entity,
    EntityMap,
    EventDispatcher,
    LineEntity,
    ModelCordBox,
    ModelCordPoint,
    Patch,
    Record,
    snapBox,
    TransformType,
} from '@drawing/common';
import { Extension } from './Extension';
import { EditorController, MouseEventInfo } from '../EditorController';

export class TransformExtension implements Extension {
    private startPoint: ModelCordPoint | null = null;
    private entities: EntityMap | null = null;
    private startBox: ModelCordBox | null = null;
    private transformType: TransformType | null = null;
    public linkedLines: Record<string, LineEntity[]> = {}; // (Rect ID, linked Line[])

    private controller: EditorController = null as never;

    startTransform(startPoint: ModelCordPoint, entities: EntityMap, transformType: TransformType) {
        this.startPoint = startPoint;
        this.entities = entities;
        this.startBox = Entity.computeBoundingBox(entities);
        this.transformType = transformType;

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

    onRegister = (controller: EditorController) => {
        this.controller = controller;
        controller.onMouseMove.addListener(this.onMouseMove);
        controller.onMouseUp.addListener(this.onMouseUp);
    };

    readonly onTransformEnd = EventDispatcher(() => {});

    private readonly onMouseMove = (ev: MouseEventInfo) => {
        const { point: nextPoint } = ev;
        const { startPoint, entities, startBox, transformType } = this;
        if (startPoint === null || entities === null || startBox === null || transformType === null) return;

        const transform = transformType(startBox, startPoint, nextPoint);

        if (this.controller.state.selectMode.snapEnabled) {
            const { transform: snapTransform } = snapBox(
                transform.apply(startBox),
                Record.filter(this.controller.state.page.entities, (entity) => !(entity.id in entities)),
                transformType,
                16 / this.controller.state.camera.scale
            );
            transform.then(snapTransform);
        }

        const patches: Record<string, Patch<any>> = {};
        for (const prevEntity of Object.values(entities)) {
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
    };

    private readonly onMouseUp = () => {
        if (this.startPoint === null || this.entities === null || this.startBox === null || this.transformType === null)
            return;

        this.startPoint = null;
        this.entities = null;
        this.startBox = null;
        this.transformType = null;
        this.onTransformEnd();
    };
}
