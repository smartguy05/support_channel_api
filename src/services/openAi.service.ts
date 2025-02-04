import OpenAI from 'openai';
import {ChatCompletionMessageParam} from "openai/src/resources/chat/completions";
import {RedisClient} from "./caching.service";
import {ChatCompletionRequest} from "../models/chat-completion-request.model";
import {KbConfig} from "../models/kb-config.model";

const axios = require('axios');

export async function getCompletion(request: ChatCompletionRequest): Promise<string> {
    // get messages
    const messages = await RedisClient.readFromCache(request.connectionId) ?? [];
    const client = new OpenAI({
        apiKey: process.env.OPEN_AI_KEY
    });
    const response = await client.chat.completions.create({
        messages: await buildMessageList(request.query, request.system_prompt, request.kbs, messages),
        model: request.model,
        max_tokens: request.max_tokens,
        temperature: request.temperature
    });
    // cache messages
    messages.push(response.choices[0].message);
    await RedisClient.saveToCache(request.connectionId, messages);
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

async function kbLookup(query: string, collection: string, api_key: string): Promise<string[]> {
    try {
        return (await axios.post(
            `${process.env.KB_API_URL}/search/${collection}`,
            { text: query },
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${api_key}`
                },
            }
        ))?.data ?? [];
    } catch (error) {
        console.error('Error making the request:', error);
    }
}

async function buildMessageList(query: string, systemPrompt: string, kbCollections: KbConfig[], messages: Array<ChatCompletionMessageParam>): Promise<Array<ChatCompletionMessageParam>> {
    messages ??= [];
    if (!messages?.length || !messages.find(f => f.role == "system")) {
        // kb lookup
        let promises: Promise<string[]>[] = [];
        kbCollections.forEach(collection => {
            promises.push(kbLookup(query, collection.name, collection.api_key));
        });
        
        const values = await Promise.all(promises);
        const docs: string[] = [].concat(...values);
        
        // build system prompt with documents
        let prompt = systemPrompt;
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
        let promises: Promise<string[]>[] = [];
        await kbCollections.forEach(collection => {
            promises.push(kbLookup(query, collection.name, collection.api_key));
        });

        const values = await Promise.all(promises);
        const docs: string[] = [].concat(...values);

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