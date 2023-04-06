import { SharedClientAtom } from './SharedAtom';
import { randomId } from '../lib/randomId';

interface PushMessage {
    type: 'PUSH';
    insertAfter?: string;
    id: string;
    value: number;
}

interface PopMessage {
    type: 'POP';
}

export class SharedArray extends SharedClientAtom<PushMessage | PopMessage> {
    private readonly clientId = randomId();
    #data: { id: string; value: number }[] = [];

    get data() {
        return this.#data.map((element) => element.value);
    }

    constructor(roomId: string) {
        super(roomId);
    }

    push(value: number) {
        const newElementId = `${this.#data.length.toString().padStart(3, '0')}:${this.clientId}`;
        const newElement = { id: newElementId, value: value };
        this.#data.push(newElement);

        const message: PushMessage = {
            type: 'PUSH',
            insertAfter: this.#data.at(-2)?.id,
            id: newElementId,
            value,
        };

        this.dispatch(message);
    }

    pop(): number | undefined {
        this.dispatch({ type: 'POP' });
        return this.#data.pop()?.value;
    }

    protected onMessage(message: PopMessage | PushMessage): void {
        switch (message.type) {
            case 'POP':
                this.#data.pop();
                return;
            case 'PUSH': {
                const { insertAfter, id, value } = message;
                let insertIndex: number;
                if (insertAfter === undefined) {
                    insertIndex = 0;
                } else {
                    insertIndex = this.#data.findIndex((element) => element.id === insertAfter) + 1;
                }

                while (true) {
                    const currentElement = this.#data[insertIndex];
                    if (currentElement === undefined) break;

                    if (currentElement.id < id) break;
                    insertIndex++;
                }

                this.#data.splice(insertIndex, 0, { id, value });
                return;
            }
        }
    }
}
