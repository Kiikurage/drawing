import { Entity } from '@drawing/common';
import { ComponentType } from 'react';
import { PolygonEntityViewDelegate } from './PolygonEntityViewDelegate/PolygonEntityViewDelegate';
import { LineEntityViewDelegate } from './LineEntityViewDelegate/LineEntityViewDelegate';
import { TextEntityViewDelegate } from './TextEntityViewDelegate/TextEntityViewDelegate';

export interface EntityViewDelegate<T extends Entity> {
    contentComponentType: ComponentType<{ entity: T }>;
    outlineComponentType: ComponentType<{ entity: T }>;
    singleSelectionComponentType?: ComponentType<{ entity: T }>;
}

export module EntityViewDelegate {
    const delegates: Record<Entity['type'], EntityViewDelegate<any>> = {
        line: LineEntityViewDelegate,
        polygon: PolygonEntityViewDelegate,
        text: TextEntityViewDelegate,
    };

    export function getDelegate<T extends Entity>(entity: T): EntityViewDelegate<T> {
        return delegates[entity.type] as EntityViewDelegate<T>;
    }
}
