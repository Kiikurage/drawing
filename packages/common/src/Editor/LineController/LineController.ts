import { MouseEventButton } from '../model/MouseEventButton';
import { MYDragEvent } from '../model/MYDragEvent';
import { GestureRecognizer } from '@drawing/common/src/Editor/GestureRecognizer/GestureRecognizer';
import { ModeController } from '../mode/ModeController';
import { PageController } from '../PageController/PageController';
import { SelectionController } from '../selection/SelectionController';
import { Command } from '../CommandManager/Command';
import { KeyboardShortcutCommandManager } from '../CommandManager/KeyboardShortcutCommandManager';
import { TransformController } from '../TransformController/TransformController';
import { LineEntity } from '@drawing/common/src/model/page/entity/LineEntity';
import { ArrowHeadType } from '@drawing/common/src/model/ArrowHeadType';
import { Record } from '@drawing/common/src/model/Record';
import { Patch } from '@drawing/common/src/model/Patch';
import { nonNull } from '@drawing/common/src/lib/nonNull';
import { ModelCordPoint } from '@drawing/common/src/model/Point';
import { Entity } from '@drawing/common/src/model/page/entity/Entity';
import { FractionalKey } from '@drawing/common/src/model/FractionalKey';

export class LineController {
    static readonly ModeName = 'line';

    constructor(
        private readonly gestureRecognizer: GestureRecognizer,
        private readonly modeController: ModeController,
        private readonly pageController: PageController,
        private readonly selectionController: SelectionController,
        private readonly keyboardShortcutCommandManager: KeyboardShortcutCommandManager,
        private readonly transformController: TransformController
    ) {
        this.gestureRecognizer.onDragStart.addListener(this.handleDragStart);

        const changeModeCommand = Command('changeModeToLine', 'Change mode to "Line"', () =>
            this.modeController.setMode(LineController.ModeName)
        );
        this.keyboardShortcutCommandManager.set(['L'], changeModeCommand).set(['A'], changeModeCommand);
    }

    setArrowHeadType(entityIds: string[], point: 'p1' | 'p2', type: ArrowHeadType) {
        this.pageController.updateEntities(
            Record.mapToRecord(entityIds, (entityId) => {
                const patch: Patch<LineEntity> = {};
                if (point === 'p1') patch.arrowHeadType1 = type;
                if (point === 'p2') patch.arrowHeadType2 = type;
                return [entityId, patch];
            })
        );
    }

    setArrowHeadTypeForSelectedEntities(point: 'p1' | 'p2', type: ArrowHeadType) {
        this.setArrowHeadType(this.selectionController.selectedEntityIds, point, type);
    }

    private readonly handleDragStart = (ev: MYDragEvent) => {
        if (this.modeController.mode === LineController.ModeName) {
            const linkedEntity1 = findLinkTarget(ev.point, Object.values(this.pageController.entities).filter(nonNull));

            const newEntity = LineEntity.create({
                p1: ev.point,
                p2: ev.point,
                linkedEntityId1: linkedEntity1?.id ?? null,
                orderKey: FractionalKey.insertAfter(
                    this.pageController.layout.map((e) => e.orderKey),
                    null
                ),
            });

            const session = this.pageController.newSession();
            session.addEntities([newEntity]);
            this.selectionController.setSelection([newEntity.id]);

            this.transformController
                .newSingleLineTransformSession({
                    point: 'p2',
                    dragSession: ev.session,
                    entity: newEntity,
                    pageEditSession: session,
                })
                .onEnd.addListener(() => {
                    this.modeController.setMode(SelectionController.ModeName);
                });
        } else if (this.modeController.mode === SelectionController.ModeName) {
            if (ev.button === MouseEventButton.PRIMARY) {
                if (ev.target.type === 'singleLineTransformHandle') {
                    this.transformController
                        .newSingleLineTransformSession({
                            point: ev.target.point,
                            dragSession: ev.session,
                            entity: this.selectionController.selectedEntities[0] as LineEntity,
                        })
                        .onEnd.addListener(() => {
                            this.modeController.setMode(SelectionController.ModeName);
                        });
                }
            }
        }
    };
}

function findLinkTarget(point: ModelCordPoint, entities: Entity[]): Entity | undefined {
    for (const entity of entities) {
        if (entity.type === LineController.ModeName) continue;

        if (Entity.includes(entity, point)) {
            return entity;
        }
    }

    return undefined;
}
