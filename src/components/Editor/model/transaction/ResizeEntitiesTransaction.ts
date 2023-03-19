import { Box } from '../../../../model/Box';
import { Entity } from '../../../../model/entity/Entity';
import { Patch } from '../../../../model/Patch';
import { AnchorPoint } from '../AnchorPoint';
import { EditorState } from '../EditorState';
import { Transaction } from './Transaction';

export class ResizeEntitiesTransaction implements Transaction {
    readonly type = 'ResizeEntity';
    public prevEntities: Entity[];
    public nextEntities: Entity[];
    public anchor: AnchorPoint;

    constructor(entities: Entity[], anchor: AnchorPoint) {
        this.anchor = anchor;
        this.prevEntities = entities;
        this.nextEntities = entities;
    }

    resize(diffX: number, diffY: number) {
        const prevBoundingBox = Box.computeBoundingBox(this.prevEntities);

        const nextBoundingBox = (() => {
            switch (this.anchor) {
                case 'topLeft': {
                    return {
                        ...prevBoundingBox,
                        width: prevBoundingBox.width + diffX,
                        height: prevBoundingBox.height + diffY,
                    };
                }
                case 'top': {
                    return {
                        ...prevBoundingBox,
                        height: prevBoundingBox.height + diffY,
                    };
                }
                case 'topRight': {
                    return {
                        ...prevBoundingBox,
                        x: prevBoundingBox.x + diffX,
                        width: prevBoundingBox.width - diffX,
                        height: prevBoundingBox.height + diffY,
                    };
                }
                case 'left': {
                    return {
                        ...prevBoundingBox,
                        width: prevBoundingBox.width + diffX,
                    };
                }
                case 'right': {
                    return {
                        ...prevBoundingBox,
                        x: prevBoundingBox.x + diffX,
                        width: prevBoundingBox.width - diffX,
                    };
                }
                case 'bottomLeft': {
                    return {
                        ...prevBoundingBox,
                        y: prevBoundingBox.y + diffY,
                        width: prevBoundingBox.width + diffX,
                        height: prevBoundingBox.height - diffY,
                    };
                }
                case 'bottom': {
                    return {
                        ...prevBoundingBox,
                        y: prevBoundingBox.y + diffY,
                        height: prevBoundingBox.height - diffY,
                    };
                }
                case 'bottomRight': {
                    return {
                        ...prevBoundingBox,
                        x: prevBoundingBox.x + diffX,
                        y: prevBoundingBox.y + diffY,
                        width: prevBoundingBox.width - diffX,
                        height: prevBoundingBox.height - diffY,
                    };
                }
                default:
                    throw new Error('NIY');
            }
        })();

        const scaleX = nextBoundingBox.width / prevBoundingBox.width;
        const scaleY = nextBoundingBox.height / prevBoundingBox.height;

        this.nextEntities = this.prevEntities.map((prevEntity) => {
            if (prevEntity.type !== 'rect') return prevEntity;

            return {
                ...prevEntity,
                x: (prevEntity.x - prevBoundingBox.x) * scaleX + nextBoundingBox.x,
                y: (prevEntity.y - prevBoundingBox.y) * scaleY + nextBoundingBox.y,
                width: prevEntity.width * scaleX,
                height: prevEntity.height * scaleY,
            };
        });
    }

    undo(nextState: EditorState): EditorState {
        return Patch.apply(nextState, {
            page: {
                entities: nextState.page.entities.map((nextEntity) => {
                    return this.prevEntities.find((entity) => entity.id === nextEntity.id) ?? nextEntity;
                }),
            },
            selectedEntities: nextState.selectedEntities.map((nextEntity) => {
                return this.prevEntities.find((entity) => entity.id === nextEntity.id) ?? nextEntity;
            }),
        });
    }

    redo(prevState: EditorState): EditorState {
        return Patch.apply(prevState, {
            page: {
                entities: prevState.page.entities.map((prevEntity) => {
                    return this.nextEntities.find((entity) => entity.id === prevEntity.id) ?? prevEntity;
                }),
            },
            selectedEntities: prevState.selectedEntities.map((prevEntity) => {
                return this.nextEntities.find((entity) => entity.id === prevEntity.id) ?? prevEntity;
            }),
        });
    }
}
