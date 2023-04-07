import * as firebase from '@firebase/app';
import { singleton } from '@drawing/common';
import { CollaborationController } from '../view/Editor/core/controller/CollaborationController/CollaborationController';
import { FirebaseCollaborationController } from '../view/Editor/core/controller/CollaborationController/FirebaseCollaborationController';
import { DummyCollaborationController } from '../view/Editor/core/controller/CollaborationController/DummyCollaborationController';
import { AppController } from '../view/App/AppController/AppController';
import { FirebaseAppController } from '../view/App/AppController/FirebaseAppController';
import { DummyAppController } from '../view/App/AppController/DummyAppController';

export module deps {
    import initializeApp = firebase.initializeApp;
    const USE_FIREBASE = true;
    const ENV = location.host.includes('localhost') ? 'qa' : 'prod';

    export function getFirebaseApp() {
        return initializeApp(getFirebaseConfig());
    }

    export const getFirebaseConfig = singleton(() => {
        switch (ENV) {
            case 'qa':
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

            case 'prod':
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

    export function createCollaborationController(): CollaborationController {
        if (ENV === 'prod' || USE_FIREBASE) {
            return new FirebaseCollaborationController();
        } else {
            return new DummyCollaborationController();
        }
    }

    export function createSessionInitController(): AppController {
        if (ENV === 'prod' || USE_FIREBASE) {
            return new FirebaseAppController();
        } else {
            return new DummyAppController();
        }
    }
}
