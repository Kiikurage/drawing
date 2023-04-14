import { MYDragEvent } from '../model/MYDragEvent';
import { GestureRecognizer } from '../gesture/GestureRecognizer';
import { ModeController } from '../mode/ModeController';
import { SelectionController } from '../selection/SelectionController';
import { PageController } from '../PageController/PageController';
import { TextEditController } from '../textEdit/TextEditController';
import { Command } from '../CommandManager/Command';
import { KeyboardShortcutCommandManager } from '../CommandManager/KeyboardShortcutCommandManager';
import { MYPointerEvent } from '../model/MYPointerEvent';
import { TransformController } from '../TransformController/TransformController';
import { HorizontalAlign, VerticalAlign } from '@drawing/common/src/model/TextAlign';
import { Record } from '@drawing/common/src/model/Record';
import { TextEntity } from '@drawing/common/src/model/page/entity/TextEntity';
import { TransformType } from '@drawing/common/src/model/TransformType';

export class TextController {
    static readonly ModeName = 'text';

    constructor(
        private readonly gestureRecognizer: GestureRecognizer,
        private readonly modeController: ModeController,
        private readonly selectionController: SelectionController,
        private readonly pageController: PageController,
        private readonly textEditController: TextEditController,
        private readonly keyboardShortcutCommandManager: KeyboardShortcutCommandManager,
        private readonly transformController: TransformController
    ) {
        this.gestureRecognizer.onClick.addListener(this.handleClick);
        this.gestureRecognizer.onDragStart.addListener(this.handleDragStart);

        const changeModeCommand = Command('changeModeToText', 'Change mode to "Text"', () =>
            this.modeController.setMode(TextController.ModeName)
        );
        this.keyboardShortcutCommandManager.set(['T'], changeModeCommand);
    }

    setVerticalTextAlignForSelectedEntities(align: VerticalAlign) {
        this.setVerticalTextAlign(this.selectionController.selectedEntityIds, align);
    }

    setVerticalTextAlign(entityIds: string[], align: VerticalAlign) {
        this.pageController.updateEntities(
            Record.mapToRecord(entityIds, (entityId) => [
                entityId,
                {
                    verticalAlign: align,
                },
            ])
        );
    }

    setHorizontalTextAlignForSelectedEntities(align: HorizontalAlign) {
        this.setHorizontalTextAlign(this.selectionController.selectedEntityIds, align);
    }

    setHorizontalTextAlign(entityIds: string[], align: HorizontalAlign) {
        this.pageController.updateEntities(
            Record.mapToRecord(entityIds, (entityId) => [
                entityId,
                {
                    horizontalAlign: align,
                },
            ])
        );
    }

    private readonly handleClick = (ev: MYPointerEvent) => {
        if (this.modeController.mode !== TextController.ModeName) return;

        const newEntity = TextEntity.create({ p1: ev.point });

        const session = this.pageController.newSession();
        session.addEntities([newEntity]);
        this.selectionController.setSelection([newEntity.id]);
        this.modeController.setMode(SelectionController.ModeName);
        this.textEditController.startTextEdit(newEntity.id, { session });
    };

    private readonly handleDragStart = (ev: MYDragEvent) => {
        if (this.modeController.mode !== TextController.ModeName) return;

        const newEntity = TextEntity.create({
            p1: ev.point,
            zIndex: (this.pageController.layout.at(-1)?.zIndex ?? -1) + 1,
        });

        const session = this.pageController.newSession();
        session.addEntities([newEntity]);
        this.selectionController.setSelection([newEntity.id]);

        this.transformController.newSession({
            entities: [newEntity],
            transformType: TransformType.RESIZE_BOTTOM_RIGHT,
            autoCommit: false,
            dragSession: ev.session,
            pageEditSession: session,
        });
        ev.session.onEnd.addListener(() => {
            this.modeController.setMode(SelectionController.ModeName);
            this.textEditController.startTextEdit(newEntity.id, { session });
        });
    };
}
