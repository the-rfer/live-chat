import express from 'express';
import cors from 'cors';
import config from './config.js';

const app = express();

app.use(cors(config.cors));

app.use(express.json());

// token extractor for auth

// methods here

app.get('/', (_req, res) => {
    res.send('Server is running!');
});

// error handler as last resort

export default app;
