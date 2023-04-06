import { SyncClient } from './SyncClient';

export const NoopSyncClient: SyncClient = {
    id: '__NOOP_SYNC_CLIENT__',
    connect() {},
    broadcast() {},
};
