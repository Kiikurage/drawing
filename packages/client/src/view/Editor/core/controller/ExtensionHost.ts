import { Extension } from './Extension';

export interface ExtensionConstructor<T extends Extension = Extension> {
    new (): T;
}

export interface ExtensionHost {
    addExtension(ExtensionConstructor: ExtensionConstructor): this;

    requireExtension<T extends Extension>(ExtensionConstructor: ExtensionConstructor<T>): T;

    getExtension<T extends Extension>(ExtensionConstructor: ExtensionConstructor<T>): T;
}
