import { EditActionDelegate } from './EditAction';
import { Page } from '../Page';
import { Record } from '../../Record';
import { Patch } from '../../Patch';

export interface DeleteEntitiesEditAction {
    type: 'deleteEntities';
    entityIds: string[];
}

export function DeleteEntitiesEditAction(entityIds: string[]): DeleteEntitiesEditAction {
    return { type: 'deleteEntities', entityIds };
}

export module DeleteEntitiesEditAction {
    export const delegate: EditActionDelegate = {
        toPatch(page: Page, action: DeleteEntitiesEditAction): Patch<Page> {
            return {
                entities: Record.mapToRecord(action.entityIds, (entityId) => [entityId, undefined]),
                layouts: page.layouts.filter((id) => !action.entityIds.includes(id)),
            };
        },
    };
}
