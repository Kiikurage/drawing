"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const http = __importStar(require("http"));
const websocket_1 = require("websocket");
const Page_1 = require("@drawing/common/src/model/page/Page");
const Patch_1 = require("@drawing/common/src/model/Patch");
const Action_1 = require("@drawing/common/src/model/page/action/Action");
const MessageClient_1 = require("@drawing/common/src/lib/MessageClient");
class Server {
    options;
    httpServer = null;
    websocketServer = null;
    page = Page_1.Page.create();
    messageClients = new Set();
    constructor(options) {
        this.options = options;
    }
    start() {
        this.initializeHttpServer();
        this.initializeWebSocketServer();
    }
    cleanUpHttpServer() {
        this.httpServer?.close();
        this.httpServer = null;
    }
    cleanUpWebSocketServer() {
        this.websocketServer?.shutDown();
        this.websocketServer = null;
    }
    initializeHttpServer() {
        this.cleanUpHttpServer();
        this.httpServer = http.createServer((req, res) => {
            res.writeHead(200);
            res.end('ok');
        });
        this.httpServer.listen(this.options.port, () => {
            console.log(`Server started listening port ${this.options.port}`);
        });
    }
    initializeWebSocketServer() {
        this.cleanUpWebSocketServer();
        if (this.httpServer === null)
            throw new Error('HTTP server must be initialized before WebSocket server');
        this.websocketServer = new websocket_1.server({
            httpServer: this.httpServer,
            autoAcceptConnections: true,
        });
        this.websocketServer.on('connect', this.onWebSocketConnect);
    }
    onWebSocketConnect = (connection) => {
        const client = new ServerMessageClient(connection);
        client.onMessage.addListener((message) => {
            switch (message.type) {
                case 'edit': {
                    this.page = Patch_1.Patch.apply(this.page, Action_1.Action.toPatch(this.page, message.edit));
                    this.messageClients.forEach((c) => {
                        if (c === client)
                            return;
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
exports.Server = Server;
class ServerMessageClient extends MessageClient_1.MessageClient {
    connection;
    constructor(connection) {
        super();
        this.connection = connection;
        connection.on('message', (data) => {
            if (data.type !== 'utf8')
                return;
            this.handleMessage(JSON.parse(data.utf8Data));
        });
    }
    sendMessage(data) {
        this.connection.send(JSON.stringify(data));
    }
}
//# sourceMappingURL=Server.js.map