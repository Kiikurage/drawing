import { dispatcher } from '../lib/Dispatcher';

export interface MessageClient {
    type: string;
    clock: number;
}

export abstract class MessageClient {
    private pendingClock = 0;
    private completedClock = 0;

    readonly onMessage = dispatcher<MessageClient>();

    protected abstract sendMessage(data: Record<string, unknown>): void;

    protected handleMessage(message: MessageClient) {
        if (message.type === 'ack') {
            this.completedClock = message.clock;
        } else {
            this.sendMessage({ type: 'ack', clock: message.clock });
            this.onMessage.dispatch(message);
        }
    }

    send(message: Record<string, unknown>): void {
        this.pendingClock++;
        const messageClock = this.pendingClock;

        const messageWithClock = { ...message, clock: messageClock };

        exponentialBackOffRetry(
            () => this.sendMessage(messageWithClock),
            () => this.completedClock >= messageClock
        ).catch(() => {
            throw new Error('Message timed out');
        });
    }
}

function exponentialBackOffRetry(
    run: () => void,
    checkSuccess: () => boolean,
    initialDurationInMS = 1000,
    maxRetryCount = 5
): Promise<void> {
    let retryCount = 0;
    let duration = initialDurationInMS;

    return new Promise((resolve, reject) => {
        function trial() {
            run();
            setTimeout(() => {
                if (checkSuccess()) {
                    resolve();
                } else {
                    retryCount += 1;
                    if (retryCount < maxRetryCount) {
                        reject();
                    } else {
                        duration *= 2;
                        trial();
                    }
                }
            }, duration);
        }

        trial();
    });
}
