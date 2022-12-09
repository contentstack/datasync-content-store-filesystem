"use strict";
/*!
* Contentstack Filesystem Content Store
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = exports.getFilesystemClient = exports.getConfig = exports.setConfig = exports.setAssetConnector = void 0;
const lodash_1 = require("lodash");
const config_1 = require("./config");
const fs_1 = require("./fs");
const validations_1 = require("./util/validations");
let appConfig = {};
let assetConnectorInstance;
let fsClient;
const setAssetConnector = (instance) => {
    assetConnectorInstance = instance;
};
exports.setAssetConnector = setAssetConnector;
const setConfig = (config) => {
    appConfig = config;
};
exports.setConfig = setConfig;
const getConfig = () => {
    return appConfig;
};
exports.getConfig = getConfig;
const getFilesystemClient = () => {
    return fsClient;
};
exports.getFilesystemClient = getFilesystemClient;
const start = (connector, config) => {
    return new Promise((resolve, reject) => {
        try {
            appConfig = (0, lodash_1.merge)(config_1.config, appConfig, config);
            (0, validations_1.validateConfig)(appConfig);
            assetConnectorInstance = connector || assetConnectorInstance;
            (0, validations_1.validateAssetConnectorInstance)(assetConnectorInstance);
            fsClient = new fs_1.FilesystemStore(assetConnectorInstance, appConfig);
            return resolve(fsClient);
        }
        catch (error) {
            return reject(error);
        }
    });
};
exports.start = start;
