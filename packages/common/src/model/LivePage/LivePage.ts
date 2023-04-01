import { Page } from '../Page';
import { Entity } from '../entity/Entity';
import { Patch } from '../Patch';

export interface LivePage extends Readonly<Page> {
    transaction(fn: (transaction: Transaction) => void): void;

    onChange?: () => void;
}

export interface Transaction {
    add(entity: Entity): void;

    delete(entityId: string): void;

    update(entityId: string, type: string, patch: Patch<Entity>): void;
}
