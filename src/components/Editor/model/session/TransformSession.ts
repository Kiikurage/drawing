import { Record } from '../../../../lib/Record';
import { ModelCordBox } from '../../../../model/Box';
import { Entity } from '../../../../model/entity/Entity';
import { Patch } from '../../../../model/Patch';
import { ModelCordPoint, Point } from '../../../../model/Point';
import { EditorController } from '../../controllers/EditorController';
import { Camera } from '../Camera';
import { EntityMap } from '../EntityMap';
import { TransformType } from '../TransformType';
import { Session } from './Session';

export class TransformSession extends Session {
    readonly type = 'Transform';
    public entities: EntityMap;
    public handle: TransformType;
    public originPoint: ModelCordPoint;

    constructor(entities: EntityMap, handle: TransformType, originPoint: ModelCordPoint) {
        super();
        this.entities = entities;
        this.handle = handle;
        this.originPoint = originPoint;
    }

    start(controller: EditorController) {
        controller.editController.saveSnapshot();
    }

    update(controller: EditorController) {
        const { currentPoint } = controller;

        const prevBoundingBox = Entity.computeBoundingBox(this.entities);

        const nextBoundingBox = TransformSession.computeNextBoundingBox(
            prevBoundingBox,
            this.originPoint,
            currentPoint,
            this.handle
        );

        const snappedNextBoundingBox = this.adjustBoundingBoxX(
            this.adjustBoundingBoxY(nextBoundingBox, controller),
            controller
        );

        const patches = Record.mapValue(this.entities, (entity) =>
            Entity.transform(entity, prevBoundingBox, snappedNextBoundingBox)
        );

        controller.editController.updateEntities(patches);
    }

    private static computeNextBoundingBox(
        prevBoundingBox: ModelCordBox,
        prevPoint: ModelCordPoint,
        nextPoint: ModelCordPoint,
        handle: TransformType
    ): ModelCordBox {
        const diffX = nextPoint.x - prevPoint.x;
        const diffY = nextPoint.y - prevPoint.y;

        switch (handle) {
            case 'translate': {
                return Patch.apply(prevBoundingBox, {
                    point: {
                        x: prevBoundingBox.point.x + diffX,
                        y: prevBoundingBox.point.y + diffY,
                    },
                });
            }
            case 'resize.topLeft': {
                return Patch.apply(prevBoundingBox, {
                    point: {
                        x: prevBoundingBox.point.x + diffX,
                        y: prevBoundingBox.point.y + diffY,
                    },
                    size: {
                        width: prevBoundingBox.size.width - diffX,
                        height: prevBoundingBox.size.height - diffY,
                    },
                });
            }
            case 'resize.top': {
                return Patch.apply(prevBoundingBox, {
                    point: { y: prevBoundingBox.point.y + diffY },
                    size: { height: prevBoundingBox.size.height - diffY },
                });
            }
            case 'resize.topRight': {
                return Patch.apply(prevBoundingBox, {
                    point: { y: prevBoundingBox.point.y + diffY },
                    size: {
                        width: prevBoundingBox.size.width + diffX,
                        height: prevBoundingBox.size.height - diffY,
                    },
                });
            }
            case 'resize.left': {
                return Patch.apply(prevBoundingBox, {
                    point: { x: prevBoundingBox.point.x + diffX },
                    size: { width: prevBoundingBox.size.width - diffX },
                });
            }
            case 'resize.right': {
                return Patch.apply(prevBoundingBox, {
                    size: { width: prevBoundingBox.size.width + diffX },
                });
            }
            case 'resize.bottomLeft': {
                return Patch.apply(prevBoundingBox, {
                    point: { x: prevBoundingBox.point.x + diffX },
                    size: {
                        width: prevBoundingBox.size.width - diffX,
                        height: prevBoundingBox.size.height + diffY,
                    },
                });
            }
            case 'resize.bottom': {
                return Patch.apply(prevBoundingBox, {
                    size: { height: prevBoundingBox.size.height + diffY },
                });
            }
            case 'resize.bottomRight': {
                return Patch.apply(prevBoundingBox, {
                    size: {
                        width: prevBoundingBox.size.width + diffX,
                        height: prevBoundingBox.size.height + diffY,
                    },
                });
            }
            default:
                throw 'Unreachable';
        }
    }

    private adjustBoundingBoxX(boundingBox: ModelCordBox, controller: EditorController): ModelCordBox {
        const {
            point: topLeft,
            size: { width, height },
        } = boundingBox;
        const { camera } = controller.state;

        const otherEntities = Record.filter(controller.state.page.entities, (entity) => !(entity.id in this.entities));

        const topLeftSnapResult = TransformSession.getSnap(otherEntities, topLeft, camera, 'x');
        const topRightSnapResult = TransformSession.getSnap(
            otherEntities,
            Point.model(topLeft.x + width, topLeft.y),
            camera,
            'x'
        );
        const bottomLeftSnapResult = TransformSession.getSnap(
            otherEntities,
            Point.model(topLeft.x, topLeft.y + height),
            camera,
            'x'
        );
        const bottomRightSnapResult = TransformSession.getSnap(
            otherEntities,
            Point.model(topLeft.x + width, topLeft.y + height),
            camera,
            'x'
        );
        const centerSnapResult = TransformSession.getSnap(
            otherEntities,
            Point.model(topLeft.x + width / 2, topLeft.y + height / 2),
            camera,
            'x'
        );

        switch (this.handle) {
            case 'translate': {
                const snapResult = [
                    topLeftSnapResult,
                    topRightSnapResult,
                    bottomLeftSnapResult,
                    bottomRightSnapResult,
                    centerSnapResult,
                ].reduce((r1, r2) => (r1.distance < r2.distance ? r1 : r1.distance > r2.distance ? r2 : r1));

                if (snapResult.points.length === 0) return boundingBox;
                return Patch.apply(boundingBox, {
                    point: {
                        x: boundingBox.point.x + (snapResult.points[0].x - snapResult.originPoint.x),
                    },
                });
            }

            case 'resize.topLeft':
            case 'resize.left':
            case 'resize.bottomLeft': {
                const snapResult = [topLeftSnapResult, bottomLeftSnapResult].reduce((r1, r2) =>
                    r1.distance < r2.distance ? r1 : r1.distance > r2.distance ? r2 : r1
                );

                if (snapResult.points.length === 0) return boundingBox;
                return Patch.apply(boundingBox, {
                    point: {
                        x: boundingBox.point.x + (snapResult.points[0].x - snapResult.originPoint.x),
                    },
                    size: {
                        width: boundingBox.size.width - (snapResult.points[0].x - snapResult.originPoint.x),
                    },
                });
            }

            case 'resize.topRight':
            case 'resize.right':
            case 'resize.bottomRight': {
                const snapResult = [topRightSnapResult, bottomRightSnapResult].reduce((r1, r2) =>
                    r1.distance < r2.distance ? r1 : r1.distance > r2.distance ? r2 : r1
                );

                if (snapResult.points.length === 0) return boundingBox;
                return Patch.apply(boundingBox, {
                    size: {
                        width: boundingBox.size.width + (snapResult.points[0].x - snapResult.originPoint.x),
                    },
                });
            }

            case 'resize.top':
            case 'resize.bottom': {
                return boundingBox;
            }
            default:
                throw 'Unreachable';
        }
    }

    private adjustBoundingBoxY(boundingBox: ModelCordBox, controller: EditorController): ModelCordBox {
        const {
            point: topLeft,
            size: { width, height },
        } = boundingBox;
        const { camera } = controller.state;

        const otherEntities = Record.filter(controller.state.page.entities, (entity) => !(entity.id in this.entities));

        const topLeftSnapResult = TransformSession.getSnap(otherEntities, topLeft, camera, 'y');
        const topRightSnapResult = TransformSession.getSnap(
            otherEntities,
            Point.model(topLeft.x + width, topLeft.y),
            camera,
            'y'
        );
        const bottomLeftSnapResult = TransformSession.getSnap(
            otherEntities,
            Point.model(topLeft.x, topLeft.y + height),
            camera,
            'y'
        );
        const bottomRightSnapResult = TransformSession.getSnap(
            otherEntities,
            Point.model(topLeft.x + width, topLeft.y + height),
            camera,
            'y'
        );
        const centerSnapResult = TransformSession.getSnap(
            otherEntities,
            Point.model(topLeft.x + width / 2, topLeft.y + height / 2),
            camera,
            'y'
        );

        switch (this.handle) {
            case 'translate': {
                const snapResult = [
                    topLeftSnapResult,
                    topRightSnapResult,
                    bottomLeftSnapResult,
                    bottomRightSnapResult,
                    centerSnapResult,
                ].reduce((r1, r2) => (r1.distance < r2.distance ? r1 : r1.distance > r2.distance ? r2 : r1));

                if (snapResult.points.length === 0) return boundingBox;
                return Patch.apply(boundingBox, {
                    point: {
                        y: boundingBox.point.y + (snapResult.points[0].y - snapResult.originPoint.y),
                    },
                });
            }

            case 'resize.topLeft':
            case 'resize.top':
            case 'resize.topRight': {
                const snapResult = [topLeftSnapResult, topRightSnapResult].reduce((r1, r2) =>
                    r1.distance < r2.distance ? r1 : r1.distance > r2.distance ? r2 : r1
                );

                if (snapResult.points.length === 0) return boundingBox;
                return Patch.apply(boundingBox, {
                    point: {
                        y: boundingBox.point.y + (snapResult.points[0].y - snapResult.originPoint.y),
                    },
                    size: {
                        height: boundingBox.size.height - (snapResult.points[0].y - snapResult.originPoint.y),
                    },
                });
            }

            case 'resize.bottomLeft':
            case 'resize.bottom':
            case 'resize.bottomRight': {
                const snapResult = [bottomLeftSnapResult, bottomRightSnapResult].reduce((r1, r2) =>
                    r1.distance < r2.distance ? r1 : r1.distance > r2.distance ? r2 : r1
                );

                if (snapResult.points.length === 0) return boundingBox;
                return Patch.apply(boundingBox, {
                    size: {
                        height: boundingBox.size.height + (snapResult.points[0].y - snapResult.originPoint.y),
                    },
                });
            }

            case 'resize.left':
            case 'resize.right': {
                return boundingBox;
            }
            default:
                throw 'Unreachable';
        }
    }

    private static getSnap(
        entities: EntityMap,
        originPoint: ModelCordPoint,
        camera: Camera,
        direction: 'x' | 'y'
    ): SnapResult {
        const DELTA = 16 / camera.scale;

        const points: ModelCordPoint[] = [];
        let distance = DELTA;
        for (const entity of Object.values(entities)) {
            const box = Entity.getBoundingBox(entity);

            const topLeft = box.point;
            const topLeftDistance = Math.abs(topLeft[direction] - originPoint[direction]);
            if (topLeftDistance < distance) {
                distance = topLeftDistance;
                points.length = 0;
            }
            if (topLeftDistance <= distance) points.push(topLeft);

            const topRight = Point.model(box.point.x + box.size.width, box.point.y);
            const topRightDistance = Math.abs(topRight[direction] - originPoint[direction]);
            if (topRightDistance < distance) {
                distance = topRightDistance;
                points.length = 0;
            }
            if (topRightDistance <= distance) points.push(topRight);

            const bottomLeft = Point.model(box.point.x, box.point.y + box.size.height);
            const bottomLeftDistance = Math.abs(bottomLeft[direction] - originPoint[direction]);
            if (bottomLeftDistance < distance) {
                distance = bottomLeftDistance;
                points.length = 0;
            }
            if (bottomLeftDistance <= distance) points.push(bottomLeft);

            const bottomRight = Point.model(box.point.x + box.size.width, box.point.y + box.size.height);
            const bottomRightDistance = Math.abs(bottomRight[direction] - originPoint[direction]);
            if (bottomRightDistance < distance) {
                distance = bottomRightDistance;
                points.length = 0;
            }
            if (bottomRightDistance <= distance) points.push(bottomRight);

            const center = Point.model(box.point.x + box.size.width / 2, box.point.y + box.size.height / 2);
            const centerDistance = Math.abs(center[direction] - originPoint[direction]);
            if (centerDistance < distance) {
                distance = centerDistance;
                points.length = 0;
            }
            if (centerDistance <= distance) points.push(center);
        }
        return { originPoint, distance, points };
    }
}

interface SnapResult {
    distance: number;
    originPoint: ModelCordPoint;
    points: ModelCordPoint[];
}
