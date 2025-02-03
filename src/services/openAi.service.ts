import OpenAI from 'openai';
import {ChatCompletionMessageParam} from "openai/src/resources/chat/completions";
import {RedisClient} from "./caching.service";

const axios = require('axios');

export async function getCompletion(query: string, collection: string, model: string, connectionId: string, max_tokens = 50, temperature = 0.7): Promise<string> {
    // get messages
    const messages = await RedisClient.readFromCache(connectionId) ?? [];
    const client = new OpenAI({
        apiKey: process.env.OPEN_AI_KEY
    });
    const response = await client.chat.completions.create({
        messages: await buildMessageList(query, collection, messages),
        model,
        max_tokens,
        temperature
    });
    // cache messages
    messages.push(response.choices[0].message);
    RedisClient.saveToCache(connectionId, messages);
    console.log('Response:', response.choices[0].message.content.trim());
    return response.choices[0].message.content.trim();
}

export async function streamCompletion(model: string, messages: Array<ChatCompletionMessageParam>, max_tokens = 200, temperature = 0.7) {
    try {
        const client = new OpenAI({
            apiKey: process.env.OPEN_AI_KEY
        });
        const stream = await client.chat.completions.create({
            messages,
            model,
            max_tokens,
            temperature,
            stream: true
        });
        // return stream
    } catch (error) {
        console.error('Error while fetching completion:', error.response ? error.response.data : error.message);
    }
}

async function kbLookup(query: string, collection: string): Promise<string[]> {
    try {
        return (await axios.post(
            `${process.env.KB_API_URL}/search/${collection}`,
            { text: query },
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        ))?.data ?? [];
    } catch (error) {
        console.error('Error making the request:', error);
    }
}

async function buildMessageList(query: string, collection: string, messages: Array<ChatCompletionMessageParam>): Promise<Array<ChatCompletionMessageParam>> {
    messages ??= [];
    if (!messages?.length || !messages.find(f => f.role == "system")) {
        // kb lookup
        const docs = await kbLookup(query, collection);
        
        // build system prompt with documents
        let prompt = process.env.SYSTEM_PROMPT;
        prompt += `\n
            <Context>: \n
            ${(docs).join('\n')}
            </Context>
        `;
        messages.unshift({ role: "system", content: prompt });
        messages.push({ role: "user", content: query });
    } else {
        // todo: check if getting too long and trim some older messages if necessary
        // todo: check if need more context, right now get it anyway
        // kb lookup
        const docs = await kbLookup(query, collection);

        // build system prompt with documents
        const prompt = `\n
            <Context>: \n
            ${(docs).join('\n')}
            </Context>
        `;
        messages.unshift({ role: "system", content: prompt });
        messages.push({ role: "user", content: query });
    }
    
    return messages;
}