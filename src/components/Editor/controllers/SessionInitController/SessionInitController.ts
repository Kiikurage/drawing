import { Page } from '../../../../model/Page';

export interface SessionInitController {
    loadOrCreatePage(pageId?: string): Promise<Page>;

    loadHistory(): Promise<string[]>;
}
