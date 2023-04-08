import { Server } from './Server';

const server = new Server({
    port: Number(process.env.PORT ?? 3001),
});

server.start();
