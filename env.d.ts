declare namespace NodeJS {
    interface ProcessEnv {
        PORT: number;
        SWAGGER_ENABLED: boolean;
        KB_API_URL: string;
        OPEN_AI_API_URL: string;
        OPEN_AI_KEY: string;
        MESSAGE_CACHE_TIMEOUT: number;
        MONGO_DB_URL: string;
        MONGO_DB_SCHEMA: string;
        MONGO_DB_PASSWORD: string;
    }
}