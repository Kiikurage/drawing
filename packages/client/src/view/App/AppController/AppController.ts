import { Page } from '@drawing/common';

export interface AppController {
    loadOrCreatePage(pageId?: string): Promise<Page>;

    loadHistory(): Promise<string[]>;
}
