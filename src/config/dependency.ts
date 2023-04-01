import { singleton } from '../lib/singleton';
import { AppController } from '../view/App/AppController/AppController';
import { DummyAppController } from '../view/App/AppController/DummyAppController';
import { FirebaseAppController } from '../view/App/AppController/FirebaseAppController';
import { CollaborationController } from '../view/Editor/controller/CollaborationController/CollaborationController';
import { DummyCollaborationController } from '../view/Editor/controller/CollaborationController/DummyCollaborationController';
import { FirebaseCollaborationController } from '../view/Editor/controller/CollaborationController/FirebaseCollaborationController';
import { CameraExtension } from '../view/Editor/controller/extensions/CameraExtension';
import { ContextMenuExtension } from '../view/Editor/controller/extensions/ContextMenuExtension';
import { LineModeExtension } from '../view/Editor/controller/extensions/LineModeExtension';
import { RangeSelectExtension } from '../view/Editor/controller/extensions/RangeSelectExtension';
import { RectModeExtension } from '../view/Editor/controller/extensions/RectModeExtension';
import { SelectModeExtension } from '../view/Editor/controller/extensions/SelectModeExtension';
import { TextEditModeExtension } from '../view/Editor/controller/extensions/TextEditModeExtension';
import { TextModeExtension } from '../view/Editor/controller/extensions/TextModeExtension';
import { TransformExtension } from '../view/Editor/controller/extensions/TransformExtension';
import { initializeApp } from 'firebase/app';

export module deps {
    const USE_DUMMY_CONTROLLERS = false;

    export function getFirebaseApp() {
        return initializeApp(getFirebaseConfig());
    }

    export const getFirebaseConfig = singleton(() => {
        if (location.host.includes('localhost')) {
            return {
                apiKey: 'AIzaSyBnI9_5RIfnPMH9fr14Jwf3FmWmAXOgPjs',
                authDomain: 'fir-qa-907fa.firebaseapp.com',
                projectId: 'fir-qa-907fa',
                storageBucket: 'fir-qa-907fa.appspot.com',
                messagingSenderId: '368939233132',
                appId: '1:368939233132:web:12098b89a90c6195eb0d49',
                measurementId: 'G-NC24LYNMK5',
                databaseURL: 'https://fir-qa-907fa-default-rtdb.asia-southeast1.firebasedatabase.app/',
            };
        } else {
            return {
                apiKey: 'AIzaSyDutIBJK2Mj6AGi7v7RmMMv2xjjMuj_h6c',
                authDomain: 'drawing-e3c7b.firebaseapp.com',
                projectId: 'drawing-e3c7b',
                storageBucket: 'drawing-e3c7b.appspot.com',
                messagingSenderId: '687442118487',
                appId: '1:687442118487:web:9c3c5709cd3374b002a012',
                measurementId: 'G-6H14S5XYBZ',

                databaseURL: 'https://drawing-e3c7b-default-rtdb.asia-southeast1.firebasedatabase.app',
            };
        }
    });
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
