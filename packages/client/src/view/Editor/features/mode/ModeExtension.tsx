import { Extension } from '../../core/controller/Extension';
import { IEditorController } from '../../core/controller/IEditorController';
import { EventDispatcher, Store } from '@drawing/common';
import { ModeChangeEvent } from './ModeChangeEvent';
import { ModeState } from './ModeState';

export class ModeExtension extends Extension {
    readonly store = new Store(ModeState.create());

    onRegister(controller: IEditorController) {
        super.onRegister(controller);
    }

    get mode(): string {
        return this.store.state.mode;
    }

    setMode(mode: string) {
        this.onModeChange(mode);
        this.store.setState({ mode });
    }

    readonly onModeChange = EventDispatcher((nextMode: string) => {
        return { prevMode: this.mode, nextMode } satisfies ModeChangeEvent;
    });
}
