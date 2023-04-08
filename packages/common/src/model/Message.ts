import { EditAction } from './page/action/EditAction';
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
    edit: EditAction;
}
