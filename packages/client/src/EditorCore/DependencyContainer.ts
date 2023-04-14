type Constructor<T> = { new (...args: never[]): T; name: string };

export class DependencyContainer {
    private serviceFactories = new Map<Constructor<unknown>, () => unknown>();
    private requiredTypes = new Set<Constructor<unknown>>();
    private readonly dependencyStack: Constructor<unknown>[] = [];

    service<T>(type: Constructor<T>, factory: () => T, lazy = false): this {
        let instance: T | null = null;
        let initialized = false;
        const serviceFactory = () => {
            if (instance === null) {
                if (initialized) {
                    throw new Error(
                        `Circular dependency is detected in ${
                            type.name
                        }. Dependency chain is follows: ${this.dependencyStack.map((ctor) => ctor.name).join('\n -> ')}`
                    );
                }
                initialized = true;
                instance = factory();
            }
            return instance;
        };
        this.serviceFactories.set(type, serviceFactory);

        if (!lazy) {
            this.requiredTypes.add(type);
        }

        return this;
    }

    lazy<T>(type: Constructor<T>, factory: () => T): this {
        return this.service(type, factory, true);
    }

    get<T>(type: Constructor<T>): T {
        if (this.requiredTypes.size > 0) {
            const requiredTypes = [...this.requiredTypes];
            this.requiredTypes.clear();
            for (const type of requiredTypes) {
                this.get(type);
            }
        }

        this.dependencyStack.push(type);
        const serviceFactory = this.serviceFactories.get(type);
        if (serviceFactory === undefined) {
            throw new Error(`Service ${type.name} is not registered`);
        }

        const service = serviceFactory() as T;
        this.dependencyStack.pop();
        return service;
    }
}
