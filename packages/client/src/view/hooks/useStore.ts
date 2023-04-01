import { useEffect, useState } from 'react';
import { deepEqual, ReadonlyStore } from '@drawing/common';

export function useStore<T extends object>(store: ReadonlyStore<T>): T {
    const [cachedState, setCachedState] = useState<T>(store.state);

    useEffect(() => {
        store.addListener(setCachedState);
        return () => store.removeListener(setCachedState);
    }, [store]);

    return cachedState;
}

export function useSlice<T extends object, U extends object>(store: ReadonlyStore<T>, fn: (state: T) => U): U {
    const [cachedState, setCachedState] = useState<U>(() => fn(store.state));

    useEffect(() => {
        const callback = (state: T) => {
            setCachedState((prevSlice) => {
                const nextSlice = fn(state);
                if (deepEqual(prevSlice, nextSlice)) {
                    return prevSlice;
                } else {
                    return nextSlice;
                }
            });
        };

        store.addListener(callback);
        return () => store.removeListener(callback);
    }, [fn, store]);

    return cachedState;
}
