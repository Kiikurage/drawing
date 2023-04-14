"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageClient = void 0;
const Dispatcher_1 = require("./Dispatcher");
class MessageClient {
    pendingClock = 0;
    completedClock = 0;
    onMessage = (0, Dispatcher_1.dispatcher)();
    handleMessage(message) {
        if (message.type === 'ack') {
            this.completedClock = message.clock;
        }
        else {
            this.sendMessage({ type: 'ack', clock: message.clock });
            this.onMessage.dispatch(message);
        }
    }
    send(message) {
        this.pendingClock++;
        const messageClock = this.pendingClock;
        const messageWithClock = { ...message, clock: messageClock };
        this.sendMessage(messageWithClock);
    }
}
exports.MessageClient = MessageClient;
//# sourceMappingURL=MessageClient.js.map