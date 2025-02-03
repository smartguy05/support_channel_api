import {badRequest, internalServerError, ok} from "../helpers/controller-helpers";
import {getCompletion} from "../services/openAi.service";
import {DbAdapter} from "../models/db-adapter.model";
import {ChatCompletionRequest} from "../models/chat-completion-request.model";

exports.post = async (req, res) => {
    try {
        const settings = await DbAdapter.first({ uuid: req.params.uuid });
        if (!settings) {
            badRequest(res, 'No support channel found with that identifier');
            return;
        }
        const request: ChatCompletionRequest = {
            query: req.body.query,
            kbs: settings.kbs,
            max_tokens: settings.max_tokens,
            temperature: settings.temperature,
            model: settings.model,
            max_context_length: settings.max_context_length,
            connectionId: 'test-1'
        }
        const result = await getCompletion(request);
        ok(res, result);
    } catch (e) {
        internalServerError(e);
    }
}