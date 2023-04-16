import { Entity } from '@drawing/common/src/model/page/entity/Entity';
import { Patch } from '@drawing/common/src/model/Patch';

export interface PageEditSession {
    addEntities(entities: Entity[]): void;

    deleteEntities(entityIds: string[]): void;

    updateEntities(patches: Record<string, Patch<Entity>>): void;

    commit(): void;
}
