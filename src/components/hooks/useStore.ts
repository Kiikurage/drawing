import { useEffect, useState } from 'react';
import { Store } from '../../lib/Store';

export function useStore<T>(store: Store<T>): T {
    const [cachedState, setCachedState] = useState<T>(store.state);

    useEffect(() => {
        store.addListener(setCachedState);
        return () => store.removeListener(setCachedState);
    }, [store]);

    return cachedState;
}
