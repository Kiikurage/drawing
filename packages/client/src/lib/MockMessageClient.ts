import { MessageClient } from '@drawing/common/src/lib/MessageClient';

export class MockMessageClient extends MessageClient {
    constructor() {
        super();
    }

    protected sendMessage(data: Record<string, unknown>): void {}
}
