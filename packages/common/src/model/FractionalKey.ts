import { Bit } from '@drawing/common/src/model/Bit';

export module FractionalKey {
    export const EMPTY = stringify(new Uint8Array([0b10]));
    export const KEY_ZERO = stringify(new Uint8Array([0]));
    export const KEY_ONE = stringify(new Uint8Array([1]));

    export function insertBetween(keyStr1: string, keyStr2: string): string {
        switch (comparator(keyStr1, keyStr2)) {
            case -1:
                break;
            case 0:
                throw new Error(`Invalid augment: key1 = key2 = ${keyStr1}`);
            case 1:
                return insertBetween(keyStr2, keyStr1);
        }
        const key1 = parse(keyStr1);
        const key2 = parse(keyStr2);
        const key = new Uint8Array(Math.max(key1.length, key2.length) + 1);

        const length = Math.max(key1.length, key2.length) * 8;
        for (let i = 0; i < length; i++) {
            const v1 = Bit.get(key1, i);
            const v2 = Bit.get(key2, i);

            if (v1 === v2) {
                Bit.set(key, i, v1);
            } else {
                if (v2 === 0) {
                    throw new Error('Unreachable');
                }

                Bit.set(key, i, v1);
                i++;

                for (; i < key1.length * 8 + 1; i++) {
                    Bit.set(key, i, 1);
                    if (Bit.get(key1, i) === 0) break;
                }
                return stringify(key.slice(0, Math.ceil(i / 8)));
            }
        }

        throw new Error('Unreachable');
    }

    export function insertAfter(keys: string[], reference: string | null): string {
        if (reference === null) return insertBetween(keys.at(-1) ?? KEY_ZERO, KEY_ONE);

        const referenceIndex = keys.findIndex((v) => v === reference);
        if (referenceIndex === -1) return insertAfter(keys, null);

        return insertBetween(reference, keys[referenceIndex + 1] ?? KEY_ONE);
    }

    export function insertBefore(keys: string[], reference: string | null): string {
        if (reference === null) return insertBetween(KEY_ZERO, keys.at(0) ?? KEY_ONE);

        const referenceIndex = keys.findIndex((v) => v === reference);
        if (referenceIndex === -1) return insertBefore(keys, null);

        return insertBetween(reference, keys[referenceIndex - 1] ?? KEY_ZERO);
    }

    // export function insertBefore(keys: string[], reference: string): string {
    //     const sortedKeys = [...keys].sort(comparator);
    // }

    export function comparator(keyStr1: string, keyStr2: string): -1 | 0 | 1 {
        const key1 = parse(keyStr1);
        const key2 = parse(keyStr2);
        const length = Math.max(key1.length, key2.length) * 8;
        for (let i = 0; i < length; i++) {
            const v1 = Bit.get(key1, i) ?? 0;
            const v2 = Bit.get(key2, i) ?? 0;

            if (v1 < v2) {
                return -1;
            } else if (v1 > v2) {
                return 1;
            }
        }
        return 0;
    }

    export function stringify(key: Uint8Array): string {
        return Array.from(key)
            .map((v) => v.toString(16))
            .join('');
    }

    export function parse(key: string): Uint8Array {
        return new Uint8Array(
            key
                .split(/(.{2})/)
                .filter((v) => v !== '')
                .map((v) => parseInt(v, 16))
        );
    }
}
