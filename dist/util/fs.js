"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFile = exports.readFile = void 0;
const fs_1 = require("fs");
const mkdirp_1 = require("mkdirp");
const path_1 = require("path");
const util_1 = require("util");
const write_file_atomic_1 = __importDefault(require("write-file-atomic"));
const promisifiedReadFile = (0, util_1.promisify)(fs_1.readFile);
const readFile = (path, type = "utf-8") => {
    if ((0, fs_1.existsSync)(path)) {
        return promisifiedReadFile(path, type);
    }
    return Promise.resolve("[]");
};
exports.readFile = readFile;
const writeFile = (path, data) => {
    return new Promise((resolve, reject) => {
        try {
            if (!(0, fs_1.existsSync)(path)) {
                const pathArr = path.split(path_1.sep);
                pathArr.splice(pathArr.length - 1, 1);
                const folderPath = path_1.join.apply(this, pathArr);
                if (!(0, fs_1.existsSync)(folderPath)) {
                    (0, mkdirp_1.sync)(folderPath);
                }
            }
            return (0, write_file_atomic_1.default)(path, data, (error) => {
                if (error) {
                    return reject(error);
                }
                return resolve("");
            });
        }
        catch (error) {
            return reject(error);
        }
    });
};
exports.writeFile = writeFile;
