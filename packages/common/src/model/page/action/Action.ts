import { AddEntitiesAction, AddEntitiesActionDelegate } from './AddEntitiesAction';
import { DeleteEntitiesAction, DeleteEntitiesActionDelegate } from './DeleteEntitiesAction';
import { UpdateEntitiesAction, UpdateEntitiesActionDelegate } from './UpdateEntitiesAction';
import { Page } from '../Page';
import { Patch } from '../../Patch';

export type Action = AddEntitiesAction | DeleteEntitiesAction | UpdateEntitiesAction;
// | AddGroupAction
// | DeleteGroupAction
// | UpdateGroupAction;

export module Action {
    const delegates: Record<Action['type'], ActionDelegate<Action>> = {
        addEntities: AddEntitiesActionDelegate,
        updateEntities: UpdateEntitiesActionDelegate,
        deleteEntities: DeleteEntitiesActionDelegate,

        // addGroup: AddGroupActionDelegate,
        // deleteGroup: DeleteGroupActionDelegate,
        // updateGroup: UpdateGroupActionDelegate,
    };

    function getDelegate<T extends Action>(action: T): ActionDelegate<T> {
        return delegates[action.type];
    }

    export function toPatch(page: Page, action: Action): Patch<Page> {
        return getDelegate(action).toPatch(page, action);
    }

    export function computeInverse(page: Page, action: Action): Action {
        return getDelegate(action).computeInverse(page, action);
    }
}

export interface ActionDelegate<T extends Action> {
    toPatch(page: Page, action: T): Patch<Page>;

    computeInverse(page: Page, action: T): Action;
}
