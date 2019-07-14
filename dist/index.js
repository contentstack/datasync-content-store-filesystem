"use strict";
/*!
* Contentstack Filesystem Content Store
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const config_1 = require("./config");
const fs_1 = require("./fs");
const validations_1 = require("./util/validations");
let appConfig = {};
let assetConnectorInstance;
let fsClient;
exports.setAssetConnector = (instance) => {
    assetConnectorInstance = instance;
};
exports.setConfig = (config) => {
    appConfig = config;
};
exports.getConfig = () => {
    return appConfig;
};
exports.getFilesystemClient = () => {
    return fsClient;
};
exports.start = (connector, config) => {
    return new Promise((resolve, reject) => {
        try {
            appConfig = lodash_1.merge(config_1.config, appConfig, config);
            validations_1.validateConfig(appConfig);
            assetConnectorInstance = connector || assetConnectorInstance;
            validations_1.validateAssetConnectorInstance(assetConnectorInstance);
            fsClient = new fs_1.FilesystemStore(assetConnectorInstance, appConfig);
            return resolve(fsClient);
        }
        catch (error) {
            return reject(error);
        }
    });
};
