import { Patch } from '../model/Patch';
import { Dispatcher, dispatcher } from './Dispatcher';

export interface ReadonlyStore<T extends object> {
    readonly state: T;

    onChange: Dispatcher<T>;
}

export class Store<T extends object> implements ReadonlyStore<T> {
    constructor(initialState: T) {
        this._state = initialState;
    }

    private _state: T;

    get state(): T {
        return this._state;
    }

    setState(patch: Patch<T>) {
        const prevState = this.state;
        const nextState = Patch.apply(this.state, patch);
        if (nextState === prevState) return;

        this._state = nextState;
        this.onChange.dispatch(this.state);
    }

    readonly onChange = dispatcher<T>();
}
