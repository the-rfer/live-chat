import { createServer } from 'node:http';
import { ChatSocket } from './routes/socket';
import app from './server';

const port = process.env.PORT || 3333;
const server = createServer(app);

ChatSocket(server);

server.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
    console.log(`🔌 Socket.IO is listening for connections`);
});
