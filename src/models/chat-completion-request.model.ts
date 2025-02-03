import {KbConfig} from "./kb-config.model";

export class ChatCompletionRequest {
    public query: string;
    public model: string;
    public connectionId: string;
    public max_tokens = 150;
    public temperature = 0.7;
    public max_context_length = 4000;
    public kbs: KbConfig[];
}
