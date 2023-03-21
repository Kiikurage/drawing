import { uuid } from '../lib/uuid';
import { Entity } from './entity/Entity';
import { Patch } from './Patch';

export interface Page {
    id: string;
    entities: Record<string, Entity>;
}

export module Page {
    export function create(data: Patch<Omit<Page, 'id'>> = {}): Page {
        return Patch.apply<Page>(
            {
                id: uuid(),
                entities: {},
            },
            data
        );
    }
}
