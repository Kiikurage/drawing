import * as http from 'http';
import { connection as WebsocketConnection, server as WebsocketServer } from 'websocket';
import { ReconciliationService } from './ReconciliationService';
import { JoinRoomMessage, randomId, SharedMessage } from '@drawing/common';

export interface ServerOptions {
    host: string;
    port: number;
}

export class Server {
    private httpServer: http.Server | null = null;
    private websocketServer: WebsocketServer | null = null;
    private websocketConnections: Record<string, WebsocketConnection> = {};
    private readonly options: ServerOptions;
    private readonly reconciliationService = new ReconciliationService();

    constructor(options: Partial<ServerOptions> = {}) {
        this.options = {
            host: 'localhost',
            port: 12893,
            ...options,
        };
        this.reconciliationService.onNotifyUpdate = (clientId: string, message: SharedMessage) => {
            const connection = this.websocketConnections[clientId];
            // if (connection === undefined) {
            //     this.reconciliationService.removeClient('ROOM', clientId);
            //     return;
            // }
            connection.send(JSON.stringify(message));
        };
    }

    start() {
        this.initializeHttpServer();
        this.initializeWebsocketServer();
    }

    private cleanUpHttpServer() {
        this.httpServer?.close();
        this.httpServer = null;
    }

    private cleanUpWebsocketServer() {
        Object.values(this.websocketConnections).forEach((connection) => connection.close());
        this.websocketConnections = {};
        this.websocketServer?.shutDown();
        this.websocketServer = null;
    }

    private initializeHttpServer() {
        this.cleanUpHttpServer();

        this.httpServer = http.createServer((req, res) => {
            res.writeHead(200);
            res.end('ok');
        });
        this.httpServer.listen(this.options.port, this.options.host, () => {
            console.log(`Server started on ${this.options.host}:${this.options.port}`);
        });
    }

    private initializeWebsocketServer() {
        this.cleanUpWebsocketServer();

        if (this.httpServer === null) throw new Error('Must initialize http server first.');
        this.websocketServer = new WebsocketServer({
            httpServer: this.httpServer,
            autoAcceptConnections: true,
        });
        this.websocketServer.on('connect', this.onWebsocketConnect);
    }

    onWebsocketConnect = (connection: WebsocketConnection) => {
        const clientId = randomId();
        let roomId: string | null = null;

        connection.on('message', (ev) => {
            if (ev.type !== 'utf8') return;
            const message = JSON.parse(ev.utf8Data) as SharedMessage | JoinRoomMessage;
            if ('type' in message && message.type === 'JOIN') {
                roomId = message.roomId;
                this.reconciliationService.addClient(roomId, clientId);
            } else {
                if (roomId === null) return;
                this.reconciliationService.applyMessage(roomId, clientId, message as SharedMessage);
            }
        });
        connection.on('close', () => {
            if (roomId === null) return;
            this.reconciliationService.removeClient(roomId, clientId);
        });

        this.websocketConnections[clientId] = connection;
    };
}
