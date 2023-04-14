import { PolygonEntity, TransformType } from '@drawing/common';
import { MYDragEvent } from '../model/MYDragEvent';
import { GestureRecognizer } from '../gesture/GestureRecognizer';
import { ModeController } from '../mode/ModeController';
import { PageController } from '../PageController/PageController';
import { SelectionController } from '../selection/SelectionController';
import { Command } from '../CommandManager/Command';
import { KeyboardShortcutCommandManager } from '../CommandManager/KeyboardShortcutCommandManager';
import { TransformController } from '../TransformController/TransformController';

export class PolygonController {
    static readonly ModeName = 'polygon';

    constructor(
        private readonly gestureRecognizer: GestureRecognizer,
        private readonly modeController: ModeController,
        private readonly pageController: PageController,
        private readonly selectionController: SelectionController,
        private readonly keyboardShortcutCommandManager: KeyboardShortcutCommandManager,
        private readonly transformController: TransformController
    ) {
        this.gestureRecognizer.onDragStart.addListener(this.handleDragStart);

        const changeModeCommand = Command('changeModeToPolygon', 'Change mode to "Polygon"', () =>
            this.modeController.setMode(PolygonController.ModeName)
        );
        this.keyboardShortcutCommandManager.set(['R'], changeModeCommand);
    }

    private readonly handleDragStart = (ev: MYDragEvent) => {
        if (this.modeController.mode !== PolygonController.ModeName) return;

        const newEntity = PolygonEntity.create({
            p1: ev.point,
            zIndex: (this.pageController.layout.at(-1)?.zIndex ?? -1) + 1,
        });

        const session = this.pageController.newSession();
        session.addEntities([newEntity]);
        this.selectionController.setSelection([newEntity.id]);

        this.transformController.newSession({
            entities: [newEntity],
            transformType: TransformType.RESIZE_BOTTOM_RIGHT,
            dragSession: ev.session,
            pageEditSession: session,
        });
        ev.session.onEnd.addListener(() => {
            session.commit();
            this.modeController.setMode(SelectionController.ModeName);
        });
    };
}
