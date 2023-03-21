import { Page } from '../../../../model/Page';

export interface CollaborationController {
    savePage(page: Page): Promise<void>;

    addUpdateListener(pageId: string, callback: (page: Page) => void): void;

    removeUpdateListener(pageId: string, callback: (page: Page) => void): void;
}
