import { EditActionDelegate } from './EditAction';
import { Page } from '../Page';
import { Patch } from '../../Patch';
import { Entity } from '../entity/Entity';
import { Record } from '../../Record';

export interface AddEntitiesEditAction {
    type: 'addEntities';
    entities: Entity[];
}

export function AddEntitiesEditAction(entities: Entity[]): AddEntitiesEditAction {
    return { type: 'addEntities', entities };
}

export module AddEntitiesEditAction {
    export const delegate: EditActionDelegate = {
        toPatch(page: Page, action: AddEntitiesEditAction): Patch<Page> {
            return {
                entities: Record.mapToRecord(action.entities, (entity) => [entity.id, entity]),
                layouts: [...page.layouts, ...action.entities.map((entity) => entity.id)],
            };
        },
    };
}
