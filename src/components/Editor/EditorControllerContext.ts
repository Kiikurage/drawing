import { createContext, useContext } from 'react';
import { EditorController } from './EditorController';

const context = createContext<EditorController>(null as never);

export function useEditorController() {
    return useContext(context);
}

export const EditorControllerContextProvider = context.Provider;
