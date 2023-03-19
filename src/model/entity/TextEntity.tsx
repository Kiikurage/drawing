export interface TextEntity {
    id: string;
    type: 'text';
    x: number;
    y: number;
    value: string;
}

export module TextEntity {
    export function create(initialData: Partial<Omit<TextEntity, 'type'>>): TextEntity {
        return {
            id: `${performance.now()}`,
            type: 'text' as const,
            x: 0,
            y: 0,
            value: 'Hello World!',
            ...initialData,
        };
    }
}
