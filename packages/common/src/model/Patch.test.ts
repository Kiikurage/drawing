import { Patch } from './Patch';

describe('Patch', () => {
    describe('apply', () => {
        it('すべてのフィールドをパッチ', () => {
            const prevState = { x: 1, y: 2 };
            const patch = { x: 3, y: 4 };
            const nextState = Patch.apply(prevState, patch);

            expect(nextState).toEqual({ x: 3, y: 4 });
            expect(prevState).toEqual({ x: 1, y: 2 });

            const inversePatch = Patch.computeInverse(prevState, patch);
            expect(Patch.apply(nextState, inversePatch)).toEqual(prevState);
        });

        it('多重構造を含むすべてのフィールドをパッチ', () => {
            const prevState = { x: 1, y: { z: 2, w: 3 } };
            const patch = { x: 4, y: { z: 5, w: 6 } };
            const nextState = Patch.apply(prevState, patch);

            expect(nextState).toEqual({ x: 4, y: { z: 5, w: 6 } });
            expect(prevState).toEqual({ x: 1, y: { z: 2, w: 3 } });

            const inversePatch = Patch.computeInverse(prevState, patch);
            expect(Patch.apply(nextState, inversePatch)).toEqual(prevState);
        });

        it('一部のフィールドをパッチ', () => {
            const prevState = { x: 1, y: 2 };
            const patch = { x: 3 };
            const nextState = Patch.apply(prevState, patch);

            expect(nextState).toEqual({ x: 3, y: 2 });
            expect(prevState).toEqual({ x: 1, y: 2 });

            const inversePatch = Patch.computeInverse(prevState, patch);
            expect(Patch.apply(nextState, inversePatch)).toEqual(prevState);
        });

        it('ネストしたオブジェクトの一部をパッチ', () => {
            const prevState = { x: 1, y: { z: 2, w: 3 } };
            const patch = { y: { w: 6 } };
            const nextState = Patch.apply(prevState, patch);

            expect(nextState).toEqual({ x: 1, y: { z: 2, w: 6 } });
            expect(prevState).toEqual({ x: 1, y: { z: 2, w: 3 } });

            const inversePatch = Patch.computeInverse(prevState, patch);
            expect(Patch.apply(nextState, inversePatch)).toEqual(prevState);
        });

        it('nullを含むパッチを適用', () => {
            interface State {
                x: number;
                y: { z: number; w: number } | null;
            }

            const prevState = { x: 1, y: { z: 2, w: 3 } };
            const patch: Patch<State> = { y: null };
            const nextState = Patch.apply(prevState, patch);

            expect(nextState).toEqual({ x: 1, y: null });
            expect(prevState).toEqual({ x: 1, y: { z: 2, w: 3 } });

            const inversePatch = Patch.computeInverse(prevState, patch);
            expect(Patch.apply(nextState, inversePatch)).toEqual(prevState);
        });

        it('nullを含む状態にパッチを適用', () => {
            interface State {
                x:
                    | {
                          y: { z: number };
                      }
                    | undefined;
            }

            const prevState: State = { x: undefined };
            const patch: Patch<State> = { x: { y: { z: 1 } } };
            const nextState = Patch.apply(prevState, patch);

            expect(nextState).toEqual({ x: { y: { z: 1 } } });
            expect(prevState).toEqual({ x: undefined });

            const inversePatch = Patch.computeInverse(prevState, patch);
            expect(Patch.apply(nextState, inversePatch)).toEqual(prevState);
        });

        it('配列に対するパッチ', () => {
            const prevState = { x: [1, 2, 3] };
            const patch = { x: [4, 5] };
            const nextState = Patch.apply(prevState, patch);

            expect(nextState).toEqual({ x: [4, 5] });
            expect(prevState).toEqual({ x: [1, 2, 3] });

            const inversePatch = Patch.computeInverse(prevState, patch);
            expect(Patch.apply(nextState, inversePatch)).toEqual(prevState);
        });

        it('パッチ内容がundefinedなら代わりにそのフィールドを消す', () => {
            const prevState = { x: 1, y: 2 };
            const patch = { x: 3, y: undefined };
            const nextState = Patch.apply(prevState, patch);

            expect(nextState).toEqual({ x: 3 });
            expect(prevState).toEqual({ x: 1, y: 2 });

            const inversePatch = Patch.computeInverse(prevState, patch);
            expect(Patch.apply(nextState, inversePatch)).toEqual(prevState);
        });

        it('パッチ内容が同じならもとのオブジェクトを返す', () => {
            const prevState = { x: 1, y: { z: 2, w: 3 } };
            const patch = { x: 1, y: { z: 2, w: 3 } };
            const nextState = Patch.apply(prevState, patch);

            expect(nextState).toBe(prevState);

            const inversePatch = Patch.computeInverse(prevState, patch);
            expect(inversePatch).toEqual({ x: 1, y: { z: 2, w: 3 } });
        });
    });

    describe('merge', () => {
        it('プリミティブのマージ', () => {
            expect(
                Patch.merge<{
                    x: number;
                    y: number;
                }>({ x: 1 }, { y: 2 })
            ).toEqual({ x: 1, y: 2 });
        });

        it('ネストしたパッチのマージ', () => {
            expect(
                Patch.merge<{
                    x: {
                        y: number;
                        z: number;
                    };
                }>({ x: { y: 1 } }, { x: { z: 2 } })
            ).toEqual({ x: { y: 1, z: 2 } });
        });

        it('フィールド名が衝突していたらマージ不可', () => {
            expect(() => {
                Patch.merge<{ x: number }>({ x: 1 }, { x: 2 });
            }).toThrowError();
        });

        it('フィールド名が衝突していても、値が一緒ならマージ可', () => {
            expect(Patch.merge<{ x: number; y: number; z: number }>({ x: 1, y: 2 }, { x: 1, z: 3 })).toEqual({
                x: 1,
                y: 2,
                z: 3,
            });
        });

        it('Array同士はマージ不可', () => {
            expect(() => {
                Patch.merge<{ x: number[] }>({ x: [1, 2] }, { x: [3, 4] });
            }).toThrowError();
        });
    });

    describe('inversePatch', () => {
        it('浅いフィールドのパッチ', () => {
            expect(
                Patch.computeInverse(
                    {
                        x: 1,
                        y: 2,
                    },
                    { y: 3 }
                )
            ).toEqual({ y: 2 });
        });

        it('深いフィールドのパッチ', () => {
            expect(
                Patch.computeInverse(
                    {
                        x: 1,
                        y: { z: 2, w: 3 },
                    },
                    { x: 2, y: { z: 4 } }
                )
            ).toEqual({ x: 1, y: { z: 2 } });
        });

        it('フィールドの追加', () => {
            expect(
                Patch.computeInverse(
                    {
                        x: 1,
                    } as Record<string, number>,
                    { y: 2 }
                )
            ).toEqual({ y: undefined });
        });

        it('フィールドの削除', () => {
            expect(
                Patch.computeInverse(
                    {
                        x: 1,
                        y: 2,
                    },
                    { y: undefined }
                )
            ).toEqual({ y: 2 });
        });
    });
});
