import { Page } from '@drawing/common';
import { CRDTPageAction } from '../../model/LivePage/CRDTLivePage';

export interface CollaborationController {
    savePage(page: Page): Promise<void>;

    loadPage(pageId: string): Promise<Page | null>;

    dispatchActions(pageId: string, actions: CRDTPageAction[]): void;

    addActionListener(pageId: string, callback: (action: CRDTPageAction) => void): void;

    removeActionListener(pageId: string, callback: (action: CRDTPageAction) => void): void;
}
