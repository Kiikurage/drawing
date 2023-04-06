import { SharedMessage, SharedServerAtom } from '@drawing/common';

export class ReconciliationService {
    private readonly rooms: {
        [roomId: string]: SharedServerAtom;
    } = {};

    onNotifyUpdate?: (clientId: string, message: SharedMessage) => void;

    addClient(roomId: string, clientId: string) {
        let room = this.rooms[roomId];
        if (room === undefined) {
            room = new SharedServerAtom();
            this.rooms[roomId] = room;
        }
        room.addClient(clientId);
    }

    removeClient(roomId: string, clientId: string) {
        const room = this.rooms[roomId];
        if (room === undefined) return;

        room.removeClient(clientId);
        if (Object.keys(room.clientClocks).length === 0) {
            delete this.rooms[roomId];
        }
    }

    applyMessage(roomId: string, clientId: string, message: SharedMessage) {
        const room = this.rooms[roomId];
        if (room === undefined) return;

        const messagesByClientId = room.apply(clientId, message);

        for (const [cId, message] of messagesByClientId) {
            this.onNotifyUpdate?.(cId, message);
        }
    }
}
