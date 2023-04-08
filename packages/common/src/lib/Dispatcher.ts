export interface Dispatcher<T> {
    addListener(callback: (value: T) => void): this;

    addListenerOnce(callback: (value: T) => void): this;

    removeListener(callback: (value: T) => void): this;

    dispatch(value: T): void;
}

export function dispatcher<T>(): Dispatcher<T> {
    return new DispatcherImpl<T>();
}

class DispatcherImpl<T> implements Dispatcher<T> {
    private readonly callbacks = new Set<(ev: T) => void>();

    addListener(callback: (value: T) => void): this {
        this.callbacks.add(callback);
        return this;
    }

    addListenerOnce(callback: (value: T) => void): this {
        const wrapped = (value: T) => {
            this.removeListener(wrapped);
            callback(value);
        };
        this.callbacks.add(wrapped);
        return this;
    }

    removeListener(callback: (value: T) => void): this {
        this.callbacks.delete(callback);
        return this;
    }

    dispatch(value: T): void {
        this.callbacks.forEach((callback) => callback(value));
    }
}
