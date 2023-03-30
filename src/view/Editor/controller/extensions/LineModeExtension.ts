import { Record } from '../../../../lib/Record';
import { Entity } from '../../../../model/entity/Entity';
import { LineEntity } from '../../../../model/entity/LineEntity';
import { ModelCordPoint, Point } from '../../../../model/Point';
import { EditorMode } from '../../model/EditorMode';
import { EntityMap } from '../../model/EntityMap';
import { snapPoint } from '../../model/SnapUtil';
import { EditorController, ModeChangeEvent, MouseEventButton, MouseEventInfo } from '../EditorController';
import { Extension } from './Extension';

export class LineModeExtension implements Extension {
    private controller: EditorController = null as never;

    // transform
    private startPoint: ModelCordPoint | null = null;
    private entity: LineEntity | null = null;
    private pointKey: 'p1' | 'p2' = 'p1';

    onRegister = (controller: EditorController) => {
        this.controller = controller;
        controller.onModeChange.addListener(this.onModeChange);
        controller.onMouseMove.addListener(this.onMouseMove);
        controller.onMouseUp.addListener(this.onMouseUp);
        this.updateModeSpecificListener(controller.mode);
    };

    private readonly onModeChange = (ev: ModeChangeEvent) => {
        this.updateModeSpecificListener(ev.nextMode);
    };

    private updateModeSpecificListener(mode: EditorMode) {
        if (mode === 'line') {
            this.controller.onMouseDown.addListener(this.onMouseDownLineMode);
        } else {
            this.controller.onMouseDown.removeListener(this.onMouseDownLineMode);
        }

        if (mode === 'select') {
            this.controller.onMouseDown.addListener(this.onMouseDownSelectMode);
        } else {
            this.controller.onMouseDown.removeListener(this.onMouseDownSelectMode);
        }
    }

    private readonly onMouseDownLineMode = (ev: MouseEventInfo) => {
        const newEntity = LineEntity.create({ p1: ev.point, p2: Point.model(ev.point.x + 1, ev.point.y + 1) });
        const newEntityMap = { [newEntity.id]: newEntity };

        this.controller.addEntities(newEntityMap);
        this.startSingleLineTransform(newEntity, ev.point, 'p2');
    };

    private readonly onMouseDownSelectMode = (ev: MouseEventInfo) => {
        const { hover } = this.controller.state;

        if (ev.button === MouseEventButton.PRIMARY) {
            if (hover.type === 'singleLineTransformHandle') {
                this.startSingleLineTransform(
                    Object.values(this.controller.computeSelectedEntities())[0] as LineEntity,
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

        if (this.controller.state.selectMode.snapEnabled) {
            const { transform } = snapPoint(
                nextLinePoint,
                Record.filter(this.controller.state.page.entities, (entity) => entity.id !== entity.id),
                16 / this.controller.state.camera.scale
            );
            nextLinePoint = transform.apply(nextLinePoint);
        }

        const linkedEntity = this.findLinkTarget(nextLinePoint, this.controller.state.page.entities);

        this.controller.updateEntities({
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
        this.controller.setMode('select');
    };

    private startSingleLineTransform(entity: LineEntity, startPoint: ModelCordPoint, pointKey: 'p1' | 'p2') {
        this.entity = entity;
        this.startPoint = startPoint;
        this.pointKey = pointKey;
    }

    private findLinkTarget(point: ModelCordPoint, entities: EntityMap): Entity | undefined {
        for (const entity of Object.values(entities)) {
            if (entity.type === 'line') continue;

            if (Entity.includes(entity, point)) {
                return entity;
            }
        }

        return undefined;
    }
}
