import * as http from 'http';
import { connection as WebSocketConnection, Message as WebSocketMessage, server as WebSocketServer } from 'websocket';
import { Message, MessageClient, MessageConnection } from '@drawing/common';

export interface ServerOptions {
    port: number;
}

export class Server {
    private httpServer: http.Server | null = null;
    private websocketServer: WebSocketServer | null = null;

    constructor(private readonly options: ServerOptions) {}

    start() {
        this.initializeHttpServer();
        this.initializeWebSocketServer();
    }

    private cleanUpHttpServer() {
        this.httpServer?.close();
        this.httpServer = null;
    }

    private cleanUpWebSocketServer() {
        this.websocketServer?.shutDown();
        this.websocketServer = null;
    }

    private initializeHttpServer() {
        this.cleanUpHttpServer();

        this.httpServer = http.createServer((req, res) => {
            res.writeHead(200);
            res.end('ok');
        });
        this.httpServer.listen(this.options.port, () => {
            console.log(`Server started listening port ${this.options.port}`);
        });
    }

    private initializeWebSocketServer() {
        this.cleanUpWebSocketServer();

        if (this.httpServer === null) throw new Error('HTTP server must be initialized before WebSocket server');
        this.websocketServer = new WebSocketServer({
            httpServer: this.httpServer,
            autoAcceptConnections: true,
        });

        this.websocketServer.on('connect', this.onWebSocketConnect);
    }

    private readonly onWebSocketConnect = (connection: WebSocketConnection) => {
        const client = new MessageClient(new ServerMessageConnection(connection));

        client.onMessage = (message) => {
            console.log(message);

            setTimeout(() => {
                client.send({
                    type: 'patch',
                });
            }, 1000);
        };
    };
}

class ServerMessageConnection implements MessageConnection {
    constructor(private readonly connection: WebSocketConnection) {}

    addMessageCallback(callback: (message: Message) => void): void {
        this.connection.on('message', (data: WebSocketMessage) => {
            if (data.type !== 'utf8') return;

            callback(JSON.parse(data.utf8Data) as Message);
        });
    }

    send(message: Message): void {
        this.connection.send(JSON.stringify(message));
    }
}
