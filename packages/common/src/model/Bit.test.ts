import { Bit } from './Bit';

describe('Bit', () => {
    describe('get from buffer', () => {
        it.each([
            [new Uint8Array([0b01]), 0, 1],
            [new Uint8Array([0b01]), 1, 0],
            [new Uint8Array([0b00000000, 0b00001000]), 11, 1],
            [new Uint8Array([0b11111111, 0b11110111]), 11, 0],
        ])(`get(%p, %d) == %d`, (buffer, at, expected) => {
            expect(Bit.get(buffer, at)).toBe(expected);
        });
    });

    describe('get from uint', () => {
        it.each([
            [0b00001000, 3, 1],
            [0b11110111, 3, 0],
        ])(`get(%p, %d) == %d`, (buffer, at, expected) => {
            expect(Bit.get(buffer, at)).toBe(expected);
        });
    });

    describe('set to buffer', () => {
        it.each([
            [new Uint8Array([0b11111111]), 3, 0, new Uint8Array([0b11110111])],
            [new Uint8Array([0b00000000]), 3, 0, new Uint8Array([0b00000000])],
            [new Uint8Array([0b11111111]), 3, 1, new Uint8Array([0b11111111])],
            [new Uint8Array([0b00000000]), 3, 1, new Uint8Array([0b00001000])],
            [new Uint8Array([0b11111111, 0b11111111]), 11, 0, new Uint8Array([0b11111111, 0b11110111])],
            [new Uint8Array([0b00000000, 0b00000000]), 11, 0, new Uint8Array([0b00000000, 0b00000000])],
            [new Uint8Array([0b11111111, 0b11111111]), 11, 1, new Uint8Array([0b11111111, 0b11111111])],
            [new Uint8Array([0b00000000, 0b00000000]), 11, 1, new Uint8Array([0b00000000, 0b00001000])],
        ])(`set(%p, %d, %d) == %p`, (buffer, at, newValue: 0 | 1, expected) => {
            buffer = Bit.set(buffer, at, newValue);
            expect(buffer).toEqual(expected);
        });
    });

    describe('set to uint', () => {
        it.each([
            [0b11111111, 3, 0, 0b11110111],
            [0b00000000, 3, 0, 0b00000000],
            [0b11111111, 3, 1, 0b11111111],
            [0b00000000, 3, 1, 0b00001000],
        ])(`set(%p, %d, %d) == %p`, (buffer, at, newValue: 0 | 1, expected) => {
            buffer = Bit.set(buffer, at, newValue);
            expect(buffer).toEqual(expected);
        });
    });
});
