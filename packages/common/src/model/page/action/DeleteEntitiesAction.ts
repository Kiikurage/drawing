import { ActionDelegate } from './Action';
import { Page } from '../Page';
import { Patch } from '../../Patch';
import { AddEntitiesAction } from '@drawing/common/src/model/page/action/AddEntitiesAction';
import { nonNull } from '@drawing/common/src/lib/nonNull';

export interface DeleteEntitiesAction {
    type: 'deleteEntities';
    entityIds: string[];
}

export function DeleteEntitiesAction(entityIds: string[]): DeleteEntitiesAction {
    return { type: 'deleteEntities', entityIds };
}

export const DeleteEntitiesActionDelegate: ActionDelegate<DeleteEntitiesAction> = {
    toPatch(page: Page, action: DeleteEntitiesAction): Patch<Page> {
        let patch: Patch<Page> = {};

        for (const entityId of action.entityIds) {
            patch = Patch.merge(patch, {
                entities: {
                    [entityId]: undefined,
                },
            });
        }

        return patch;
    },
    computeInverse(page: Page, action: DeleteEntitiesAction): AddEntitiesAction {
        return AddEntitiesAction(action.entityIds.map((id) => page.entities[id]).filter(nonNull));
    },
};
