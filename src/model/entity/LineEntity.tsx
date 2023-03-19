import { ModelCordPoint } from '../Point';

export interface LineEntity {
    id: string;
    type: 'line';
    point: ModelCordPoint;
    width: number;
    height: number;
    strokeColor: string;
}

export module LineEntity {
    export function create(data: Partial<Omit<LineEntity, 'type'>>): LineEntity {
        return {
            id: `${performance.now()}`,
            type: 'line',
            point: ModelCordPoint({ x: 0, y: 0 }),
            width: 100,
            height: 100,
            strokeColor: '#000',
            ...data,
        };
    }
}
