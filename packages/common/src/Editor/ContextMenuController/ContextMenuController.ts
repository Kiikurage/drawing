import { ContextMenuState } from './ContextMenuState';
import { ContextMenuSectionEntry } from './ContextMenuSectionEntry';
import { ModeChangeEvent } from '../model/ModeChangeEvent';
import { MouseEventButton } from '../model/MouseEventButton';
import { MYPointerEvent } from '../model/MYPointerEvent';
import { ModeController } from '../mode/ModeController';
import { EditorViewEvents } from '../EditorViewEvents/EditorViewEvents';
import { SelectionController } from '../selection/SelectionController';
import { GestureRecognizer } from '@drawing/common/src/Editor/GestureRecognizer/GestureRecognizer';
import { Store } from '@drawing/common/src/lib/Store';
import { DisplayCordPoint } from '@drawing/common/src/model/Point';

export class ContextMenuController {
    readonly sections: ContextMenuSectionEntry[] = [];
    readonly store = new Store<ContextMenuState>(ContextMenuState.create());

    constructor(
        private readonly gestureRecognizer: GestureRecognizer,
        private readonly editorViewEvents: EditorViewEvents,
        private readonly modeController: ModeController,
        private readonly selectionController: SelectionController
    ) {
        this.gestureRecognizer.onPointerHold.addListener(this.handlePointerHold);
        this.modeController.onModeChange.addListener(this.handleModeChange);
        this.editorViewEvents.onPointerDown.addListener(this.handlePointerDown);
    }

    addSection(section: ContextMenuSectionEntry) {
        this.sections.push(section);
    }

    getActiveSections(): ContextMenuSectionEntry[] {
        return this.sections.filter((section) => section.activateIf?.() ?? true);
    }

    open(pointInDisplay: DisplayCordPoint) {
        this.store.setState({ open: true, point: pointInDisplay });
    }

    close() {
        this.store.setState({ open: false });
    }

    private readonly handleModeChange = (ev: ModeChangeEvent) => {
        if (ev.nextMode !== SelectionController.ModeName) {
            this.close();
        }
    };

    private readonly handlePointerDown = (ev: MYPointerEvent) => {
        if (this.modeController.mode !== SelectionController.ModeName) return;

        if (ev.button !== MouseEventButton.WHEEL) {
            this.close();
        }
        if (ev.button === MouseEventButton.SECONDARY) {
            switch (ev.target.type) {
                case 'entity': {
                    this.selectionController.setSelection([ev.target.entityId]);
                    this.open(ev.pointInDisplay);
                    return;
                }

                case 'transformHandle': {
                    this.open(ev.pointInDisplay);
                    return;
                }
            }
        }
    };

    private readonly handlePointerHold = (ev: MYPointerEvent) => {
        if (this.modeController.mode !== SelectionController.ModeName) return;

        switch (ev.target.type) {
            case 'entity': {
                this.selectionController.setSelection([ev.target.entityId]);
                this.open(ev.pointInDisplay);
                return;
            }

            case 'transformHandle': {
                this.open(ev.pointInDisplay);
                return;
            }
        }
    };
}
