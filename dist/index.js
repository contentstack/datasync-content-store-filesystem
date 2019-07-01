"use strict";
/*!
 * DataSync Content Store Filesystem
 * Copyright (c) Contentstack LLC
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const config_1 = require("./config");
const fs_1 = require("./fs");
let appConfig;
let connector;
exports.getConfig = () => {
    return appConfig;
};
exports.setConfig = (config) => {
    appConfig = config;
};
/**
 * @description Establish connection to FS db
 * @param {Object} assetConnector Asset store instance
 * @param {Object} configs App config
 */
function start(assetStore, configs) {
    appConfig = lodash_1.merge(config_1.defaults, appConfig, configs);
    connector = new fs_1.FilesystemStore(assetStore, appConfig);
    return Promise.resolve(connector);
}
exports.start = start;
/**
 * @description to get connector instance
 */
function getConnector() {
    return connector;
}
exports.getConnector = getConnector;
