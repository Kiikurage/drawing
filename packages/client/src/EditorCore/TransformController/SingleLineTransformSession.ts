import {
    dispatcher,
    Entity,
    getClosestValue,
    LineEntity,
    ModelCordPoint,
    nonNull,
    Patch,
    Point,
    Store,
    Transform,
} from '@drawing/common';
import { DragSession } from '../gesture/DragSession';
import { PageEditSession } from '../PageController/PageEditSession';
import { PageController } from '../PageController/PageController';
import { TransformState } from './TransformState';

export class SingleLineTransformSession {
    private transform: Transform = Transform.scale(1, 1);

    constructor(
        private readonly entity: LineEntity,
        private readonly point: 'p1' | 'p2',
        private readonly dragSession: DragSession,
        private readonly pageController: PageController,
        private readonly store: Store<TransformState>,
        private readonly pageEditSession: PageEditSession = pageController.newSession(),
        private readonly autoCommit = true
    ) {
        this.dragSession.onUpdate.addListener(this.handleDragUpdate);
        this.dragSession.onEnd.addListener(this.handleDragEnd);
    }

    readonly onEnd = dispatcher<Transform>();

    private handleDragUpdate = () => {
        const linkedEntity = findLinkTarget(
            this.dragSession.currentPoint,
            Object.values(this.pageController.entities).filter(nonNull)
        );
        const entity = this.entity;
        const startPoint = entity[this.point];
        const otherPoint = entity[this.point === 'p1' ? 'p2' : 'p1'];
        let currentPoint = this.dragSession.currentPoint;

        if (this.store.state.constraintsEnabled) {
            currentPoint = adjustLineAngleByConstraints(startPoint, currentPoint, otherPoint);
            if (linkedEntity) {
                const box = Entity.getBoundingBox(linkedEntity);
                currentPoint = Point.model(box.point.x + box.size.width / 2, box.point.y + box.size.height / 2);
            }
        }

        const patch: Patch<LineEntity> = {};
        if (this.point === 'p1') {
            patch.p1 = currentPoint;
            patch.linkedEntityId1 = linkedEntity?.id ?? null;
        }
        if (this.point === 'p2') {
            patch.p2 = currentPoint;
            patch.linkedEntityId2 = linkedEntity?.id ?? null;
        }
        this.pageEditSession.updateEntities({
            [this.entity.id]: patch,
        });
    };

    private handleDragEnd = () => {
        if (this.autoCommit) {
            this.pageEditSession.commit();
        }
        this.onEnd.dispatch(this.transform);
    };
}

function findLinkTarget(point: ModelCordPoint, entities: Entity[]): Entity | undefined {
    for (const entity of entities) {
        if (entity.type === 'line') continue;

        if (Entity.includes(entity, point)) {
            return entity;
        }
    }

    return undefined;
}

const presetAnglesForConstrainedTransform = [
    (-180 / 180) * Math.PI,
    (-165 / 180) * Math.PI,
    (-150 / 180) * Math.PI,
    (-135 / 180) * Math.PI,
    (-105 / 180) * Math.PI,
    (-90 / 180) * Math.PI,
    (-75 / 180) * Math.PI,
    (-60 / 180) * Math.PI,
    (-45 / 180) * Math.PI,
    (-30 / 180) * Math.PI,
    (-15 / 180) * Math.PI,
    (0 / 180) * Math.PI,
    (15 / 180) * Math.PI,
    (30 / 180) * Math.PI,
    (45 / 180) * Math.PI,
    (60 / 180) * Math.PI,
    (75 / 180) * Math.PI,
    (90 / 180) * Math.PI,
    (105 / 180) * Math.PI,
    (120 / 180) * Math.PI,
    (135 / 180) * Math.PI,
    (150 / 180) * Math.PI,
    (165 / 180) * Math.PI,
    (180 / 180) * Math.PI,
];

function adjustLineAngleByConstraints(
    pStart: ModelCordPoint,
    pCurrent: ModelCordPoint,
    pOther: ModelCordPoint
): ModelCordPoint {
    const angles = [...presetAnglesForConstrainedTransform];
    angles.push(
        Math.atan2(pStart.y - pOther.y, pStart.x - pOther.x),
        Math.atan2(-(pStart.y - pOther.y), -(pStart.x - pOther.x))
    );

    const currentRawAngle = Math.atan2(pCurrent.y - pOther.y, pCurrent.x - pOther.x);
    const adjustedAngle = getClosestValue(angles, currentRawAngle);

    const r = Math.sqrt((pCurrent.y - pOther.y) ** 2 + (pCurrent.x - pOther.x) ** 2);

    return Point.model(pOther.x + r * Math.cos(adjustedAngle), pOther.y + r * Math.sin(adjustedAngle));
}
