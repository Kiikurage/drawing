import { ActionDelegate } from './Action';
import { Page } from '../Page';
import { Patch } from '../../Patch';

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
};
