import { Bit } from '@drawing/common/src/model/Bit';

export module Base64 {
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const INVERSE_MAP = Object.fromEntries(Array.from(CHARS).map((char, i) => [char, i]));

    function uint6ToChar(uint6: number) {
        return CHARS[uint6];
    }

    function charToUint6(char: string) {
        return INVERSE_MAP[char];
    }

    export function encode(buffer: Uint8Array) {
        if (buffer.length === 0) return '';

        const output = new Uint8Array(Math.ceil((buffer.length * 8) / 6));

        for (let bit = 0; bit < buffer.length * 8; bit++) {
            const bitInChar = 5 - (bit % 6);
            const char = Math.floor(bit / 6);
            const bitInByte = 7 - (bit % 8);
            const byte = Math.floor(bit / 8);
            output[char] = Bit.set(output[char], bitInChar, Bit.get(buffer[byte], bitInByte));
        }

        return [...output].map((uint8) => uint6ToChar(uint8)).join('');
    }

    export function decode(str: string): Uint8Array {
        if (str.length === 0) return new Uint8Array();

        let bitLength = str.length * 6;

        const lastChar = charToUint6(str.charAt(str.length - 1));
        for (let i = 0; i < 6; i++) {
            if (Bit.get(lastChar, i) === 1) break;
            bitLength -= 1;
        }

        const output = new Uint8Array(Math.ceil(bitLength / 8));

        for (let bit = 0; bit < output.length * 8; bit++) {
            const char = Math.floor(bit / 6);
            if (char >= str.length) break;

            const bitInChar = 5 - (bit % 6);
            const bitInByte = 7 - (bit % 8);
            const byte = Math.floor(bit / 8);

            output[byte] = Bit.set(output[byte], bitInByte, Bit.get(charToUint6(str.charAt(char)), bitInChar));
        }

        return output;
    }
}
