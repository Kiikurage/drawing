import { Dispatcher, Entity, Page, Patch } from '@drawing/common';

export interface LivePage extends Readonly<Page> {
    transaction(fn: (transaction: Transaction) => void): void;

    onAddEntity: Dispatcher<Entity>;

    onDeleteEntity: Dispatcher<{ entityId: string }>;

    onUpdateEntity: Dispatcher<Entity>;
}

export interface Transaction {
    add(entity: Entity): void;

    delete(entityId: string): void;

    update(entityId: string, type: string, patch: Patch<Entity>): void;
}
