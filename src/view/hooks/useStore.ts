import { useEffect, useState } from 'react';
import { ReadonlyStore } from '../../lib/Store';

export function useStore<T extends object>(store: ReadonlyStore<T>): T {
    const [cachedState, setCachedState] = useState<T>(store.state);

    useEffect(() => {
        store.addListener(setCachedState);
        return () => store.removeListener(setCachedState);
    }, [store]);

    return cachedState;
}
