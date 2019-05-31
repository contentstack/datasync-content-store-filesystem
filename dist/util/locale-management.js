"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const mkdirp_1 = __importDefault(require("mkdirp"));
const path_1 = require("path");
const util_1 = require("util");
const readFile = util_1.promisify(fs_1.default.readFile);
exports.readLocales = (path) => {
    return new Promise((resolve, reject) => {
        if (fs_1.default.existsSync(path)) {
            return readFile(path, 'utf-8', (error, contents) => {
                if (error) {
                    return reject(error);
                }
                return resolve(JSON.parse(contents));
            });
        }
        mkdirp_1.default(path_1.dirname(path));
        return resolve([]);
    });
};
