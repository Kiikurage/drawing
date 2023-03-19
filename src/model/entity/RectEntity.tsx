import { ModelCordPoint } from '../Point';

export interface RectEntity {
    id: string;
    type: 'rect';
    point: ModelCordPoint;
    width: number;
    height: number;
    strokeColor: string;
    fillColor: string;
}

export module RectEntity {
    export function create(data: Partial<Omit<RectEntity, 'type'>>): RectEntity {
        return {
            id: `${performance.now()}`,
            type: 'rect',
            point: ModelCordPoint({ x: 0, y: 0 }),
            width: 100,
            height: 100,
            strokeColor: '#000',
            fillColor: 'transparent',
            ...data,
        };
    }
}
