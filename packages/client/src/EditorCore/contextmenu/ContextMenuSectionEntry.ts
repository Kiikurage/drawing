import { ComponentType } from 'react';

export interface ContextMenuSectionEntry {
    view: ComponentType;
    activateIf?: () => boolean;
}
