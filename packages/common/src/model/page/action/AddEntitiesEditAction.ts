import { EntityMap } from '../../EntityMap';
import { EditActionDelegate } from './EditAction';
import { Page } from '../Page';
import { Patch } from '../../Patch';

export interface AddEntitiesEditAction {
    type: 'addEntities';
    entities: EntityMap;
}

export function AddEntitiesEditAction(entities: EntityMap): AddEntitiesEditAction {
    return { type: 'addEntities', entities };
}

export module AddEntitiesEditAction {
    export const delegate: EditActionDelegate = {
        toPatch(page: Page, action: AddEntitiesEditAction): Patch<Page> {
            return {
                entities: action.entities,
            };
        },
    };
}
