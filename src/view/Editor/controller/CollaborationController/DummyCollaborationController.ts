import { Page } from '../../../../model/Page';
import { CollaborationController } from './CollaborationController';

export class DummyCollaborationController implements CollaborationController {
    dispatchActions() {
        // No op
    }

    async loadPage(pageId: string): Promise<Page | null> {
        return null;
    }

    async savePage(): Promise<void> {
        // No op
    }

    addActionListener(): void {
        // No op
    }

    removeActionListener(): void {
        // No op
    }
}
