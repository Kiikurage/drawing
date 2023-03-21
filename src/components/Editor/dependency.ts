import { CollaborationController } from './controllers/CollaborationEditController/CollaborationController';
import { DummyCollaborationController } from './controllers/CollaborationEditController/DummyCollaborationController';
import { FirebaseCollaborationController } from './controllers/CollaborationEditController/FirebaseCollaborationController';

export function createCollaborationController(): CollaborationController {
    if (location.host.includes('localhost')) {
        return new DummyCollaborationController();
    } else {
        return new FirebaseCollaborationController();
    }
}
