"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAssetConnectorInstance = exports.validateConfig = exports.validateContentTypeObj = exports.validateContentTypeDeletedObject = exports.validateEntryAssetDeletedObject = exports.validateUnpublishedObject = exports.validatePublishedObject = void 0;
const lodash_1 = require("lodash");
const requiredPublishKeys = ['locale', 'uid', '_content_type_uid'];
const requiredUnublishKeys = ['locale', 'uid', '_content_type_uid'];
const requiredEntryAssetDeleteKeys = ['locale', 'uid', '_content_type_uid'];
const requiredContentTypeDeleteKeys = ['uid', '_content_type_uid'];
exports.validatePublishedObject = (publishedObject) => {
    if ((lodash_1.isEmpty(publishedObject)) || !(lodash_1.isPlainObject(publishedObject))) {
        throw new Error('Publish object should be of type plain object and not empty!');
    }
    requiredPublishKeys.forEach((key) => {
        if (!(publishedObject.hasOwnProperty(key))) {
            throw new Error(`${key} is missing from ${JSON.stringify(publishedObject)}!`);
        }
    });
    if (typeof publishedObject.locale !== 'string' || typeof publishedObject.uid !== 'string' ||
        typeof publishedObject._content_type_uid !== 'string') {
        throw new Error('Publish object keys type do not match expected type!');
    }
    return;
};
exports.validateUnpublishedObject = (unpublishedObject) => {
    if (lodash_1.isEmpty(unpublishedObject) || !(lodash_1.isPlainObject(unpublishedObject))) {
        throw new Error('Unpublish object should be of type plain object and not empty!');
    }
    requiredUnublishKeys.forEach((key) => {
        if (!(unpublishedObject.hasOwnProperty(key))) {
            throw new Error(`${key} is missing from ${JSON.stringify(unpublishedObject)}!`);
        }
    });
    if (typeof unpublishedObject.locale !== 'string' || typeof unpublishedObject.uid !== 'string' ||
        typeof unpublishedObject._content_type_uid !== 'string') {
        throw new Error('Unpublish object keys type do not match expected type!');
    }
    return;
};
exports.validateEntryAssetDeletedObject = (deletedObject) => {
    requiredEntryAssetDeleteKeys.forEach((key) => {
        if (!(deletedObject.hasOwnProperty(key))) {
            throw new Error(`${key} is missing from ${JSON.stringify(deletedObject)}!`);
        }
    });
    if (lodash_1.isEmpty(deletedObject) || !(lodash_1.isPlainObject(deletedObject))) {
        throw new Error('Unpublish object.data should be of type plain object and not empty!');
    }
    if (typeof deletedObject.locale !== 'string' || typeof deletedObject.uid !== 'string' ||
        typeof deletedObject._content_type_uid !== 'string') {
        throw new Error('Unpublish object keys type do not match expected type!');
    }
    return;
};
exports.validateContentTypeDeletedObject = (deletedObject) => {
    if (!deletedObject || typeof deletedObject !== 'object' || deletedObject instanceof Array) {
        throw new Error('Invalid input for content type deletion!');
    }
    requiredContentTypeDeleteKeys.forEach((key) => {
        if (!(deletedObject.hasOwnProperty(key))) {
            throw new Error(`${key} is missing from ${JSON.stringify(deletedObject)}!`);
        }
    });
    if (typeof deletedObject.uid !== 'string' || typeof deletedObject._content_type_uid !== 'string') {
        throw new Error('Input delete object key types do not match expected types!');
    }
    return;
};
exports.validateContentTypeObj = (schema) => {
    requiredPublishKeys.forEach((key) => {
        if (!(schema.hasOwnProperty(key))) {
            throw new Error(`${key} is missing from ${JSON.stringify(schema)}!`);
        }
    });
    if ((lodash_1.isEmpty(schema)) || !(lodash_1.isPlainObject(schema))) {
        throw new Error('Content type object should be of type plain object and not empty!');
    }
    if (typeof schema.locale !== 'string' || typeof schema.uid !== 'string' ||
        typeof schema._content_type_uid !== 'string') {
        throw new Error('Content type object keys type do not match expected type!');
    }
    return;
};
exports.validateConfig = (appConfig) => {
    const contentStore = appConfig.contentStore;
    if (typeof contentStore.baseDir !== 'string' || contentStore.baseDir.length === 0) {
        throw new Error('Content connector baseDir cannot be empty!');
    }
};
exports.validateAssetConnectorInstance = (instance) => {
    const keys = ['download', 'delete', 'unpublish'];
    keys.forEach((fn) => {
        if (!(fn in instance) || typeof instance[fn] !== 'function') {
            throw new Error(`Asset connector ${JSON.stringify(instance)} does not have ${fn}`);
        }
    });
};
