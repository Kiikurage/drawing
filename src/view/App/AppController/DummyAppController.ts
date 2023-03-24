import { Page } from '../../../model/Page';
import { AppController } from './AppController';

export class DummyAppController implements AppController {
    async loadOrCreatePage(): Promise<Page> {
        return Page.create();
    }

    async loadHistory(): Promise<string[]> {
        return [];
    }
}
