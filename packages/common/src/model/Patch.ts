export type Patch<T> = {
    [K in keyof T]?: null extends T[K]
        ? T[K]
        : T[K] extends string | number | undefined | null | Array<never>
        ? T[K]
        : Patch<T[K]>;
};

export module Patch {
    export function apply<T extends object>(prevState: T, patch: Patch<T>): T {
        const entries = Object.entries(patch) as [keyof T, T[keyof T]][];
        if (entries.length === 0) return prevState;

        const nextState = { ...prevState };

        let dirty = false;
        for (const [key, nextValue] of entries) {
            const prevValue = prevState[key];
            if (nextValue === undefined) {
                delete nextState[key];
                dirty ||= true;
            } else if (nextValue === prevValue) {
                // skip
            } else if (prevValue === undefined || prevValue === null) {
                nextState[key] = nextValue;
                dirty ||= true;
            } else if (typeof nextValue === 'object' && nextValue !== null && !Array.isArray(nextValue)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const nextSubState = Patch.apply(prevValue as any, nextValue);
                dirty ||= nextSubState !== prevValue;
                nextState[key] = dirty ? nextSubState : prevValue;
            } else {
                nextState[key] = nextValue;
                dirty ||= true;
            }
        }

        return dirty ? nextState : prevState;
    }

    export function computeInversePatch<T extends object>(prevState: T, patch: Patch<T>): Patch<T> {
        const entries = Object.entries(patch) as [keyof T, T[keyof T]][];
        if (entries.length === 0) return {};

        const inversePatch: Patch<T> = {};

        for (const [key, nextValue] of entries) {
            const prevValue = prevState[key];
            if (nextValue === undefined) {
                inversePatch[key] = prevState[key];
            } else if (prevValue === undefined || prevValue === null) {
                inversePatch[key] = undefined;
            } else if (typeof nextValue === 'object' && nextValue !== null && !Array.isArray(nextValue)) {
                inversePatch[key] = Patch.computeInversePatch(prevValue, nextValue) as never;
            } else {
                inversePatch[key] = prevState[key];
            }
        }

        return inversePatch;
    }
}
