export interface EventDispatcher<T, V extends unknown[]> {
    (...args: V): void;

    addListener(callback: (ev: T) => void): void;

    addListenerOnce(callback: (ev: T) => void): void;

    removeListener(callback: (ev: T) => void): void;
}

export function EventDispatcher<T, V extends unknown[]>(mapper: (...args: V) => T): EventDispatcher<T, V> {
    const callbacks = new Set<(arg: T) => void>();

    const proxy = ((...args: V) => {
        const ev = mapper(...args);
        callbacks.forEach((callback) => callback(ev));
    }) as EventDispatcher<T, V>;

    proxy.addListener = (callback: (arg: T) => void) => callbacks.add(callback);

    proxy.addListenerOnce = (callback: (arg: T) => void) => {
        const wrapper = (arg: T) => {
            callback(arg);
            proxy.removeListener(wrapper);
        };
        callbacks.add(wrapper);
    };

    proxy.removeListener = (callback: (arg: T) => void) => callbacks.delete(callback);

    return proxy;
}
