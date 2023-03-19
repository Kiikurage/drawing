import { Box } from '../../../../model/Box';
import { Entity } from '../../../../model/entity/Entity';
import { Patch } from '../../../../model/Patch';
import { EditorState } from '../EditorState';
import { Transaction } from './Transaction';

export class MoveEntitiesTransaction implements Transaction {
    readonly type = 'MoveEntity';
    public prevEntities: Entity[];
    public nextEntities: Entity[];

    constructor(entities: Entity[]) {
        this.prevEntities = entities;
        this.nextEntities = entities;
    }

    move(diffX: number, diffY: number) {
        const prevBoundingBox = Box.computeBoundingBox(this.prevEntities);

        const nextBoundingBox = {
            ...prevBoundingBox,
            x: prevBoundingBox.x + diffX,
            y: prevBoundingBox.y + diffY,
        };

        this.nextEntities = this.prevEntities.map((prevEntity) => {
            if (prevEntity.type !== 'rect') return prevEntity;

            return {
                ...prevEntity,
                x: prevEntity.x + (nextBoundingBox.x - prevBoundingBox.x),
                y: prevEntity.y + (nextBoundingBox.y - prevBoundingBox.y),
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
