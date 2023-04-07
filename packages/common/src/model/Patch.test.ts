import { Patch } from './Patch';

describe('Patch', () => {
    it('すべてのフィールドをパッチ', () => {
        const prevState = { x: 1, y: 2 };
        const patch = { x: 3, y: 4 };
        const nextState = Patch.apply(prevState, patch);

        expect(nextState).toEqual({ x: 3, y: 4 });
        expect(prevState).toEqual({ x: 1, y: 2 });

        const inversePatch = Patch.computeInversePatch(prevState, patch);
        expect(Patch.apply(nextState, inversePatch)).toEqual(prevState);
    });

    it('多重構造を含むすべてのフィールドをパッチ', () => {
        const prevState = { x: 1, y: { z: 2, w: 3 } };
        const patch = { x: 4, y: { z: 5, w: 6 } };
        const nextState = Patch.apply(prevState, patch);

        expect(nextState).toEqual({ x: 4, y: { z: 5, w: 6 } });
        expect(prevState).toEqual({ x: 1, y: { z: 2, w: 3 } });

        const inversePatch = Patch.computeInversePatch(prevState, patch);
        expect(Patch.apply(nextState, inversePatch)).toEqual(prevState);
    });

    it('一部のフィールドをパッチ', () => {
        const prevState = { x: 1, y: 2 };
        const patch = { x: 3 };
        const nextState = Patch.apply(prevState, patch);

        expect(nextState).toEqual({ x: 3, y: 2 });
        expect(prevState).toEqual({ x: 1, y: 2 });

        const inversePatch = Patch.computeInversePatch(prevState, patch);
        expect(Patch.apply(nextState, inversePatch)).toEqual(prevState);
    });

    it('ネストしたオブジェクトの一部をパッチ', () => {
        const prevState = { x: 1, y: { z: 2, w: 3 } };
        const patch = { y: { w: 6 } };
        const nextState = Patch.apply(prevState, patch);

        expect(nextState).toEqual({ x: 1, y: { z: 2, w: 6 } });
        expect(prevState).toEqual({ x: 1, y: { z: 2, w: 3 } });

        const inversePatch = Patch.computeInversePatch(prevState, patch);
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

        const inversePatch = Patch.computeInversePatch(prevState, patch);
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

        const inversePatch = Patch.computeInversePatch(prevState, patch);
        expect(Patch.apply(nextState, inversePatch)).toEqual(prevState);
    });

    it('配列に対するパッチ', () => {
        const prevState = { x: [1, 2, 3] };
        const patch = { x: [4, 5] };
        const nextState = Patch.apply(prevState, patch);

        expect(nextState).toEqual({ x: [4, 5] });
        expect(prevState).toEqual({ x: [1, 2, 3] });

        const inversePatch = Patch.computeInversePatch(prevState, patch);
        expect(Patch.apply(nextState, inversePatch)).toEqual(prevState);
    });

    it('パッチ内容がundefinedなら代わりにそのフィールドを消す', () => {
        const prevState = { x: 1, y: 2 };
        const patch = { x: 3, y: undefined };
        const nextState = Patch.apply(prevState, patch);

        expect(nextState).toEqual({ x: 3 });
        expect(prevState).toEqual({ x: 1, y: 2 });

        const inversePatch = Patch.computeInversePatch(prevState, patch);
        expect(Patch.apply(nextState, inversePatch)).toEqual(prevState);
    });

    it('パッチ内容が同じならもとのオブジェクトを返す', () => {
        const prevState = { x: 1, y: { z: 2, w: 3 } };
        const patch = { x: 1, y: { z: 2, w: 3 } };
        const nextState = Patch.apply(prevState, patch);

        expect(nextState).toBe(prevState);

        const inversePatch = Patch.computeInversePatch(prevState, patch);
        expect(inversePatch).toEqual({ x: 1, y: { z: 2, w: 3 } });
    });
});
