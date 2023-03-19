import { Box } from '../../../../model/Box';
import { Entity } from '../../../../model/entity/Entity';
import { ModelCordPoint } from '../../../../model/Point';
import { EditorController } from '../../controllers/EditorController';
import { TransformHandle } from '../TransformHandle';
import { Transaction } from './Transaction';

export class TransformEntitiesTransaction implements Transaction {
    readonly type = 'TransformEntities';
    public entities: Entity[];
    public handle: TransformHandle;
    public originPoint: ModelCordPoint;

    constructor(entities: Entity[], handle: TransformHandle, originPoint: ModelCordPoint) {
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

        const prevBoundingBox = Box.computeBoundingBox(this.entities);
        const diffX = currentPoint.x - this.originPoint.x;
        const diffY = currentPoint.y - this.originPoint.y;

        const nextBoundingBox = (() => {
            switch (this.handle) {
                case 'translate': {
                    return {
                        ...prevBoundingBox,
                        x: prevBoundingBox.x + diffX,
                        y: prevBoundingBox.y + diffY,
                    };
                }
                case 'resize.topLeft': {
                    return {
                        ...prevBoundingBox,
                        x: prevBoundingBox.x + diffX,
                        y: prevBoundingBox.y + diffY,
                        width: prevBoundingBox.width - diffX,
                        height: prevBoundingBox.height - diffY,
                    };
                }
                case 'resize.top': {
                    return {
                        ...prevBoundingBox,
                        y: prevBoundingBox.y + diffY,
                        height: prevBoundingBox.height - diffY,
                    };
                }
                case 'resize.topRight': {
                    return {
                        ...prevBoundingBox,
                        y: prevBoundingBox.y + diffY,
                        width: prevBoundingBox.width + diffX,
                        height: prevBoundingBox.height - diffY,
                    };
                }
                case 'resize.left': {
                    return {
                        ...prevBoundingBox,
                        x: prevBoundingBox.x + diffX,
                        width: prevBoundingBox.width - diffX,
                    };
                }
                case 'resize.right': {
                    return {
                        ...prevBoundingBox,
                        width: prevBoundingBox.width + diffX,
                    };
                }
                case 'resize.bottomLeft': {
                    return {
                        ...prevBoundingBox,
                        x: prevBoundingBox.x + diffX,
                        width: prevBoundingBox.width - diffX,
                        height: prevBoundingBox.height + diffY,
                    };
                }
                case 'resize.bottom': {
                    return {
                        ...prevBoundingBox,
                        height: prevBoundingBox.height + diffY,
                    };
                }
                case 'resize.bottomRight': {
                    return {
                        ...prevBoundingBox,
                        width: prevBoundingBox.width + diffX,
                        height: prevBoundingBox.height + diffY,
                    };
                }
                default:
                    throw new Error('NIY');
            }
        })();

        const scaleX = nextBoundingBox.width / prevBoundingBox.width;
        const scaleY = nextBoundingBox.height / prevBoundingBox.height;

        const nextEntities = this.entities.map((entity) => {
            if (entity.type !== 'rect') return entity;

            return {
                ...entity,
                point: {
                    x: (entity.point.x - prevBoundingBox.x) * scaleX + nextBoundingBox.x,
                    y: (entity.point.y - prevBoundingBox.y) * scaleY + nextBoundingBox.y,
                },
                width: entity.width * scaleX,
                height: entity.height * scaleY,
            };
        });

        return {
            page: {
                entities: page.entities.map((prevEntity) => {
                    return nextEntities.find((entity) => entity.id === prevEntity.id) ?? prevEntity;
                }),
            },
        };
    }
}
