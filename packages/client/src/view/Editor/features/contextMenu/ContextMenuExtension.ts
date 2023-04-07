import { DisplayCordPoint, Store } from '@drawing/common';
import { IEditorController, MouseEventButton, MouseEventInfo } from '../../core/controller/IEditorController';
import { Extension } from '../../core/controller/Extension';
import { ContextMenuState } from './ContextMenuState';
import { ContextMenuSectionEntry } from './ContextMenuSectionEntry';
import { ModeExtension } from '../mode/ModeExtension';
import { ModeChangeEvent } from '../mode/ModeChangeEvent';
import { SelectExtension } from '../select/SelectExtension';

export class ContextMenuExtension extends Extension {
    readonly sections: ContextMenuSectionEntry[] = [];
    readonly store = new Store<ContextMenuState>(ContextMenuState.create());
    private selectExtension: SelectExtension = null as never;

    onRegister(controller: IEditorController) {
        super.onRegister(controller);

        this.selectExtension = controller.requireExtension(SelectExtension);

        const modeExtension = controller.requireExtension(ModeExtension);
        modeExtension.onModeChange.addListener(this.onModeChange);
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

    private readonly onModeChange = (ev: ModeChangeEvent) => {
        this.updateModeSpecificListener(ev.nextMode);
        if (ev.nextMode !== SelectExtension.MODE_KEY) {
            this.close();
        }
    };

    private updateModeSpecificListener(mode: string) {
        if (mode === SelectExtension.MODE_KEY) {
            this.controller.onMouseDown.addListener(this.onMouseDown);
        } else {
            this.controller.onMouseDown.removeListener(this.onMouseDown);
        }
    }

    private readonly onMouseDown = (ev: MouseEventInfo) => {
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
