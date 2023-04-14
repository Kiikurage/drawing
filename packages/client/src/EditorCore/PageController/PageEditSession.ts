import { Entity, Patch } from '@drawing/common';

export interface PageEditSession {
    addEntities(entities: Entity[]): void;

    deleteEntities(entityIds: string[]): void;

    updateEntities(patches: Record<string, Patch<Entity>>): void;

    commit(): void;
}
