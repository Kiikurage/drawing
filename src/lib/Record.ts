export module Record {
    export function map<V1, V2>(
        record: Record<string, V1>,
        fn: (key: string, value: V1) => [string, V2]
    ): Record<string, V2> {
        return Object.fromEntries((Object.entries(record) as [string, V1][]).map(([k1, v1]) => fn(k1, v1)));
    }

    export function mapToRecord<V1, V2>(
        array: V1[],
        fn: (value: V1, index: number, array: V1[]) => [string, V2]
    ): Record<string, V2> {
        return Object.fromEntries(array.map(fn));
    }

    export function mapValue<V1, V2>(
        record: Record<string, V1>,
        fn: (value: V1, key: string) => V2
    ): Record<string, V2> {
        return Object.fromEntries(
            (Object.entries(record) as [string, V1][]).map(([k, v1]) => {
                const v2 = fn(v1, k);
                return [k, v2];
            })
        );
    }

    export function filter<V>(record: Record<string, V>, fn: (value: V, key: string) => boolean): Record<string, V> {
        return Object.fromEntries((Object.entries(record) as [string, V][]).filter(([k, v]) => fn(v, k)));
    }

    export function size(record: Record<string, unknown>): number {
        return Object.keys(record).length;
    }
}
