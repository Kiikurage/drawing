import { singleton } from '../../lib/singleton';
import { AppController } from '../App/AppController/AppController';
import { DummyAppController } from '../App/AppController/DummyAppController';
import { FirebaseAppController } from '../App/AppController/FirebaseAppController';
import { CollaborationController } from './controller/CollaborationController/CollaborationController';
import { DummyCollaborationController } from './controller/CollaborationController/DummyCollaborationController';
import { FirebaseCollaborationController } from './controller/CollaborationController/FirebaseCollaborationController';
import { CameraExtension } from './controller/extensions/CameraExtension';
import { ContextMenuExtension } from './controller/extensions/ContextMenuExtension';
import { LineModeExtension } from './controller/extensions/LineModeExtension';
import { RangeSelectExtension } from './controller/extensions/RangeSelectExtension';
import { RectModeExtension } from './controller/extensions/RectModeExtension';
import { SelectModeExtension } from './controller/extensions/SelectModeExtension';
import { TextEditModeExtension } from './controller/extensions/TextEditModeExtension';
import { TextModeExtension } from './controller/extensions/TextModeExtension';
import { TransformExtension } from './controller/extensions/TransformExtension';

export module deps {
    const USE_DUMMY_CONTROLLERS = false;

    export const cameraExtension = singleton(() => new CameraExtension());
    export const contextMenuExtension = singleton(() => new ContextMenuExtension());
    export const lineModeExtension = singleton(() => new LineModeExtension());
    export const rangeSelectExtension = singleton(() => new RangeSelectExtension());
    export const rectModeExtension = singleton(() => new RectModeExtension(transformExtension()));
    export const selectModeExtension = singleton(() => new SelectModeExtension(transformExtension()));
    export const textEditModeExtension = singleton(() => new TextEditModeExtension());

    export const textModeExtension = singleton(() => new TextModeExtension(transformExtension()));

    export const transformExtension = singleton(() => new TransformExtension());

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
}
