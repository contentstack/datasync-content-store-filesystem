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
 * @param  {object} config App config
 */
function start(assetStore, config) {
    config = lodash_1.merge(config_1.defaults, config);
    const contentStore = new fs_1.FilesystemStore(assetStore, config);
    return Promise.resolve(contentStore);
}
exports.start = start;
