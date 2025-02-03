import {KbConfig} from "./kb-config.model";

export class ChannelConfig {
    public uuid: string;
    public model: string;
    public max_tokens: number;
    public temperature: number;
    public max_context_length: number;
    public kbs: KbConfig[];
    public name: string;
}