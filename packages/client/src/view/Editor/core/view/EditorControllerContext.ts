import { createContext, useContext } from 'react';
import { EditorController } from '../controller/EditorController';
import { Extension } from '../controller/Extension';
import { ExtensionConstructor } from '../controller/ExtensionHost';

const context = createContext<EditorController>(null as never);

export function useEditorController() {
    return useContext(context);
}

export function useExtension<T extends Extension>(ExtensionConstructor: ExtensionConstructor<T>): T {
    return useContext(context).getExtension(ExtensionConstructor);
}

export const EditorControllerContextProvider = context.Provider;
