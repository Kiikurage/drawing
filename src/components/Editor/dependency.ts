import { CollaborationController } from './controllers/CollaborationEditController/CollaborationController';
import { DummyCollaborationController } from './controllers/CollaborationEditController/DummyCollaborationController';
import { FirebaseCollaborationController } from './controllers/CollaborationEditController/FirebaseCollaborationController';
import { DummySessionInitController } from './controllers/SessionInitController/DummySessionInitController';
import { FirebaseSessionInitController } from './controllers/SessionInitController/FirebaseSessionInitController';
import { SessionInitController } from './controllers/SessionInitController/SessionInitController';

const USE_DUMMY_CONTROLLERS = true;

export function createCollaborationController(): CollaborationController {
    if (USE_DUMMY_CONTROLLERS && location.host.includes('localhost')) {
        return new DummyCollaborationController();
    } else {
        return new FirebaseCollaborationController();
    }
}

export function createSessionInitController(): SessionInitController {
    if (USE_DUMMY_CONTROLLERS && location.host.includes('localhost')) {
        return new DummySessionInitController();
    } else {
        return new FirebaseSessionInitController();
    }
}
