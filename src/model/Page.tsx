import { Entity } from './entity/Entity';

export interface Page {
    entities: Entity[];
}

export module Page {
    export function create(): Page {
        return {
            entities: [],
        };
    }
}
