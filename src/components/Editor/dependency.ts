import { AppController } from '../App/AppController/AppController';
import { DummyAppController } from '../App/AppController/DummyAppController';
import { FirebaseAppController } from '../App/AppController/FirebaseAppController';
import { CollaborationController } from './controllers/CollaborationController/CollaborationController';
import { DummyCollaborationController } from './controllers/CollaborationController/DummyCollaborationController';
import { FirebaseCollaborationController } from './controllers/CollaborationController/FirebaseCollaborationController';

const USE_DUMMY_CONTROLLERS = true;

export function createCollaborationController(): CollaborationController {
    if (USE_DUMMY_CONTROLLERS && location.host.includes('localhost')) {
        return new DummyCollaborationController();
    } else {
        return new FirebaseCollaborationController();
    }
}

export function createSessionInitController(): AppController {
    if (USE_DUMMY_CONTROLLERS && location.host.includes('localhost')) {
        return new DummyAppController();
    } else {
        return new FirebaseAppController();
    }
}
