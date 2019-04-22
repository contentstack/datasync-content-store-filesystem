"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const requiredPublishKeys = ['data', 'locale', 'uid', 'content_type_uid'];
const requiredUnublishKeys = ['data', 'locale', 'uid', 'content_type_uid'];
const requiredEntryAssetDeleteKeys = ['data', 'locale', 'uid', 'content_type_uid'];
const requiredContentTypeDeleteKeys = ['data', 'uid', 'content_type_uid'];
exports.validatePublishedObject = (publishedObject) => {
    requiredPublishKeys.forEach((key) => {
        if (!(publishedObject.hasOwnProperty(key))) {
            throw new Error(`${key} is missing from ${JSON.stringify(publishedObject)}`);
        }
    });
    if (lodash_1.isEmpty(publishedObject.data) || !(lodash_1.isPlainObject(publishedObject.data))) {
        throw new Error(`Publish object.data should be of type plain object and not empty!`);
    }
    if (typeof publishedObject.locale !== 'string' || typeof publishedObject.uid !== 'string' || typeof publishedObject.content_type_uid !== 'string') {
        throw new Error(`Publish object key types do not match expected types!`);
    }
    return;
};
exports.validateUnpublishedObject = (unpublishedObject) => {
    requiredUnublishKeys.forEach((key) => {
        if (!(unpublishedObject.hasOwnProperty(key))) {
            throw new Error(`${key} is missing from ${JSON.stringify(unpublishedObject)}`);
        }
    });
    if (lodash_1.isEmpty(unpublishedObject.data) || !(lodash_1.isPlainObject(unpublishedObject.data))) {
        throw new Error(`Unpublish object.data should be of type plain object and not empty!`);
    }
    if (typeof unpublishedObject.locale !== 'string' || typeof unpublishedObject.uid !== 'string' || typeof unpublishedObject.content_type_uid !== 'string') {
        throw new Error(`Unpublish object key types do not match expected types!`);
    }
    return;
};
exports.validateEntryAssetDeletedObject = (deletedObject) => {
    requiredEntryAssetDeleteKeys.forEach((key) => {
        if (!(deletedObject.hasOwnProperty(key))) {
            throw new Error(`${key} is missing from ${JSON.stringify(deletedObject)}`);
        }
    });
    if (lodash_1.isEmpty(deletedObject.data) || !(lodash_1.isPlainObject(deletedObject.data))) {
        throw new Error(`Unpublish object.data should be of type plain object and not empty!`);
    }
    if (typeof deletedObject.locale !== 'string' || typeof deletedObject.uid !== 'string' || typeof deletedObject.content_type_uid !== 'string') {
        throw new Error(`Unpublish object key types do not match expected types!`);
    }
    return;
};
exports.validateContentTypeDeletedObject = (deletedObject) => {
    requiredContentTypeDeleteKeys.forEach((key) => {
        if (!(deletedObject.hasOwnProperty(key))) {
            throw new Error(`${key} is missing from ${JSON.stringify(deletedObject)}`);
        }
    });
    if (lodash_1.isEmpty(deletedObject.data) || !(lodash_1.isPlainObject(deletedObject.data))) {
        throw new Error(`Deleted object.data should be of type plain object and not empty!`);
    }
    if (typeof deletedObject.uid !== 'string' || typeof deletedObject.content_type_uid !== 'string') {
        throw new Error(`Deleted object key types do not match expected types!`);
    }
    return;
};
