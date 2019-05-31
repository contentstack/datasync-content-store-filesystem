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
let config;
exports.config = config;
let connector;
/**
 * @description Establish connection to FS db
 * @param  {object} assetConnector Asset store instance
 * @param  {object} configs App config
 */
function start(assetStore, configs) {
    exports.config = config = lodash_1.merge(config_1.defaults, configs);
    connector = new fs_1.FilesystemStore(assetStore, config);
    return Promise.resolve(connector);
}
exports.start = start;
/**
 * @description to get connector instance
 */
function getConnectorInstance() {
    return connector;
}
exports.getConnectorInstance = getConnectorInstance;
function getConfig() {
    return config;
}
exports.getConfig = getConfig;
