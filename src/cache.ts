import nedb from 'nedb'
import { FilesystemStore } from './core'

class Cache {
  private config: any
  private fs: FilesystemStore

  constructor(assetStore, config) {
    this.config = config.contentStore
    this.fs = new FilesystemStore(assetStore, config)
  }

  private connect() {
    return new Promise((resolve, reject) => {
      
    })
  }
}