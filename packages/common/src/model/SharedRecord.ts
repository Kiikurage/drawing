import { Record } from '../lib/Record';
import { SharedClientAtom } from './SharedAtom';

interface AddMessage {
    type: 'ADD';
    value: any;
}

interface DeleteMessage {
    type: 'DELETE';
}

interface UpdateMessage {
    type: 'UPDATE';
    value: any;
}

class SharedProperty extends SharedClientAtom<AddMessage | DeleteMessage | UpdateMessage> {
    #value: any;
    #deleted = false;

    get value() {
        return this.#value;
    }

    get deleted() {
        return this.#deleted;
    }

    constructor(key: string) {
        super(key);
    }

    new(value: any): this {
        this.#value = value;
        this.#deleted = false;
        this.dispatch({ type: 'ADD', value });
        return this;
    }

    set(value: any): this {
        this.#value = value;
        this.dispatch({ type: 'UPDATE', value });
        return this;
    }

    delete(): this {
        if (this.deleted) return this;
        this.#deleted = true;

        this.dispatch({ type: 'DELETE' });
        return this;
    }

    protected onMessage(message: AddMessage | UpdateMessage | DeleteMessage, concurrent: boolean): void {
        console.log('RECEIVED', message.type, this.roomId, concurrent);

        switch (message.type) {
            case 'ADD': {
                const { value } = message;
                if (concurrent) {
                    if (this.deleted) {
                        // 自分の削除がサーバーに伝わる前に誰かが編集した->自分の削除優先
                    } else {
                        this.#deleted = false;
                        this.#value = value;
                    }
                } else {
                    if (this.deleted) {
                        // 新しいデータを追加しようとしている
                        // 競合していないので相手の追加を受け入れる
                        this.#deleted = false;
                        this.#value = value;
                    } else {
                        throw new Error('Impossible');
                    }
                }
                return;
            }
            case 'UPDATE': {
                const { value } = message;
                if (concurrent) {
                    if (this.deleted) {
                        // 自分の削除がサーバーに伝わる前に誰かが編集した->自分の削除優先
                    } else {
                        // サーバー・クライアント両方で編集->サーバー優先
                        this.#value = value;
                    }
                } else {
                    if (this.deleted) {
                        throw new Error('Impossible');
                    } else {
                        this.#value = value;
                    }
                }
                return;
            }
            case 'DELETE': {
                // 削除は絶対優先
                this.#deleted = true;
                return;
            }
        }
    }
}

export class SharedRecord {
    readonly properties: Record<string, SharedProperty> = {};

    get value() {
        return Record.mapValue(
            Record.filter(this.properties, (property) => !property.deleted),
            (property) => property.value
        );
    }

    set(key: string, value: any): this {
        if (key in this.properties) {
            const property = this.properties[key];
            if (property.deleted) {
                property.new(value);
            } else {
                property.set(value);
            }
        } else {
            const property = new SharedProperty(key);
            property.new(value);
            this.properties[key] = property;
        }

        return this;
    }

    delete(key: string): this {
        if (key in this.properties) {
            this.properties[key].delete();
        }

        return this;
    }
}
