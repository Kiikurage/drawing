import { Point } from '../Point';
import { getLineIntersectPoint, isLineIntersect } from './lineUtil';

describe('lineUtil', () => {
    const p = (x: number, y: number) => Point.model(x, y);

    describe('isLineIntersect', () => {
        it.each([
            ['直行するパターン', p(0, 0), p(1, 1), p(0, 1), p(1, 0), true],
            ['並行のパターン', p(0, 0), p(1, 0), p(0, 1), p(1, 1), false],
            ['並行ではないが、線が足りないパターン', p(0, 0), p(0, 2), p(1, 1), p(2, 1), false],
            ['先の端で交わるパターン', p(0, 0), p(0, 1), p(0, 1), p(1, 1), false],
        ])('%s', (_, p11, p12, p21, p22, expected) => {
            expect(isLineIntersect(p11, p12, p21, p22)).toEqual(expected);
        });
    });

    describe('getLineIntersectPoint', () => {
        it.each([
            ['直行するパターン', p(0, 0), p(1, 1), p(0, 1), p(1, 0), p(0.5, 0.5)],
            ['並行のパターン', p(0, 0), p(1, 0), p(0, 1), p(1, 1), null],
            ['並行ではないが、線が足りないパターン', p(0, 0), p(0, 2), p(1, 1), p(2, 1), null],
            ['先の端で交わるパターン', p(0, 0), p(0, 1), p(0, 1), p(1, 1), null],
        ])('%s', (_, p11, p12, p21, p22, expected) => {
            expect(getLineIntersectPoint(p11, p12, p21, p22)).toEqual(expected);
        });
    });
});
