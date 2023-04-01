import { createContext, useContext } from 'react';
import { AppController } from './AppController/AppController';

const context = createContext<AppController>(null as never);

export function useAppController() {
    return useContext(context);
}

export const AppControllerProvider = context.Provider;
