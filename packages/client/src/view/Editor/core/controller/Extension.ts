import { EditorController } from './EditorController';

export abstract class Extension {
    protected controller: EditorController = null as never;

    initialize(controller: EditorController): void {
        this.controller = controller;
    }
}
