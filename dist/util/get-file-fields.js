"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileFieldPaths = void 0;
exports.getFileFieldPaths = (schema, fileFields = [], parent = '') => {
    var _a, _b;
    for (const field of schema.schema) {
        if (field.data_type === 'file') {
            fileFields.push(`${parent ? `${parent}.` : ''}${field.uid}`);
        }
        if ((_a = field.schema) === null || _a === void 0 ? void 0 : _a.length) {
            exports.getFileFieldPaths(field, fileFields, `${parent ? `${parent}.` : ''}${field.uid}`);
        }
        else if ((_b = field.blocks) === null || _b === void 0 ? void 0 : _b.length) {
            for (const block of field.blocks) {
                exports.getFileFieldPaths(block, fileFields, `${parent ? `${parent}.` : ''}${field.uid}`);
            }
        }
    }
    return fileFields;
};
