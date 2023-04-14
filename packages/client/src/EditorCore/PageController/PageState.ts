import { Page, Patch } from '@drawing/common';

export interface PageState {
    page: Page;
}

export module PageState {
    export function create(initialData: Patch<PageState> = {}) {
        return Patch.apply<PageState>(
            {
                page: Page.create(),
            },
            initialData
        );
    }
}
