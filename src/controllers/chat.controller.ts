import {internalServerError, ok} from "../helpers/controller-helpers";
import {getCompletion} from "../services/openAi.service";

exports.post = async (req, res) => {
    try {
        // get collection based on api key
        const body = req.body;
        const result = await getCompletion(body.query, body.collection, body.model, "test-1");
        ok(res, result);
    } catch (e) {
        internalServerError(e);
    }
}