import { Page } from '../../../../model/Page';
import { SessionInitController } from './SessionInitController';

export class DummySessionInitController implements SessionInitController {
    async loadOrCreatePage(): Promise<Page> {
        return Page.create();
    }
}
