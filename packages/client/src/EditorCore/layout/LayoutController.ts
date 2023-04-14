import { SelectionController } from '../selection/SelectionController';
import { PageController } from '../PageController/PageController';
import { nonNull } from '@drawing/common/src/lib/nonNull';
import { Entity } from '@drawing/common/src/model/page/entity/Entity';
import { Patch } from '@drawing/common/src/model/Patch';

export class LayoutController {
    constructor(
        private readonly selectionController: SelectionController,
        private readonly pageController: PageController
    ) {}

    distributeSelectedEntitiesHorizontal() {
        this.distributeHorizontal(this.selectionController.selectedEntityIds);
    }

    distributeHorizontal(entityIds: string[]) {
        const entities = entityIds.map((entityId) => this.pageController.page.entities[entityId]).filter(nonNull);
        if (entities.length <= 1) return;

        const boundingBox = Entity.computeBoundingBox(entities);
        const entityAndBox = entities
            .map((entity) => ({ entity, box: Entity.getBoundingBox(entity) }))
            .sort(({ box: box1 }, { box: box2 }) => box1.point.x - box2.point.x);

        const totalWidth = boundingBox.size.width;
        const sumEntityWidth = entityAndBox.reduce((sum, entry) => sum + entry.box.size.width, 0);

        const gap = (totalWidth - sumEntityWidth) / (entities.length - 1);

        let x = boundingBox.point.x;
        const patches: Record<string, Patch<Entity>> = {};
        const reversePatches: Record<string, Patch<Entity>> = {};

        for (const { entity, box } of entityAndBox) {
            patches[entity.id] = { p1: { x } };
            reversePatches[entity.id] = { p1: { x: entity.p1.x } };
            x += box.size.width + gap;
        }

        this.pageController.updateEntities(patches);
    }

    distributeSelectedEntitiesVertical() {
        this.distributeVertical(this.selectionController.selectedEntityIds);
    }

    distributeVertical(entityIds: string[]) {
        const entities = entityIds.map((entityId) => this.pageController.page.entities[entityId]).filter(nonNull);
        if (entities.length <= 1) return;

        const boundingBox = Entity.computeBoundingBox(entities);
        const entityAndBox = entities
            .map((entity) => ({ entity, box: Entity.getBoundingBox(entity) }))
            .sort(({ box: box1 }, { box: box2 }) => box1.point.y - box2.point.y);

        const totalHeight = boundingBox.size.height;
        const sumEntityHeight = entityAndBox.reduce((sum, entry) => sum + entry.box.size.height, 0);

        const gap = (totalHeight - sumEntityHeight) / (entities.length - 1);

        let y = boundingBox.point.y;
        const patches: Record<string, Patch<Entity>> = {};

        for (const { entity, box } of entityAndBox) {
            patches[entity.id] = { p1: { y } };
            y += box.size.height + gap;
        }

        this.pageController.updateEntities(patches);
    }

    alignSelectedEntitiesHorizontal(anchor: 'left' | 'center' | 'right') {
        this.alignHorizontal(this.selectionController.selectedEntityIds, anchor);
    }

    alignHorizontal(entityIds: string[], anchor: 'left' | 'center' | 'right') {
        const entities = entityIds.map((entityId) => this.pageController.page.entities[entityId]).filter(nonNull);
        if (entities.length <= 1) return;

        const boundingBox = Entity.computeBoundingBox(entities);
        const patches: Record<string, Patch<Entity>> = {};
        const reversePatches: Record<string, Patch<Entity>> = {};
        for (const entity of entities) {
            let x: number;
            switch (anchor) {
                case 'left':
                    x = boundingBox.point.x;
                    break;
                case 'center':
                    x = boundingBox.point.x + boundingBox.size.width / 2 - Entity.getBoundingBox(entity).size.width / 2;
                    break;
                case 'right':
                    x = boundingBox.point.x + boundingBox.size.width - Entity.getBoundingBox(entity).size.width;
                    break;
            }

            patches[entity.id] = { p1: { x } };
            reversePatches[entity.id] = { p1: { x: entity.p1.x } };
        }

        this.pageController.updateEntities(patches);
    }

    alignSelectedEntitiesVertical(anchor: 'top' | 'center' | 'bottom') {
        this.alignVertical(this.selectionController.selectedEntityIds, anchor);
    }

    alignVertical(entityIds: string[], anchor: 'top' | 'center' | 'bottom') {
        const entities = entityIds.map((entityId) => this.pageController.page.entities[entityId]).filter(nonNull);
        if (entities.length <= 1) return;

        const boundingBox = Entity.computeBoundingBox(entities);
        const patches: Record<string, Patch<Entity>> = {};
        const reversePatches: Record<string, Patch<Entity>> = {};
        for (const entity of entities) {
            let y: number;
            switch (anchor) {
                case 'top':
                    y = boundingBox.point.y;
                    break;
                case 'center':
                    y =
                        boundingBox.point.y +
                        boundingBox.size.height / 2 -
                        Entity.getBoundingBox(entity).size.height / 2;
                    break;
                case 'bottom':
                    y = boundingBox.point.y + boundingBox.size.height - Entity.getBoundingBox(entity).size.height;
                    break;
            }

            patches[entity.id] = { p1: { y } };
            reversePatches[entity.id] = { p1: { y: entity.p1.y } };
        }

        this.pageController.updateEntities(patches);
    }
}
