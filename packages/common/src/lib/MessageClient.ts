import { dispatcher } from './Dispatcher';
import { Message } from '../model/Message';

export abstract class MessageClient {
    private pendingClock = 0;
    private completedClock = 0;

    readonly onMessage = dispatcher<Message>();

    protected abstract sendMessage(data: Record<string, unknown>): void;

    handleMessage(message: Message & { clock: number }) {
        if (message.type === 'ack') {
            this.completedClock = message.clock;
        } else {
            this.sendMessage({ type: 'ack', clock: message.clock });
            this.onMessage.dispatch(message);
        }
    }

    send(message: Message): void {
        this.pendingClock++;
        const messageClock = this.pendingClock;

        const messageWithClock = { ...message, clock: messageClock };

        this.sendMessage(messageWithClock);
    }
}
