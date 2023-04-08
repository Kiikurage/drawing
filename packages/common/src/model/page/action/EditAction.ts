import { AddEntitiesEditAction } from './AddEntitiesEditAction';
import { DeleteEntitiesEditAction } from './DeleteEntitiesEditAction';
import { UpdateEntitiesEditAction } from './UpdateEntitiesEditAction';
import { Page } from '../Page';
import { Patch } from '../../Patch';

export type EditAction = AddEntitiesEditAction | DeleteEntitiesEditAction | UpdateEntitiesEditAction;

export module EditAction {
    const delegates: Record<EditAction['type'], EditActionDelegate> = {
        addEntities: AddEntitiesEditAction.delegate,
        updateEntities: UpdateEntitiesEditAction.delegate,
        deleteEntities: DeleteEntitiesEditAction.delegate,
    };

    function getDelegate(action: EditAction): EditActionDelegate {
        return delegates[action.type];
    }

    export function toPatch(page: Page, action: EditAction): Patch<Page> {
        return getDelegate(action).toPatch(page, action);
    }
}

export interface EditActionDelegate {
    toPatch(page: Page, action: EditAction): Patch<Page>;
}
