import { Patch } from '../../Patch';
import { Entity } from '../entity/Entity';
import { ActionDelegate } from './Action';
import { Page } from '../Page';
import { Record } from '../../Record';

export interface UpdateEntitiesAction {
    type: 'updateEntities';
    patch: Record<string, Patch<Entity>>;
}

export function UpdateEntitiesAction(patch: Record<string, Patch<Entity>>): UpdateEntitiesAction {
    return { type: 'updateEntities', patch };
}

export const UpdateEntitiesActionDelegate: ActionDelegate<UpdateEntitiesAction> = {
    toPatch(page: Page, action: UpdateEntitiesAction): Patch<Page> {
        const patch: Record<string, Patch<Entity>> = {};

        for (const [entityId, subPatch] of Object.entries(action.patch)) {
            if (!(entityId in page.entities)) continue;

            patch[entityId] = subPatch;
        }
        return { entities: patch };
    },
    computeInverse(page: Page, action: UpdateEntitiesAction): UpdateEntitiesAction {
        const inversePatch = Patch.computeInverse(page.entities, action.patch) as Record<string, Patch<Entity>>;

        return UpdateEntitiesAction(inversePatch);
    },
};
