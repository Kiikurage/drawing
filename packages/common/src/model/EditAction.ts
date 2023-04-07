import { Patch } from './Patch';
import { EntityMap } from './EntityMap';
import { Entity } from './entity/Entity';

export type EditAction = AddEntitiesEditAction | DeleteEntitiesEditAction | UpdateEntitiesEditAction;

export interface AddEntitiesEditAction {
    type: 'addEntities';
    entities: EntityMap;
}

export function AddEntitiesEditAction(entities: EntityMap): AddEntitiesEditAction {
    return { type: 'addEntities', entities };
}

export interface DeleteEntitiesEditAction {
    type: 'deleteEntities';
    entityIds: string[];
}

export function DeleteEntitiesEditAction(entityIds: string[]): DeleteEntitiesEditAction {
    return { type: 'deleteEntities', entityIds };
}

export interface UpdateEntitiesEditAction {
    type: 'updateEntities';
    changeType: string;
    patch: Record<string, Patch<Entity>>;
}

export function UpdateEntitiesEditAction(
    changeType: string,
    patch: Record<string, Patch<Entity>>
): UpdateEntitiesEditAction {
    return { type: 'updateEntities', changeType, patch };
}
