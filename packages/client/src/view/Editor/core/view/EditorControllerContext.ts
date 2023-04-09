import { createContext, useContext } from 'react';
import { Editor } from '../controller/Editor';
import { Extension } from '../controller/Extension';
import { ExtensionConstructor } from '../controller/ExtensionHost';

const context = createContext<Editor>(null as never);

export function useEditor() {
    return useContext(context);
}

export function useExtension<T extends Extension>(ExtensionConstructor: ExtensionConstructor<T>): T {
    return useContext(context).getExtension(ExtensionConstructor);
}

export const EditorContextProvider = context.Provider;
