import {
    dispatcher,
    Entity,
    LineEntity,
    ModelCordBox,
    nonNull,
    Patch,
    Record,
    snapBox,
    Store,
    Transform,
    TransformType,
} from '@drawing/common';
import { DragSession } from '../gesture/DragSession';
import { PageEditSession } from '../PageController/PageEditSession';
import { PageController } from '../PageController/PageController';
import { TransformState } from './TransformState';
import { CameraController } from '../camera/CameraController';

export class TransformSession {
    private readonly entityMap: Record<string, Entity | undefined>;
    private readonly startBox: ModelCordBox;
    private transform: Transform = Transform.scale(1, 1);
    private readonly linkedLines1: Record<string, LineEntity> = {};
    private readonly linkedLines2: Record<string, LineEntity> = {};

    constructor(
        entities: Entity[],
        private readonly transformType: TransformType,
        private readonly dragSession: DragSession,
        private readonly pageController: PageController,
        private readonly store: Store<TransformState>,
        private readonly cameraController: CameraController,
        private readonly pageEditSession: PageEditSession = pageController.newSession(),
        private readonly autoCommit = true
    ) {
        this.entityMap = Record.mapToRecord(entities, (entity) => [entity.id, entity]);
        this.startBox = Entity.computeBoundingBox(entities);

        for (const entity of this.pageController.entities) {
            if (entity.type === 'line') {
                if (entity.linkedEntityId1 !== null) {
                    const linkedEntity = this.entityMap[entity.linkedEntityId1];
                    if (linkedEntity !== undefined) this.linkedLines1[entity.id] = entity;
                }
                if (entity.linkedEntityId2 !== null) {
                    const linkedEntity = this.entityMap[entity.linkedEntityId2];
                    if (linkedEntity !== undefined) this.linkedLines2[entity.id] = entity;
                }
            }
        }

        this.dragSession.onUpdate.addListener(this.handleDragUpdate);
        this.dragSession.onEnd.addListener(this.handleDragEnd);
    }

    readonly onUpdate = dispatcher<Transform>();
    readonly onEnd = dispatcher<Transform>();

    private updateTransform() {
        const {
            dragSession: { startPoint, currentPoint },
            startBox,
            transformType,
        } = this;

        const scaleOrigin = transformType.scaleOrigin(startBox);
        const transform = Transform.scale(
            transformType.scaleFactor.x(startBox, startPoint, currentPoint),
            transformType.scaleFactor.y(startBox, startPoint, currentPoint),
            scaleOrigin.x,
            scaleOrigin.y
        ).then(transformType.translate(startBox, startPoint, currentPoint));

        if (this.store.state.snapEnabled) {
            const snapTargets = this.pageController.entities.filter(
                (entity) =>
                    this.entityMap[entity.id] === undefined &&
                    this.linkedLines1[entity.id] === undefined &&
                    this.linkedLines2[entity.id] === undefined
            );
            const { transform: snapTransform } = snapBox(
                transform.apply(startBox),
                snapTargets,
                transformType,
                16 / this.cameraController.camera.scale
            );
            transform.then(snapTransform);
        }

        if (this.store.state.constraintsEnabled) {
            const scale = Math.max(transform.scaleX, transform.scaleY);
            const originPoint = transformType.scaleOrigin(startBox);
            transform.then(
                Transform.scale(scale / transform.scaleX, scale / transform.scaleY, originPoint.x, originPoint.y)
            );

            if (transform.scaleX === 1 && transform.scaleY === 1) {
                // translate
                if (Math.abs(transform.translateX) > Math.abs(transform.translateY)) {
                    transform.translateY = 0;
                } else {
                    transform.translateX = 0;
                }
            }
        }

        this.transform = transform;
        this.onUpdate.dispatch(transform);
    }

    private handleDragUpdate = () => {
        this.updateTransform();
        this.pushPatches();
    };

    private pushPatches() {
        const patch: Record<string, Patch<Entity>> = {};

        for (const entity of Object.values(this.entityMap).filter(nonNull)) {
            patch[entity.id] = Entity.transform(entity, this.transform);
        }
        for (const entity of Object.values(this.linkedLines1)) {
            patch[entity.id] = Patch.apply(patch[entity.id] ?? {}, {
                p1: this.transform.apply(entity.p1),
            });
        }
        for (const entity of Object.values(this.linkedLines2)) {
            patch[entity.id] = Patch.apply(patch[entity.id] ?? {}, {
                p2: this.transform.apply(entity.p2),
            });
        }

        this.pageEditSession.updateEntities(patch);
    }

    private handleDragEnd = () => {
        if (this.autoCommit) {
            this.pageEditSession.commit();
        }
        this.onEnd.dispatch(this.transform);
    };
}
