import { Key } from '@drawing/common';
import { MYKeyboardEvent } from '../model/MYKeyboardEvent';
import { EditorViewEvents } from '../EditorViewEvents/EditorViewEvents';

export class KeyPatternRecognizer {
    private readonly callbacksByPattern = new Map<string, Set<(ev: MYKeyboardEvent) => void>>();

    constructor(private readonly editorViewEvents: EditorViewEvents) {
        editorViewEvents.onKeyDown.addListener(this.handleKeyDown);
    }

    addListener(keys: string[], callback: (ev: MYKeyboardEvent) => void): this {
        const pattern = Key.serialize(keys);
        let callbacks = this.callbacksByPattern.get(pattern);
        if (callbacks === undefined) {
            callbacks = new Set();
            this.callbacksByPattern.set(pattern, callbacks);
        }
        callbacks.add(callback);
        return this;
    }

    removeListener(keys: string[], callback: (ev: MYKeyboardEvent) => void): this {
        const pattern = Key.serialize(keys);
        const callbacks = this.callbacksByPattern.get(pattern);
        if (callbacks === undefined) return this;

        callbacks.delete(callback);

        if (callbacks.size === 0) {
            this.callbacksByPattern.delete(pattern);
        }

        return this;
    }

    private readonly handleKeyDown = (ev: MYKeyboardEvent) => {
        const keys = [ev.key];
        if (ev.shiftKey) keys.push('Shift');
        if (ev.ctrlKey) keys.push('Control');

        const pattern = Key.serialize(keys);

        this.callbacksByPattern.get(pattern)?.forEach((callback) => callback(ev));
    };

    private static serializeKeyPattern(keys: string[]): string {
        return [...new Set(keys)]
            .map((k) => k.toLowerCase())
            .sort()
            .join('+');
    }
}
