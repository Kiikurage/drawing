import {
    ArrowHeadType,
    Entity,
    EntityMap,
    LineEntity,
    ModelCordPoint,
    Patch,
    Point,
    Record,
    snapPoint,
} from '@drawing/common';
import { Extension } from '../../core/controller/Extension';
import { IEditorController, MouseEventButton, MouseEventInfo } from '../../core/controller/IEditorController';
import { SnapExtension } from '../snap/SnapExtension';
import { ContextMenuExtension } from '../../core/extensions/contextMenu/ContextMenuExtension';
import { ArrowHeadContextMenuSection } from './ArrowHeadContextMenuSection';
import { ModeExtension } from '../mode/ModeExtension';
import { ModeChangeEvent } from '../mode/ModeChangeEvent';
import { SelectExtension } from '../../core/extensions/select/SelectExtension';
import { ToolbarExtension } from '../../core/extensions/toolbar/ToolbarExtension';
import { LineModeToolbarButton } from './LineModeToolbarButton';

export class LineExtension extends Extension {
    static readonly MODE_KEY = 'line';
    private startPoint: ModelCordPoint | null = null;
    private entity: LineEntity | null = null;
    private pointKey: 'p1' | 'p2' = 'p1';
    private snapExtension: SnapExtension = null as never;
    private modeExtension: ModeExtension = null as never;
    private selectExtension: SelectExtension = null as never;

    onRegister(controller: IEditorController) {
        super.onRegister(controller);

        controller.requireExtension(ToolbarExtension).addItem({ view: LineModeToolbarButton });

        this.snapExtension = controller.requireExtension(SnapExtension);

        this.modeExtension = controller.requireExtension(ModeExtension);
        this.modeExtension.onModeChange.addListener(this.onModeChange);
        this.updateModeSpecificListener(this.modeExtension.mode);

        this.selectExtension = controller.requireExtension(SelectExtension);

        controller.requireExtension(ContextMenuExtension).addSection({
            view: ArrowHeadContextMenuSection,
            activateIf: () =>
                Object.values(this.selectExtension.selectedEntityMap).every(
                    (entity) => entity.type === LineExtension.MODE_KEY
                ),
        });

        controller.onMouseMove.addListener(this.onMouseMove);
        controller.onMouseUp.addListener(this.onMouseUp);
        controller.keyboard
            .addPatternListener(['L'], () => {
                this.modeExtension.setMode(LineExtension.MODE_KEY);
            })
            .addPatternListener(['A'], () => {
                this.modeExtension.setMode(LineExtension.MODE_KEY);
            });
    }

    setArrowHeadType(entityIds: string[], point: 'p1' | 'p2', type: ArrowHeadType) {
        this.controller.updateEntities(
            'arrowHeadType',
            Record.mapToRecord(entityIds, (entityId) => {
                const patch: Patch<LineEntity> = {};
                if (point === 'p1') patch.arrowHeadType1 = type;
                if (point === 'p2') patch.arrowHeadType2 = type;
                return [entityId, patch];
            })
        );
    }

    setArrowHeadTypeForSelectedEntities(point: 'p1' | 'p2', type: ArrowHeadType) {
        this.setArrowHeadType(this.selectExtension.selectedEntityIds, point, type);
    }

    private readonly onModeChange = (ev: ModeChangeEvent) => {
        this.updateModeSpecificListener(ev.nextMode);
    };

    private updateModeSpecificListener(mode: string) {
        if (mode === LineExtension.MODE_KEY) {
            this.controller.onMouseDown.addListener(this.onMouseDownLineMode);
        } else {
            this.controller.onMouseDown.removeListener(this.onMouseDownLineMode);
        }

        if (mode === SelectExtension.MODE_KEY) {
            this.controller.onMouseDown.addListener(this.onMouseDownSelectMode);
        } else {
            this.controller.onMouseDown.removeListener(this.onMouseDownSelectMode);
        }
    }

    private readonly onMouseDownLineMode = (ev: MouseEventInfo) => {
        const linkedEntity1 = findLinkTarget(ev.point, this.controller.state.page.entities);

        const newEntity = LineEntity.create({
            p1: ev.point,
            p2: Point.model(ev.point.x + 1, ev.point.y + 1),
            linkedEntityId1: linkedEntity1?.id ?? null,
        });
        const newEntityMap = { [newEntity.id]: newEntity };

        this.controller.addEntities(newEntityMap);
        this.startSingleLineTransform(newEntity, ev.point, 'p2');
    };

    private readonly onMouseDownSelectMode = (ev: MouseEventInfo) => {
        const { hover } = this.controller.state;

        if (ev.button === MouseEventButton.PRIMARY) {
            if (hover.type === 'singleLineTransformHandle') {
                this.startSingleLineTransform(
                    this.selectExtension.selectedEntities[0] as LineEntity,
                    ev.point,
                    hover.point
                );
            }
        }
    };

    private readonly onMouseMove = (ev: MouseEventInfo) => {
        const { startPoint, entity, pointKey } = this;

        if (startPoint === null) return;
        if (entity === null) return;

        const nextPoint = ev.point;

        const prevLinePoint = entity[pointKey];
        let nextLinePoint = Point.model(
            prevLinePoint.x + (nextPoint.x - startPoint.x),
            prevLinePoint.y + (nextPoint.y - startPoint.y)
        );

        if (this.snapExtension.store.state.enabled) {
            const { transform } = snapPoint(
                nextLinePoint,
                Record.filter(this.controller.state.page.entities, (entity) => entity.id !== entity.id),
                16 / this.controller.state.camera.scale
            );
            nextLinePoint = transform.apply(nextLinePoint);
        }

        const linkedEntity = findLinkTarget(nextLinePoint, this.controller.state.page.entities);

        this.controller.updateEntities('transform', {
            [entity.id]: {
                [this.pointKey]: nextLinePoint,
                linkedEntityId1: this.pointKey === 'p1' ? linkedEntity?.id ?? null : entity.linkedEntityId1,
                linkedEntityId2: this.pointKey === 'p2' ? linkedEntity?.id ?? null : entity.linkedEntityId2,
            },
        });
    };

    private readonly onMouseUp = () => {
        if (this.startPoint === null || this.entity === null) return;

        this.entity = null;
        this.startPoint = null;
        this.modeExtension.setMode(SelectExtension.MODE_KEY);
    };

    private startSingleLineTransform(entity: LineEntity, startPoint: ModelCordPoint, pointKey: 'p1' | 'p2') {
        this.entity = entity;
        this.startPoint = startPoint;
        this.pointKey = pointKey;
    }
}

function findLinkTarget(point: ModelCordPoint, entities: EntityMap): Entity | undefined {
    for (const entity of Object.values(entities)) {
        if (entity.type === 'line') continue;

        if (Entity.includes(entity, point)) {
            return entity;
        }
    }

    return undefined;
}
