export interface Command {
    key: string;
    name: string;
    run: () => void;
}

export function Command(key: string, name: string, run: () => void): Command {
    return {
        run,
        name,
        key,
    };
}
