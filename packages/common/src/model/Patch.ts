export type Patch<T> = {
    [K in keyof T]?: T[K] extends string | number | undefined | null | Array<never> ? T[K] : Patch<T[K]>;
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

    export function merge<T extends object>(patch1: Patch<T>, patch2: Patch<T>): Patch<T> {
        const entries = Object.entries(patch2) as [keyof T, T[keyof T]][];
        if (entries.length === 0) return patch1;

        const patch = { ...patch1 };

        for (const [key, value2] of entries) {
            const value1 = patch1[key];
            if (value1 === value2) {
                patch[key] = value2;
                continue;
            }

            if (!(key in patch1)) {
                patch[key] = value2;
                continue;
            }

            if (
                value1 !== undefined &&
                value1 !== null &&
                value2 !== undefined &&
                value2 !== null &&
                typeof value1 === 'object' &&
                typeof value2 === 'object' &&
                !Array.isArray(value1) &&
                !Array.isArray(value2)
            ) {
                patch[key] = merge(value1, value2) as any;
                continue;
            }

            throw new Error('Cannot merge patches');
        }

        return patch;
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
