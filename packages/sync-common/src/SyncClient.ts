export interface SyncObject {
    client: SyncClient;

    onMessage: (message: any) => void;
}

export interface SyncClient {
    readonly id: string;

    connect(object: SyncObject): void;

    broadcast(message: any): void;
}
