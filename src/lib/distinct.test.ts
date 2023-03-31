import { distinct } from './distinct';

describe('distinct', () => {
    it.each([
        {
            inputs: [1, 1, 2, 2, 3, 3],
            expected: [1, 2, 3],
        },
        {
            inputs: [1, 1, 1, 1],
            expected: [1],
        },
        {
            inputs: [1, 2, 3],
            expected: [1, 2, 3],
        },
    ])('distinct %#', ({ inputs, expected }) => {
        expect(inputs.reduce(distinct(), [])).toEqual(expected);
    });
});
