import { Extension } from '../../core/controller/Extension';
import { EditorController } from '../../core/controller/EditorController';
import { dispatcher, Store } from '@drawing/common';
import { ModeChangeEvent } from './ModeChangeEvent';
import { ModeState } from './ModeState';

export class ModeExtension extends Extension {
    readonly store = new Store(ModeState.create());

    initialize(controller: EditorController) {
        super.initialize(controller);
    }

    get mode(): string {
        return this.store.state.mode;
    }

    setMode(mode: string) {
        this.onModeChange.dispatch({ prevMode: this.mode, nextMode: mode });
        this.store.setState({ mode });
    }

    readonly onModeChange = dispatcher<ModeChangeEvent>();
}
