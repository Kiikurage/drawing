import { ModelCordPoint } from '../Point';

export interface TextEntity {
    id: string;
    type: 'text';
    point: ModelCordPoint;
    value: string;
}

export module TextEntity {
    export function create(initialData: Partial<Omit<TextEntity, 'type'>>): TextEntity {
        return {
            id: `${performance.now()}`,
            type: 'text' as const,
            point: ModelCordPoint({ x: 0, y: 0 }),
            value: 'Hello World!',
            ...initialData,
        };
    }
}
