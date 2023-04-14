"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatcher = void 0;
function dispatcher() {
    return new DispatcherImpl();
}
exports.dispatcher = dispatcher;
class DispatcherImpl {
    callbacks = new Set();
    addListener(callback) {
        this.callbacks.add(callback);
        return this;
    }
    addListenerOnce(callback) {
        const wrapped = (value) => {
            this.removeListener(wrapped);
            callback(value);
        };
        this.callbacks.add(wrapped);
        return this;
    }
    removeListener(callback) {
        this.callbacks.delete(callback);
        return this;
    }
    dispatch(value) {
        this.callbacks.forEach((callback) => callback(value));
    }
}
//# sourceMappingURL=Dispatcher.js.map