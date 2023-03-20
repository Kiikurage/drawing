import { ModelCordBox } from '../../../../model/Box';
import { Entity } from '../../../../model/entity/Entity';
import { Patch } from '../../../../model/Patch';
import { ModelCordPoint } from '../../../../model/Point';
import { EditorController } from '../../controllers/EditorController';
import { TransformType } from '../TransformType';
import { Session } from './Session';

export class TransformSession extends Session {
    readonly type = 'Transform';
    public entities: Entity[];
    public handle: TransformType;
    public originPoint: ModelCordPoint;

    constructor(entities: Entity[], handle: TransformType, originPoint: ModelCordPoint) {
        super();
        this.entities = entities;
        this.handle = handle;
        this.originPoint = originPoint;
    }

    update(controller: EditorController) {
        const {
            currentPoint,
            store: {
                state: { page },
            },
        } = controller;

        const prevBoundingBox = Entity.computeBoundingBox(this.entities);

        const nextBoundingBox = TransformSession.computeNextBoundingBox(
            prevBoundingBox,
            this.originPoint,
            currentPoint,
            this.handle
        );

        const nextEntities = this.entities.map((entity) => {
            return Entity.transform(entity, prevBoundingBox, nextBoundingBox);
        });

        return {
            page: {
                entities: page.entities.map((prevEntity) => {
                    return nextEntities.find((entity) => entity.id === prevEntity.id) ?? prevEntity;
                }),
            },
        };
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
}
