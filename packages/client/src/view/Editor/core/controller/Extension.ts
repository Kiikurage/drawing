import { Editor } from './Editor';

export abstract class Extension {
    protected controller: Editor = null as never;

    initialize(controller: Editor): void {
        this.controller = controller;
    }
}
