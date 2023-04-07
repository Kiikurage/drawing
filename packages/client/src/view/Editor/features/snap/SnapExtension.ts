import { Store } from '@drawing/common';
import { Extension } from '../../core/controller/Extension';
import { SnapState } from './SnapState';
import { IEditorController } from '../../core/controller/IEditorController';

export class SnapExtension extends Extension {
    readonly store = new Store<SnapState>(SnapState.create());

    onRegister(controller: IEditorController) {
        super.onRegister(controller);
        controller.shortcuts
            .addKeyDownListener((ev) => {
                if (ev.key === 'Control') this.enable();
            })
            .addKeyUpListener((ev) => {
                if (ev.key === 'Control') this.disable();
            });
    }

    enable() {
        this.store.setState({ enabled: true });
    }

    disable() {
        this.store.setState({ enabled: false });
    }

    showGuide() {
        this.store.setState({ visible: true });
    }

    hideGuide() {
        this.store.setState({ visible: false });
    }
}
