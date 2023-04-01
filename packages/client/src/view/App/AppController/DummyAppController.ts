import { AppController } from './AppController';
import { Page } from '@drawing/common';

export class DummyAppController implements AppController {
    async loadOrCreatePage(): Promise<Page> {
        return Page.create();
    }

    async loadHistory(): Promise<string[]> {
        return [];
    }
}
