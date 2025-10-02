import express from 'express';
import cors from 'cors';

const app = express();

app.use(
    cors({
        origin: ['http://localhost:3000'],
        credentials: true,
    })
);

app.get('/health', (_, res) => {
    res.send('App is running OK');
});

app.use(express.json());

export default app;
