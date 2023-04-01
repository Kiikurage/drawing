import { getAuth as _getAuth } from 'firebase/auth';
import { getDatabase as _getDatabase } from 'firebase/database';
import { deps } from './dependency';

export function getAuth() {
    return _getAuth(deps.getFirebaseApp());
}

export function getDatabase() {
    return _getDatabase(deps.getFirebaseApp());
}
