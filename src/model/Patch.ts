export type Patch<T> = {
    [K in keyof T]?: null extends T[K] ? T[K] : Patch<T[K]> | T[K];
};

export module Patch {
    export function apply<T extends object>(prevState: T, patch: Patch<T>): T {
        const entries = Object.entries(patch) as [keyof T, T[keyof T]][];
        if (entries.length === 0) return prevState;

        const nextState = { ...prevState };

        for (const [key, value] of entries) {
            if (value === undefined) {
                delete nextState[key];
            } else if (prevState[key] === undefined || prevState[key] === null) {
                nextState[key] = value;
            } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                nextState[key] = Patch.apply(prevState[key] as any, value);
            } else {
                nextState[key] = value;
            }
        }

        return nextState;
    }
}
