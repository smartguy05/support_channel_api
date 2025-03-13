import {internalServerError, ok} from "../helpers/controller-helpers";
import {DbAdapter} from "../models/db-adapter.model";
import {ChannelConfig} from "../models/channel-config.model";
const { randomUUID } = require('crypto');

exports.get = async (req, res) => {
    try {
        const result = await DbAdapter.find();
        ok(res, result);
    } catch (e) {
        internalServerError(res, e);
    }
}

exports.find = async (req, res) => {
    try {
        const result = await DbAdapter.find();
        ok(res, result);
    } catch (e) {
        internalServerError(res, e);
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
        internalServerError(res, e);
    }
}

exports.put = async (req, res) => {
    try {
        const uuid = req.params.uuid;
        const updateData: ChannelConfig = req.body;

        // Check if the entry exists
        const existingEntry = await DbAdapter.first({ uuid });
        if (!existingEntry) {
            return res.status(404).json({ message: 'Entry not found.' });
        }

        // Perform the update
        await DbAdapter.update({ uuid }, { $set: updateData});

        // Retrieve the updated entry
        const updatedEntry = await DbAdapter.first({ uuid });

        // Respond with the updated entry
        ok(res, updatedEntry);
    } catch (e) {
        internalServerError(res, e);
    }
}

exports.delete = async (req, res) => {
    try {
        const uuid = req.params.uuid;
        await DbAdapter.delete({ uuid });
        ok(res);
    } catch (e) {
        internalServerError(res, e);
    }
}