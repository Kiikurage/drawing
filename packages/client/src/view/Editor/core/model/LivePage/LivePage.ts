import { Entity, Page, Patch } from '@drawing/common';

export interface LivePage extends Readonly<Page> {
    transaction(fn: (transaction: Transaction) => void): void;

    onAddEntity: (entity: Entity) => void;

    onDeleteEntity: (entityId: string) => void;

    onUpdateEntity: (entity: Entity) => void;
}

export interface Transaction {
    add(entity: Entity): void;

    delete(entityId: string): void;

    update(entityId: string, type: string, patch: Patch<Entity>): void;
}
