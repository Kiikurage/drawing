import { KeyboardEventInfo } from './Editor';
import { dispatcher, Key } from '@drawing/common';

export class KeyboardController {
    private readonly keyPatternListeners = new Map<string, Set<(ev: KeyboardEventInfo) => void>>();

    readonly onKeyDown = dispatcher<KeyboardEventInfo>();
    readonly onKeyUp = dispatcher<KeyboardEventInfo>();

    handleKeyDown(ev: KeyboardEventInfo) {
        this.onKeyDown.dispatch(ev);

        const keys = [ev.key];
        if (ev.shiftKey) keys.push('Shift');
        if (ev.ctrlKey) keys.push('Control');

        const pattern = Key.serialize(keys);

        this.keyPatternListeners.get(pattern)?.forEach((callback) => callback(ev));
    }

    handleKeyUp(ev: KeyboardEventInfo) {
        this.onKeyUp.dispatch(ev);
    }

    addPatternListener(keys: string[], callback: (ev: KeyboardEventInfo) => void): this {
        const pattern = Key.serialize(keys);
        let callbacks = this.keyPatternListeners.get(pattern);
        if (callbacks === undefined) {
            callbacks = new Set();
            this.keyPatternListeners.set(pattern, callbacks);
        }
        callbacks.add(callback);
        return this;
    }

    removePatternListener(keys: string[], callback: (ev: KeyboardEventInfo) => void): this {
        const pattern = Key.serialize(keys);
        const callbacks = this.keyPatternListeners.get(pattern);
        if (callbacks === undefined) return this;

        callbacks.delete(callback);

        if (callbacks.size === 0) {
            this.keyPatternListeners.delete(pattern);
        }

        return this;
    }
}
