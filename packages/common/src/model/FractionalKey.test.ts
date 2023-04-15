import { FractionalKey } from './FractionalKey';

describe('FractionalKey', () => {
    const key = (...num: number[]) => FractionalKey.stringify(new Uint8Array(num));
    const str = (key: string) =>
        Array.from(FractionalKey.parse(key))
            .map((v) => v.toString(2))
            .join('');

    it.each([
        [key(0b00), key(0b01), key(0b10)],
        [key(0b01), key(0b00), key(0b10)],
        [key(0b10), key(0b100), key(0b1100)],
        [key(0b1), key(0b10000), key(0b10)],
        [key(0b1), key(0b11110), key(0b111110)],
    ])('insertBetween(%p, %p) => %p', (key1, key2, expected) => {
        const newKey = FractionalKey.insertBetween(key1, key2);

        expect(newKey).toEqual(expected);
    });

    describe('insertAfter', () => {
        it('new list', () => {
            expect(FractionalKey.insertAfter([], null)).toBe(key(0b10));
        });

        it('some list', () => {
            const newKey = FractionalKey.insertAfter([key(0b0100), key(0b0010), key(0b0110)], key(0b010));
            expect(newKey).toBe(key(0b1010));
        });
    });
});
