import { ActionDelegate } from './Action';
import { Page } from '../Page';
import { Patch } from '../../Patch';
import { Entity } from '../entity/Entity';
import { Record } from '../../Record';

export interface AddEntitiesAction {
    type: 'addEntities';
    entities: Entity[];
}

export function AddEntitiesAction(entities: Entity[]): AddEntitiesAction {
    return { type: 'addEntities', entities };
}

export const AddEntitiesActionDelegate: ActionDelegate<AddEntitiesAction> = {
    toPatch(page: Page, action: AddEntitiesAction): Patch<Page> {
        return {
            entities: Record.mapToRecord(action.entities, (entity) => [entity.id, entity]),
        };
    },
};
