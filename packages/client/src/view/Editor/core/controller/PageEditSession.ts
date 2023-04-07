import { Entity, EntityMap, Patch, Record } from '@drawing/common';

export interface PageEditSession {
    addEntities(entities: EntityMap): void;

    deleteEntities(entityIds: string[]): void;

    updateEntities(type: string, patches: Record<string, Patch<Entity>>): void;

    commit(): void;
}
