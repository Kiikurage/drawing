import { Patch } from '../model/Patch';

export class Store<T extends object> {
    private listeners = new Set<(newState: T) => void>();

    constructor(initialState: T) {
        this._state = initialState;
    }

    private _state: T;

    get state(): T {
        return this._state;
    }

    setState(patch: Patch<T>) {
        this._state = Patch.apply(this.state, patch);
        this.listeners.forEach((listener) => listener(this.state));
    }

    addListener(listener: (newState: T) => void) {
        this.listeners.add(listener);
    }

    removeListener(listener: (newState: T) => void) {
        this.listeners.delete(listener);
    }
}
