import * as http from 'http';
import { Patch } from '@drawing/common';

export interface ServerOptions {
    port: number;
}

export class Server {
    private readonly options: ServerOptions;
    private httpServer: http.Server | null = null;

    constructor(options: Partial<ServerOptions> = {}) {
        this.options = Patch.apply(
            {
                port: 12893,
            },
            options
        );
    }

    start() {
        this.initializeHttpServer();
    }

    private cleanUpHttpServer() {
        this.httpServer?.close();
        this.httpServer = null;
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
}
