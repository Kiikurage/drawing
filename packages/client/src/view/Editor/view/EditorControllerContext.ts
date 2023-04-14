import { createContext, useContext } from 'react';
import { EditorViewController } from '../controller/EditorViewController';

const context = createContext<EditorViewController>(null as never);

export function useEditorViewController() {
    return useContext(context);
}

export const EditorContextProvider = context.Provider;
