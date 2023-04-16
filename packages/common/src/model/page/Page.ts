import { randomId } from '../../lib/randomId';
import { Entity } from './entity/Entity';
import { Patch } from '../Patch';
import { Action } from '@drawing/common/src/model/page/action/Action';
import { Box } from '@drawing/common/src/model/Box';
import { FractionalKey } from '@drawing/common/src/model/FractionalKey';
import { UpdateEntitiesAction } from '@drawing/common/src/model/page/action/UpdateEntitiesAction';
import { nonNull } from '@drawing/common/src/lib/nonNull';

export interface Page {
    id: string;
    entities: { [entityId: string]: Entity | undefined };
}

export module Page {
    export function create(data: Patch<Omit<Page, 'id'>> = {}): Page {
        return Patch.apply<Page>(
            {
                id: randomId(),
                entities: {},
            },
            data
        );
    }

    export function computeLayout(page: Page): Entity[] {
        return Object.values(page.entities)
            .filter(nonNull)
            .sort((e1, e2) => FractionalKey.comparator(e1.orderKey, e2.orderKey));
    }

    export function bringAfter(page: Page, entityId: string, referenceEntityId: string): Action {
        const layout = computeLayout(page);

        const entityIndex = layout.findIndex((entity) => entity.id === entityId);
        if (entityIndex === -1) throw new Error(`Entity ${entityId} is not found`);

        const referenceEntity = page.entities[referenceEntityId];
        if (referenceEntity === undefined) throw new Error(`Entity ${referenceEntityId} is not found`);

        return UpdateEntitiesAction({
            [entityId]: {
                orderKey: FractionalKey.insertAfter(
                    layout.map((e) => e.orderKey),
                    referenceEntity.orderKey
                ),
            },
        });
    }

    export function bringBefore(page: Page, entityId: string, referenceEntityId: string): Action {
        const layout = computeLayout(page);

        const entityIndex = layout.findIndex((entity) => entity.id === entityId);
        if (entityIndex === -1) throw new Error(`Entity ${entityId} is not found`);

        const referenceEntity = page.entities[referenceEntityId];
        if (referenceEntity === undefined) throw new Error(`Entity ${referenceEntityId} is not found`);

        return UpdateEntitiesAction({
            [entityId]: {
                orderKey: FractionalKey.insertBefore(
                    layout.map((e) => e.orderKey),
                    referenceEntity.orderKey
                ),
            },
        });
    }

    export function bringForward(page: Page, entityId: string): Action {
        const entity = page.entities[entityId];
        if (entity === undefined) throw new Error(`Entity ${entityId} is not found`);
        const entityBox = Entity.getBoundingBox(entity);

        const layout = computeLayout(page).filter((entity) => Box.isOverlap(Entity.getBoundingBox(entity), entityBox));

        const index = layout.findIndex((e) => e.id === entity.id);
        if (index === -1) throw new Error(`Entity ${entityId} is not found`);
        if (index === layout.length - 1) throw new Error(`Entity ${entityId} is at the front`);
        const forwardEntity = layout[index + 1];

        return bringAfter(page, entityId, forwardEntity.id);
    }

    export function bringToTop(page: Page, entityId: string): Action {
        const topEntity = computeLayout(page).at(-1);
        if (topEntity === undefined) throw new Error('No entity exists');
        if (topEntity.id === entityId) throw new Error(`Entity ${entityId} is at the front`);

        return bringAfter(page, entityId, topEntity.id);
    }

    export function bringBackward(page: Page, entityId: string): Action {
        const entity = page.entities[entityId];
        if (entity === undefined) throw new Error(`Entity ${entityId} is not found`);
        const entityBox = Entity.getBoundingBox(entity);

        const layout = computeLayout(page).filter((entity) => Box.isOverlap(Entity.getBoundingBox(entity), entityBox));

        const index = layout.findIndex((e) => e.id === entity.id);
        if (index === -1) throw new Error(`Entity ${entityId} is not found`);
        if (index === 0) throw new Error(`Entity ${entityId} is at the back`);
        const forwardEntity = layout[index - 1];

        return bringBefore(page, entityId, forwardEntity.id);
    }

    export function bringToBack(page: Page, entityId: string): Action {
        const backEntity = computeLayout(page)[0];
        if (backEntity === undefined) throw new Error('No entity exists');
        if (backEntity.id === entityId) throw new Error(`Entity ${entityId} is at the back`);

        return bringBefore(page, entityId, backEntity.id);
    }
}
