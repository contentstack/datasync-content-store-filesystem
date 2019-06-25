"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const util_1 = require("util");
const write_file_atomic_1 = __importDefault(require("write-file-atomic"));
exports.readFile = util_1.promisify(fs_1.readFile);
exports.writeFile = util_1.promisify(write_file_atomic_1.default);
