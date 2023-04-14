import { Action } from './page/action/Action';
import { Page } from './page/Page';

export type Message = AckMessage | RequestSyncMessage | SyncMessage | EditMessage;

export interface AckMessage {
    type: 'ack';
}

export interface RequestSyncMessage {
    type: 'request';
}

export interface SyncMessage {
    type: 'sync';
    page: Page;
}

export interface EditMessage {
    type: 'edit';
    edit: Action;
}
