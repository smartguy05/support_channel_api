declare namespace NodeJS {
    interface ProcessEnv {
        PORT: number;
        SWAGGER_ENABLED: boolean;
        KB_API_URL: string;
        KB_API_KEY: string;
        OPEN_AI_KEY: string;
        SYSTEM_PROMPT: string;
        MESSAGE_CACHE_TIMEOUT: number;
    }
}