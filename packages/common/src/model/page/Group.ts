import { randomId } from '../../lib/randomId';
import { Patch } from '../Patch';

export interface Group {
    id: string;
    children: string[];
}

export module Group {
    export function create(data: Patch<Omit<Group, 'id'>> = {}): Group {
        return Patch.apply<Group>(
            {
                id: randomId(),
                children: [],
            },
            data
        );
    }
}
