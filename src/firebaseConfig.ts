import { initializeApp } from 'firebase/app';
import { getDatabase as _getDatabase } from 'firebase/database';

export const firebaseConfig = {
    apiKey: 'AIzaSyDutIBJK2Mj6AGi7v7RmMMv2xjjMuj_h6c',
    authDomain: 'drawing-e3c7b.firebaseapp.com',
    projectId: 'drawing-e3c7b',
    storageBucket: 'drawing-e3c7b.appspot.com',
    messagingSenderId: '687442118487',
    appId: '1:687442118487:web:9c3c5709cd3374b002a012',
    measurementId: 'G-6H14S5XYBZ',
    databaseURL: 'https://drawing-e3c7b-default-rtdb.asia-southeast1.firebasedatabase.app',
};

export function getApp() {
    return initializeApp(firebaseConfig);
}

export function getDatabase() {
    return _getDatabase(getApp());
}
