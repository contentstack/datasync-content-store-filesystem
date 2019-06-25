/// <reference types="node" />
import { readFile as readFileNative } from 'fs';
export declare const readFile: typeof readFileNative.__promisify__;
export declare const writeFile: Function;
