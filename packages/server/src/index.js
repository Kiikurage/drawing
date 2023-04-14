"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Server_1 = require("./Server");
const server = new Server_1.Server({
    port: Number(process.env.PORT ?? 10000),
});
server.start();
//# sourceMappingURL=index.js.map