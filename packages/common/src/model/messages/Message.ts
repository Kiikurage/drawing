import { noop } from '../../lib/noop';

export type Message = AckMessage | PatchMessage;

export interface AckMessage {
    type: 'ack';
    clock: number;
}

export interface PatchMessage {
    type: 'patch';
    clock: number;
}

export class MessageClient {
    pendingClock = 0;
    completedClock = 0;

    constructor(private readonly connection: MessageConnection) {
        connection.addMessageCallback((message: Message) => {
            if (message.type === 'ack') {
                this.completedClock = message.clock;
            } else {
                this.handleMessage(message);
            }
        });
    }

    onMessage: (message: Message) => void = noop;

    send(message: Omit<Message, 'clock'>): void {
        this.pendingClock++;
        const messageClock = this.pendingClock;

        const messageWithClock: Message = { ...message, clock: messageClock };

        exponentialBackOffRetry(
            () => this.connection.send(messageWithClock),
            () => this.completedClock >= messageClock
        ).catch(() => {
            throw new Error('Message timed out');
        });
    }

    private handleMessage(message: Message) {
        this.connection.send({ type: 'ack', clock: message.clock });

        this.onMessage(message);
    }
}

export interface MessageConnection {
    send(message: Message): void;

    addMessageCallback(callback: (message: Message) => void): void;
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
