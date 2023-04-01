import * as http from 'http';
import { connection as WebsocketConnection, server as WebsocketServer } from 'websocket';

export interface ServerOptions {
    host: string;
    port: number;
}

export class Server {
    private httpServer: http.Server | null = null;
    private websocketServer: WebsocketServer | null = null;
    private readonly websocketConnections: WebsocketConnection[] = [];
    private readonly options: ServerOptions;

    constructor(options: Partial<ServerOptions> = {}) {
        this.options = {
            host: 'localhost',
            port: 12893,
            ...options,
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
        this.websocketConnections.forEach((connection) => connection.close());
        this.websocketConnections.length = 0;
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
        console.log('New connection opened');
        this.websocketConnections.push(connection);
    };
}
