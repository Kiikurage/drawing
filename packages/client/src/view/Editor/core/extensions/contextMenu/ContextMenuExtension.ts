import { Editor, MouseEventButton, MouseEventInfo } from '../../controller/Editor';
import { Extension } from '../../controller/Extension';
import { ContextMenuState } from './ContextMenuState';
import { ContextMenuSectionEntry } from './ContextMenuSectionEntry';
import { ModeExtension } from '../../../extensions/mode/ModeExtension';
import { ModeChangeEvent } from '../../../extensions/mode/ModeChangeEvent';
import { SelectExtension } from '../select/SelectExtension';
import { DisplayCordPoint, Store } from '@drawing/common';

export class ContextMenuExtension extends Extension {
    readonly sections: ContextMenuSectionEntry[] = [];
    readonly store = new Store<ContextMenuState>(ContextMenuState.create());
    private selectExtension: SelectExtension = null as never;

    initialize(controller: Editor) {
        super.initialize(controller);

        this.selectExtension = controller.requireExtension(SelectExtension);

        const modeExtension = controller.requireExtension(ModeExtension);
        modeExtension.onModeChange.addListener(this.handleModeChange);
        this.updateModeSpecificListener(modeExtension.mode);
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
        this.updateModeSpecificListener(ev.nextMode);
        if (ev.nextMode !== SelectExtension.MODE_KEY) {
            this.close();
        }
    };

    private updateModeSpecificListener(mode: string) {
        if (mode === SelectExtension.MODE_KEY) {
            this.controller.onMouseDown.addListener(this.handleMouseDown);
        } else {
            this.controller.onMouseDown.removeListener(this.handleMouseDown);
        }
    }

    private readonly handleMouseDown = (ev: MouseEventInfo) => {
        if (ev.button !== MouseEventButton.WHEEL) {
            this.close();
        }
        if (ev.button === MouseEventButton.SECONDARY) {
            switch (this.controller.state.hover.type) {
                case 'entity': {
                    this.selectExtension.setSelection([this.controller.state.hover.entityId]);
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
}
