import { Extension } from '../../core/controller/Extension';
import { Entity, nonNull, Patch, Record } from '@drawing/common';
import { IEditorController } from '../../core/controller/IEditorController';
import { ContextMenuExtension } from '../../core/extensions/contextMenu/ContextMenuExtension';
import { LayoutContextMenuSection } from './LayoutContextMenuSection';
import { SelectExtension } from '../../core/extensions/select/SelectExtension';

export class LayoutExtension extends Extension {
    private selectExtension: SelectExtension = null as never;

    onRegister(controller: IEditorController) {
        super.onRegister(controller);

        this.selectExtension = controller.requireExtension(SelectExtension);

        controller.requireExtension(ContextMenuExtension).addSection({
            view: LayoutContextMenuSection,
            activateIf: () => this.selectExtension.selectedEntityIds.length >= 2,
        });
    }

    distributeSelectedEntitiesHorizontal() {
        this.distributeHorizontal(this.selectExtension.selectedEntityIds);
    }

    distributeHorizontal(entityIds: string[]) {
        const entities = entityIds.map((entityId) => this.controller.state.page.entities[entityId]).filter(nonNull);
        if (entities.length <= 1) return;

        const boundingBox = Entity.computeBoundingBox(Record.mapToRecord(entities, (entity) => [entity.id, entity]));
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

        this.controller.updateEntities('transform', patches);
    }

    distributeSelectedEntitiesVertical() {
        this.distributeVertical(this.selectExtension.selectedEntityIds);
    }

    distributeVertical(entityIds: string[]) {
        const entities = entityIds.map((entityId) => this.controller.state.page.entities[entityId]).filter(nonNull);
        if (entities.length <= 1) return;

        const boundingBox = Entity.computeBoundingBox(Record.mapToRecord(entities, (entity) => [entity.id, entity]));
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

        this.controller.updateEntities('transform', patches);
    }

    alignSelectedEntitiesHorizontal(anchor: 'left' | 'center' | 'right') {
        this.alignHorizontal(this.selectExtension.selectedEntityIds, anchor);
    }

    alignHorizontal(entityIds: string[], anchor: 'left' | 'center' | 'right') {
        const entities = entityIds.map((entityId) => this.controller.state.page.entities[entityId]).filter(nonNull);
        if (entities.length <= 1) return;

        const boundingBox = Entity.computeBoundingBox(Record.mapToRecord(entities, (entity) => [entity.id, entity]));
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

        this.controller.updateEntities('transform', patches);
    }

    alignSelectedEntitiesVertical(anchor: 'top' | 'center' | 'bottom') {
        this.alignVertical(this.selectExtension.selectedEntityIds, anchor);
    }

    alignVertical(entityIds: string[], anchor: 'top' | 'center' | 'bottom') {
        const entities = entityIds.map((entityId) => this.controller.state.page.entities[entityId]).filter(nonNull);
        if (entities.length <= 1) return;

        const boundingBox = Entity.computeBoundingBox(Record.mapToRecord(entities, (entity) => [entity.id, entity]));
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

        this.controller.updateEntities('transform', patches);
    }
}
