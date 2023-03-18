export interface RectEntity {
    type: 'rect';
    x: number;
    y: number;
    width: number;
    height: number;
    strokeColor: string;
    fillColor: string;
}

export module RectEntity {
    export function create(data: Partial<Omit<RectEntity, 'type'>>): RectEntity {
        return {
            type: 'rect',
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            strokeColor: '#000',
            fillColor: '#fff',
            ...data,
        };
    }
}
