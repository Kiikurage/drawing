import { Store } from '@drawing/common';
import { Extension } from '../../core/controller/Extension';
import { SnapState } from './SnapState';
import { EditorController } from '../../core/controller/EditorController';

export class SnapExtension extends Extension {
    readonly store = new Store<SnapState>(SnapState.create());

    initialize(controller: EditorController) {
        super.initialize(controller);
        controller.keyboard.onKeyDown.addListener((ev) => {
            if (ev.key === 'Control') this.enable();
        });
        controller.keyboard.onKeyUp.addListener((ev) => {
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
