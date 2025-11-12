import { createServer } from 'node:http';
import { ChatSocket } from './socket';
import { connectRedis } from './lib/redis';
import app from './server';

const port = process.env.PORT || 3333;
const server = createServer(app);

ChatSocket(server);

(async () => {
    await connectRedis();
    server.listen(port, () => {
        console.log(`🚀 Server is running on http://localhost:${port}`);
        console.log(`🔌 Socket.IO is listening for connections`);
    });
})();
