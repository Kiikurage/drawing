export type Key = string;

export module Key {
    export function serialize(keys: Key[]): string {
        return [...new Set(keys)]
            .map((k) => k.toLowerCase())
            .sort()
            .join('+');
    }
}
