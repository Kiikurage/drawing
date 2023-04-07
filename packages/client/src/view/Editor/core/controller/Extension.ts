import { IEditorController } from './IEditorController';

export abstract class Extension {
    protected controller: IEditorController = null as never;

    onRegister(controller: IEditorController): void {
        this.controller = controller;
    }
}
