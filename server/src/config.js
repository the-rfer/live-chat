import dotenv from 'dotenv';
dotenv.config();

const ENV = process.env.NODE_ENV;

if (!['dev', 'prod'].includes(ENV)) {
    throw new Error(
        `⚠️ Invalid NODE_ENV value: "${ENV}". Use "dev" or "prod".`
    );
}

const baseConfig = {
    env: ENV,
    port: process.env.PORT,
};

const configs = {
    dev: {
        dbUrl: process.env.DATABASE_URL,
        logLevel: 'debug',
        cors: { origin: '*' },
    },
    prod: {
        dbUrl: process.env.DATABASE_URL,
        logLevel: 'info',
        cors: { origin: process.env.CORS_ORIGIN?.split(',') || [] },
    },
};

export default { ...baseConfig, ...configs[ENV] };
