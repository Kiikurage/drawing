export type Patch<T> = {
    [K in keyof T]?: null extends T[K] ? T[K] : Patch<T[K]> | T[K];
};

export module Patch {
    export function apply<T>(prevState: T, patch: Patch<T>): T {
        const entries = Object.entries(patch) as [keyof T, T[keyof T]][];
        if (entries.length === 0) return prevState;

        const nextState = { ...prevState };

        for (const [key, value] of entries) {
            if (prevState[key] === null) {
                nextState[key] = value;
            } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                nextState[key] = Patch.apply(prevState[key], value);
            } else {
                nextState[key] = value;
            }
        }

        return nextState;
    }
}
