import { KeyboardEventInfo } from './IEditorController';
import { Key } from '@drawing/common';

export class ShortcutController {
    private readonly keyDownListeners = new Set<(ev: KeyboardEventInfo) => void>();
    private readonly keyPatternListeners = new Map<string, Set<(ev: KeyboardEventInfo) => void>>();
    private readonly keyUpListeners = new Set<(ev: KeyboardEventInfo) => void>();

    onKeyDown(ev: KeyboardEventInfo) {
        this.keyDownListeners.forEach((callback) => callback(ev));

        const keys = [ev.key];
        if (ev.shiftKey) keys.push('Shift');
        if (ev.ctrlKey) keys.push('Control');

        const pattern = Key.serialize(keys);
        this.keyPatternListeners.get(pattern)?.forEach((callback) => callback(ev));
    }

    onKeyUp(ev: KeyboardEventInfo) {
        this.keyUpListeners.forEach((callback) => callback(ev));
    }

    addKeyDownListener(callback: (ev: KeyboardEventInfo) => void): this {
        this.keyDownListeners.add(callback);
        return this;
    }

    removeKeyDownListener(callback: (ev: KeyboardEventInfo) => void): this {
        this.keyDownListeners.delete(callback);
        return this;
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

    addKeyUpListener(callback: (ev: KeyboardEventInfo) => void): this {
        this.keyUpListeners.add(callback);
        return this;
    }

    removeKeyUpListener(callback: (ev: KeyboardEventInfo) => void): this {
        this.keyUpListeners.delete(callback);
        return this;
    }
}
