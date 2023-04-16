import { ModeState } from './ModeState';
import { ModeChangeEvent } from '../model/ModeChangeEvent';
import { Store } from '@drawing/common/src/lib/Store';
import { dispatcher } from '@drawing/common/src/lib/Dispatcher';

export class ModeController {
    readonly store = new Store<ModeState>(ModeState.create());

    get mode(): string {
        return this.store.state.mode;
    }

    setMode(mode: string) {
        if (mode === this.mode) return;

        this.onModeChange.dispatch({
            prevMode: this.store.state.mode,
            nextMode: mode,
        });
        this.store.setState({ mode });
    }

    readonly onModeChange = dispatcher<ModeChangeEvent>();
}
