import { EditorController } from '../../controllers/EditorController';

export abstract class Session {
    abstract type: string;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    start(controller: EditorController): void {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    update(controller: EditorController): void {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    complete(controller: EditorController): void {}
}
