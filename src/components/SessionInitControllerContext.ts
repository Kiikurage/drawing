import { createContext, useContext } from 'react';
import { SessionInitController } from './Editor/controllers/SessionInitController/SessionInitController';

const context = createContext<SessionInitController>(null as never);

export function useSessionInitController() {
    return useContext(context);
}

export const SessionInitControllerProvider = context.Provider;
