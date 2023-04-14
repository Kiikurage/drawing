import { useEffect, useState } from 'react';
import { ReadonlyStore } from '@drawing/common/src/lib/Store';
import { deepEqual } from '@drawing/common/src/lib/deepEqual';

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

        store.onChange.addListener(callback);
        return () => {
            store.onChange.removeListener(callback);
        };
    }, [fn, store]);

    return cachedState;
}
