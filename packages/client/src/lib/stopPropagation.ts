import { SyntheticEvent } from 'react';

export function suppressEvent(ev: Event | SyntheticEvent) {
    ev.stopPropagation();
    ev.preventDefault();
}
