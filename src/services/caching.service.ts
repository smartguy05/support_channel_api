import {ChatCompletionMessageParam} from "openai/src/resources/chat/completions";
const redis = require('redis');

export class RedisClient {
    private static client;
    
    public static async init() {
        this.client = redis.createClient();
        await this.client.connect();

        this.client.on('error', (err) => {
            console.error('Redis client error', err);
        });        
    }

    public static async readFromCache (connectionId): Promise<Array<ChatCompletionMessageParam>> {
        const result = await this.client.get(connectionId, (err, messages) => {
            if (!!messages && !err) {
                return messages;
            }
            return [];
        });
        return JSON.parse(result);
    }

    public static async saveToCache(connectionId: string, messages: Array<ChatCompletionMessageParam>): Promise<void> {
        await this.client.set(connectionId, JSON.stringify(messages), {
            EX: process.env.MESSAGE_CACHE_TIMEOUT,
            NX: true
        });
    }
}
