import { CollaborationController } from './CollaborationController';

export class DummyCollaborationController implements CollaborationController {
    async savePage(): Promise<void> {
        // No op
    }

    addUpdateListener() {
        // No op
    }

    removeUpdateListener() {
        // No op
    }
}
