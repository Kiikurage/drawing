import { Patch } from '../../Patch';
import { Entity } from '../entity/Entity';
import { EditActionDelegate } from './EditAction';
import { Page } from '../Page';
import { Record } from '../../Record';

export interface UpdateEntitiesEditAction {
    type: 'updateEntities';
    patch: Record<string, Patch<Entity>>;
}

export function UpdateEntitiesEditAction(patch: Record<string, Patch<Entity>>): UpdateEntitiesEditAction {
    return { type: 'updateEntities', patch };
}

export module UpdateEntitiesEditAction {
    export const delegate: EditActionDelegate = {
        toPatch(page: Page, action: UpdateEntitiesEditAction): Patch<Page> {
            const patch: Record<string, Patch<Entity>> = {};

            for (const [entityId, subPatch] of Object.entries(action.patch)) {
                if (!(entityId in page.entities)) continue;

                patch[entityId] = subPatch;
            }
            return { entities: patch };
        },
    };
}
