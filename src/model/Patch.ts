export type Patch<T> = {
    [K in keyof T]?: null extends T[K] ? T[K] : Patch<T[K]> | T[K];
};

export module Patch {
    export function apply<T extends object>(prevState: T, patch: Patch<T>): T {
        const entries = Object.entries(patch) as [keyof T, T[keyof T]][];
        if (entries.length === 0) return prevState;

        const nextState = { ...prevState };

        for (const [key, nextValue] of entries) {
            const prevValue = prevState[key];
            if (nextValue === undefined) {
                delete nextState[key];
            } else if (prevValue === undefined || prevValue === null) {
                nextState[key] = nextValue;
            } else if (typeof nextValue === 'object' && nextValue !== null && !Array.isArray(nextValue)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                nextState[key] = Patch.apply(prevValue as any, nextValue);
            } else {
                nextState[key] = nextValue;
            }
        }

        return nextState;
    }
}
