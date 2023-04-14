import * as http from 'http';
import { connection as WebSocketConnection, Message as WebSocketMessage, server as WebSocketServer } from 'websocket';
import { Action, Message, MessageClient, Page, Patch } from '@drawing/common';

export interface ServerOptions {
    port: number;
}

export class Server {
    private httpServer: http.Server | null = null;
    private websocketServer: WebSocketServer | null = null;
    private page: Page = Page.create();
    private readonly messageClients = new Set<ServerMessageClient>();

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
        const client = new ServerMessageClient(connection);

        client.onMessage.addListener((message: Message) => {
            switch (message.type) {
                case 'edit': {
                    this.page = Patch.apply(this.page, Action.toPatch(this.page, message.edit));
                    this.messageClients.forEach((c) => {
                        if (c === client) return;
                        c.send({ type: 'edit', edit: message.edit });
                    });
                    return;
                }

                case 'request': {
                    client.send({ type: 'sync', page: this.page });
                    return;
                }

                case 'sync':
                case 'ack':
                default:
                    return;
            }
        });

        connection.on('close', () => this.messageClients.delete(client));
        this.messageClients.add(client);
    };
}

class ServerMessageClient extends MessageClient {
    constructor(private readonly connection: WebSocketConnection) {
        super();
        connection.on('message', (data: WebSocketMessage) => {
            if (data.type !== 'utf8') return;

            this.handleMessage(JSON.parse(data.utf8Data));
        });
    }

    protected sendMessage(data: Record<string, unknown>): void {
        this.connection.send(JSON.stringify(data));
    }
}
