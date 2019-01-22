"use strict";
/*!
* contentstack-sync-content-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("debug");
const lodash_1 = require("lodash");
const default_1 = require("./default");
const filesystem_1 = __importDefault(require("./filesystem"));
const logger_1 = require("./util/logger");
exports.setLogger = logger_1.setLogger;
let connector;
const debug = debug_1.debug('content-sotre-filesystem');
/**
 * @description to start the content connector
 * @param  {} assetConnector: asset connector instance
 * @param  {} config?: config
 * @param  {} logger?: logger instance
 */
function start(assetConnector, config, customLogger) {
    if (customLogger) {
        logger_1.setLogger(customLogger);
    }
    return new Promise((resolve, reject) => {
        try {
            if (config) {
                config = lodash_1.merge(default_1.defaultConfig, config);
            }
            connector = new filesystem_1.default(assetConnector, config);
            resolve(connector);
        }
        catch (error) {
            debug('Failed to load content-store due to', error);
            reject(error);
        }
    });
}
exports.start = start;
/**
 * @description to get connector instance
 */
function getConnectorInstance() {
    return connector;
}
exports.getConnectorInstance = getConnectorInstance;
//# sourceMappingURL=index.js.map