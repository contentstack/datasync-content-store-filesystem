/*!
* contentstack-sync-content-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/
"use strict"
import { debug as Debug } from "debug";
import { Promise as Promises } from 'bluebird';
import * as rimraf from 'rimraf'
import * as mkdirp from 'mkdirp'
import * as Mustache from 'mustache'
import * as filesystem from 'fs'
import { join } from 'path'
import { PublishParams, UnpublishParams, DeleteParams, DeleteContentType } from './util/interfaces'
import { defs } from './util/key-definitions'
import { messages as msg } from './util/messages'
import {setLogger, logger as log} from "./logger";
const render = Mustache.render
const fs: any = Promises.promisifyAll(filesystem, { suffix: 'P' })
const debug = Debug("content-sotre-filesystem");
class FileSystem {
  private asset_mgmt: any
  private config: any

  constructor (config, assetConnector) {
    setLogger()
    this.config = config 
    this.asset_mgmt = assetConnector
  }

  private validate (data: any) {
    if (typeof data !== 'object' && typeof data.data === 'object') {
      return false
    }
    if (typeof data.content_type_uid !== 'string') {
      return false
    }
    return true
  }
  /**
   * @description to publish the retrieved data from filesystem
   * @param  {PublishParams} data: data for publish
   */
  public publish (data: PublishParams) {
    debug("Publish called with", data)
    return new Promises(async (resolve, reject) => {
      if (this.validate(data) && typeof defs.locale === 'string') {
        const locale: string = (data.locale) ? data.locale: 'en-us'
        const content_type_uid: string = data.content_type_uid
        const response = {}
        const type = (content_type_uid === "_assets") ? "asset" : "entry"
        const pth: string = (content_type_uid === "_assets") ? join('./_contents', locale,'assets'): join('./_contents', locale, 'data', content_type_uid)
        const entity_pth: string = (content_type_uid === "_assets") ? join(pth, "_assets.json"): join(pth, "index.json")
        let contents: any = []
        if (!fs.existsSync(pth)) {
          debug("new path created as", pth)
          log.info(`${pth} is created`)
          mkdirp.sync(pth, '0755')
        }

        if (fs.existsSync(entity_pth)) {
          contents = await fs.readFileP(entity_pth)
          contents = JSON.parse(contents)
        }

        if (type === defs.asset) {
            return new Promises((_resolve, _reject) => {
              let flag = false
              for (let i = 0; i < contents.length; i++) {
                if (contents[i].uid === data.data.uid) {
                  contents[i] = data.data
                  flag = true
                  break
                }
              }
              if (!flag) {
                contents.push(data.data)
              }
        
              return this.asset_mgmt.download(data.data, locale).then(_resolve).catch(_reject)
            })
        .then(() => {
            return fs.writeFileP(entity_pth, JSON.stringify(contents)).then(() => {
              log.info("Asset published successfullly", data.data)
              return resolve(response)
            }).catch(reject)
          }).catch(reject)
        } 
        else {
            let flag = false
            for (let i = 0; i < contents.length; i++) {
              if (contents[i].uid === data.data.uid) {
                flag = true
                contents[i] = data.data
                break
              }
            }
            if (!flag) {
              contents.push(data.data)
            }
           
          const schema_pth = join(pth, defs.schema_file)
          return fs.writeFileP(schema_pth, JSON.stringify(data.content_type)).then(() => {
            return fs.writeFileP(entity_pth, JSON.stringify(contents))
              .then(() => {
                log.info("Entry published sucessfully", data.data)
                debug("Entry published sucessfully")
                return resolve(response)
              })
              .catch(error => {
                console.error(error)
                log.error(msg.error.publish)
                debug(msg.error.publish)
                return reject(render(msg.error.publish, { type: type }))
              })
          }).catch(console.error)
        }
      } else {
        log.error(msg.error.invalid_publish_keys)
        debug(msg.error.invalid_publish_keys)
        return reject(msg.error.invalid_publish_keys)
      }
    })
  }

/**
   * @description to unpublish the retrieved data from filesystem
   * @param  {UnpublishParams} data: data for unpublish
   */
  public unpublish (data: UnpublishParams) {
    debug("unpublish called with", data)
    return new Promises((resolve, reject) => {
      try {
        if (this.validate(data) && typeof data.locale === 'string') {
          const locale: string = data.locale
          const content_type_uid: string = data.content_type_uid
          const type: string = (content_type_uid === defs.ct.asset) ? defs.asset: defs.entry
          const pth: string = (content_type_uid === defs.ct.asset) ? join('./_contents', locale,'assets',defs.asset_file): join('./_contents', locale, 'data', content_type_uid, defs.index)
          if (!fs.existsSync(pth)) {
            return resolve(data.data)
          } else {
            return fs.readFileP(pth).then(contents => {
              let objs = JSON.parse(contents)
              if (type === defs.asset) {
                  let flag = false
                  for (let i = 0; i < objs.length; i++) {
                    if (objs[i].uid === data.data.uid) {
                      flag = true
                      objs.splice(i, 1)
                      break
                    }
                  }
                  return this.asset_mgmt.unpublish(data.data, locale)
                    .then(() => {
                      
                      return
                    })
                    .catch(error => {
                      throw error
                    })
                .then(() => {
                  return fs.writeFileP(pth, JSON.stringify(objs))
                    .then( () => {
                      debug("asset unpublished succefully", data.data)
                      log.info("asset unpublished succefully", data.data)
                      resolve(data.data) 
                    })
                    .catch(error => {
                      log.error(msg.error.unpublish);
                      return reject(render(msg.error.unpublish, { type: type, error: error }))
                    })
                }).catch(reject)
              } else {
                  let flag = false
                  for (let i = 0; i < objs.length; i++) {
                    if (objs[i].uid === data.data.uid) {
                      flag = true
                      objs.splice(i, 1)
                      break
                    }
                  } 
                return fs.writeFileP(pth, JSON.stringify(objs))
                  .then(() => {
                    debug("Entry unpublished successfully")
                    log.info("Entry unpublished successfully", data.data)
                    resolve(data.data)
                  })
                  .catch(error => {
                    debug(msg.error.unpublish)
                    log.error(msg.error.unpublish)
                    return reject(render(msg.error.unpublish, { type: type, error: error }))
                  })
              }
            }).catch(error => {
              log.error(render(msg.error.unpublish, { type: type, error: error }));
              return resolve(data.data)
            })
          }
        } else {
          debug(msg.error.invalid_unpublish_keys)
          log.error(msg.error.invalid_unpublish_keys)
          return reject(msg.error.invalid_unpublish_keys)
        }
      } catch (error) {
        debug(msg.error.unpublish)
        log.error(msg.error.unpublish)
        return reject(render(msg.error.unpublish, { type: 'Object', error: error }))
      }
    })
  }
/**
   * @description to delete the data from filesystem
   * @param  {DeleteParams} query: data for delete
   */
  public delete (query: DeleteParams) {
   debug("delete called with", query)
    return new Promises(async (resolve, reject) => {
      try {
        if (this.validate(query)) {
          if (!query.hasOwnProperty(defs.locale) && query.content_type_uid === defs.ct.schema) {
            return this.deleteContentType(<DeleteContentType>query)
              .then(resolve)
              .catch(reject)
          }
           else {
            const locale: string = query.locale
            const content_type_uid: string = query.content_type_uid
            const type: string = (content_type_uid === defs.ct.asset) ? defs.asset: defs.entry
            const pth: string = (content_type_uid === defs.ct.asset) ? join('./_contents', locale,'assets', defs.asset_file): join('./_contents', locale, 'data', content_type_uid, defs.index)
            if (!fs.existsSync(pth)) {
              return resolve()
            } else {
              return fs.readFileP(pth).then(data => {
                let objs = JSON.parse(data)
                if (type === defs.asset) {
                    let flag = false
                    for (let i = 0; i < objs.length; i++) {
                      if (objs[i].uid === query.data.uid) {
                        flag = true
                        objs.splice(i, 1)
                        break
                      }
                    }
                    return this.asset_mgmt.delete(query.data, locale)
                      .then(() => {
                        return
                      })
                      .catch(error => {
                        throw error
                      })
                  .then(() => {
                    return fs.writeFileP(pth, JSON.stringify(objs))
                      .then(() => {
                        log.info("asset deleted sucessfully", query.data)
                        debug("asset deleted sucessfully",query.data)
                        resolve()
                      })
                      .catch(error => {
                        log.error(msg.error.delete)
                        debug(msg.error.delete)
                        return reject(render(msg.error.delete, { type: type, error: error }))
                      })
                  }).catch(reject)
                } else {
                    let flag = false
                    for (let i = 0; i < objs.length; i++) {
                      if (objs[i].uid === query.data.uid) {
                        flag = true
                        objs.splice(i, 1)
                        break
                      }
                    }
                  return fs.writeFileP(pth, JSON.stringify(objs))
                    .then(() => {
                      log.info("Entry deleted sucessfully",query.data)
                      debug("Entry deleted sucessfully",query.data)
                      resolve()
                    })
                    .catch(error => {
                      log.error(msg.error.delete)
                      debug(msg.error.delete)
                      console.error(error)
                      return reject(render(msg.error.delete, { type: type, error: error }))
                    })
                }
              }).catch(error => {
                console.error(error)
                return reject()
              })
            }
          }
        } else {
          log.error(msg.error.invalid_delete_keys)
          debug(msg.error.invalid_delete_keys)
          return reject(msg.error.invalid_delete_keys)
        }
      } catch (error) {
        log.error(msg.error.delete)
        debug(msg.error.delete)
        return reject(render(msg.error.delete, { type: 'Object', error: error }))
      }
    })
  }
/**
   * @description to delete content type the data from filesystem
   * @param  {DeleteContentType} query: data for  delete content type
   */
  private deleteContentType(query: DeleteContentType) {
    debug("Delete content type called for ", query)
    return new Promises((resolve, reject) => {
      try {
       
          const pth = join('./_contents', query.data.locale, 'data', query.data.uid)
          
          if (fs.existsSync(pth)) {
            rimraf.sync(pth)
          }
       
        log.info(msg.success.delete, query.data)
        return resolve({
          [query.po_key]: render(msg.success.delete, { type: defs.content_type})
        })
      } catch (error) {
        log.error("failed to delete content type due to", error);
        return reject(error)
      }
    })
  }
 }

export = FileSystem