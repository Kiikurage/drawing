import { Page } from '../../../model/Page';

export interface AppController {
    loadOrCreatePage(pageId?: string): Promise<Page>;

    loadHistory(): Promise<string[]>;
}
