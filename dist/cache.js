"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("./core");
class Cache {
    constructor(assetStore, config) {
        this.config = config.contentStore;
        this.fs = new core_1.FilesystemStore(assetStore, config);
    }
    connect() {
        return new Promise((resolve, reject) => {
        });
    }
}
