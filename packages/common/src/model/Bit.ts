export module Bit {
    export function get(source: Uint8Array, at: number): 0 | 1;
    export function get(source: number, at: number): 0 | 1;
    export function get(source: Uint8Array | number, at: number): 0 | 1 {
        if (typeof source === 'number') {
            return getFromUint8(source, at);
        } else {
            return getFromBuffer(source, at);
        }
    }

    function getFromUint8(uint: number, offset: number): 0 | 1 {
        return ((uint >> offset) & 1) as 0 | 1;
    }

    function getFromBuffer(buffer: Uint8Array, at: number): 0 | 1 {
        const byte = Math.floor(at / 8);
        const offset = at % 8;

        return getFromUint8(buffer[byte], offset);
    }

    export function set(dest: Uint8Array, at: number, value: 0 | 1): Uint8Array;
    export function set(dest: number, at: number, value: 0 | 1): number;
    export function set(dest: Uint8Array | number, at: number, value: 0 | 1): Uint8Array | number {
        if (typeof dest === 'number') {
            return setToUint8(dest, at, value);
        } else {
            return setToBuffer(dest, at, value);
        }
    }

    function setToUint8(uint: number, offset: number, value: 0 | 1) {
        if (value === 1) {
            return uint | (1 << offset);
        } else {
            return uint & ~(1 << offset);
        }
    }

    function setToBuffer(buffer: Uint8Array, at: number, value: 0 | 1) {
        const byte = Math.floor(at / 8);
        const offset = at % 8;

        buffer[byte] = setToUint8(buffer[byte], offset, value);

        return buffer;
    }
}
