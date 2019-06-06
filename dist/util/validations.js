"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const requiredPublishKeys = ['locale', 'uid', '_content_type_uid'];
const requiredUnublishKeys = ['locale', 'uid', '_content_type_uid'];
const requiredEntryAssetDeleteKeys = ['locale', 'uid', '_content_type_uid'];
const requiredContentTypeDeleteKeys = ['uid', '_content_type_uid'];
exports.validatePublishedObject = (publishedObject) => {
    requiredPublishKeys.forEach((key) => {
        if (!(publishedObject.hasOwnProperty(key))) {
            throw new Error(`${key} is missing from ${JSON.stringify(publishedObject)}`);
        }
    });
    if ((lodash_1.isEmpty(publishedObject)) || !(lodash_1.isPlainObject(publishedObject))) {
        throw new Error(`Publish object.data should be of type plain object and not empty!`);
    }
    if (typeof publishedObject.locale !== 'string' || typeof publishedObject.uid !== 'string' ||
        typeof publishedObject._content_type_uid !== 'string') {
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
    if (lodash_1.isEmpty(unpublishedObject) || !(lodash_1.isPlainObject(unpublishedObject))) {
        throw new Error(`Unpublish object.data should be of type plain object and not empty!`);
    }
    if (typeof unpublishedObject.locale !== 'string' || typeof unpublishedObject.uid !== 'string' ||
        typeof unpublishedObject._content_type_uid !== 'string') {
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
    if (lodash_1.isEmpty(deletedObject) || !(lodash_1.isPlainObject(deletedObject))) {
        throw new Error(`Unpublish object.data should be of type plain object and not empty!`);
    }
    if (typeof deletedObject.locale !== 'string' || typeof deletedObject.uid !== 'string' ||
        typeof deletedObject._content_type_uid !== 'string') {
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
    // if (!(isEmpty(deletedObject.data)) || !(isPlainObject(deletedObject.data))) {
    //   throw new Error(`Deleted object.data should be of type plain object and not empty!`);
    // }
    if (typeof deletedObject.uid !== 'string' || typeof deletedObject._content_type_uid !== 'string') {
        throw new Error(`Deleted object key types do not match expected types!`);
    }
    return;
};
