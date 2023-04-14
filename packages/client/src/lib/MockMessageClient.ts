import { MessageClient } from '@drawing/common';

export class MockMessageClient extends MessageClient {
    constructor() {
        super();
    }

    protected sendMessage(data: Record<string, unknown>): void {}
}
