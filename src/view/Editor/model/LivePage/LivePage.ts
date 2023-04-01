import { Entity } from '../../../../model/entity/Entity';
import { Patch } from '../../../../model/Patch';
import { Page } from '../../../../model/Page';

export interface LivePage extends Readonly<Page> {
    transaction(fn: (transaction: Transaction) => void): void;

    onChange?: () => void;
}

export interface Transaction {
    add(entity: Entity): void;

    delete(entityId: string): void;

    update(entityId: string, type: string, patch: Patch<Entity>): void;
}
