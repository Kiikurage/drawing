import { Page } from '@drawing/common/src/model/page/Page';
import { Patch } from '@drawing/common/src/model/Patch';

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
