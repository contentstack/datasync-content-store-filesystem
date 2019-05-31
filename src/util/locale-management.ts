import fs from 'fs';
import mkdirp from 'mkdirp';
import { dirname } from 'path';
import { promisify } from 'util';

const readFile: any = promisify(fs.readFile);

export const readLocales = (path) => {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(path)) {
            return readFile(path, 'utf-8', (error, contents) => {
                if (error) { return reject(error); }
                return resolve(JSON.parse(contents));
            });
        }
        mkdirp(dirname(path));

        return resolve([]);
    });
};
