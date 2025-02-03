import {internalServerError, ok} from "../helpers/controller-helpers";
import {DbAdapter} from "../models/db-adapter.model";
import {ChannelConfig} from "../models/channel-config.model";
const { randomUUID } = require('crypto');

exports.get = async (req, res) => {
    try {
        const result = await DbAdapter.find();
        ok(res, result);
    } catch (e) {
        internalServerError(e);
    }
}

exports.find = async (req, res) => {
    try {
        const result = await DbAdapter.find();
        ok(res, result);
    } catch (e) {
        internalServerError(e);
    }
}

exports.post = async (req, res) => {
    try {
        const config: ChannelConfig = req.body;
        let existing = true;
        let newId;
        while (existing) {
            newId = randomUUID();
            existing = !!(await DbAdapter.first({ uuid: newId }));
            if (!existing) {
                config.uuid = newId;
            }
        }
        await DbAdapter.insert(config);
        ok(res, newId);
    } catch (e) {
        internalServerError(e);
    }
}

exports.delete = async (req, res) => {
    try {
        const uuid = req.params.uuid;
        await DbAdapter.delete({ uuid });
        ok(res);
    } catch (e) {
        internalServerError(e);
    }
}