import { Server } from './Server';

const server = new Server({
    port: Number(process.env.PORT ?? 10000),
});

server.start();
