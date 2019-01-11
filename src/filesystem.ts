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
import sift from 'sift'
import {  uniq, cloneDeep, map } from 'lodash'
import { join } from 'path'
import { OptionalParams, PublishParams, UnpublishParams, DeleteParams, DeleteContentType, FindParams, DeleteAssetFolder } from './util/interfaces'
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

  public delete (query: DeleteParams) {
   debug("delete called with", query)
    return new Promises(async (resolve, reject) => {
      try {
        if (this.validate(query)) {
          if (!query.hasOwnProperty(defs.locale) && query.content_type_uid === defs.ct.schema) {
            return this.deleteContentType(<DeleteContentType>query)
              .then(resolve)
              .catch(reject)
          } else if (!query.hasOwnProperty(defs.locale) && query.content_type_uid === defs.ct.asset_folder) {
            return this.deleteAssetFolder(<DeleteAssetFolder>query)
              .then(resolve)
              .catch(reject)
          } else {
            const locale: string = query.locale
            const content_type_uid: string = query.content_type_uid
            const type: string = (content_type_uid === defs.ct.asset) ? defs.asset: defs.entry
            const pth: string = (content_type_uid === defs.ct.asset) ? join('./_contents', locale,'assets', defs.asset_file): join('./_contents', locale, 'data', content_type_uid, defs.index)
            const d_objs: any[] = (query.data instanceof Array) ? query.data: [query.data]
            const response: any = {}
            if (!fs.existsSync(pth)) {
              d_objs.forEach(obj => {
                response[obj.po_key] = render(msg.success.delete, { type: type })
              })
              return resolve(response)
            } else {
              return fs.readFileP(pth).then(data => {
                let objs = JSON.parse(data)
                if (type === defs.asset) {
                  return Promises.map(d_objs, asset => {
                    let flag = false
                    for (let i = 0; i < objs.length; i++) {
                      if (objs[i].uid === asset.uid) {
                        response[asset.po_key] = render(msg.success.delete, { type: type })
                        flag = true
                        objs.splice(i, 1)
                        break
                      }
                    }
                    if (!flag) {
                      response[asset.po_key] = render(msg.success.delete, { type: type })
                    }
                    return this.asset_mgmt.delete(asset, locale)
                      .then(() => {
                        return
                      })
                      .catch(error => {
                        throw error
                      })
                  }, { concurrency: 2}).then(() => {
                    return fs.writeFileP(pth, JSON.stringify(objs))
                      .then(() => {
                        log.info("asset deleted sucessfully", query.data)
                        debug("asset deleted sucessfully",query.data)
                        resolve(response)
                      })
                      .catch(error => {
                        log.error(msg.error.delete)
                        debug(msg.error.delete)
                        return reject(render(msg.error.delete, { type: type, error: error }))
                      })
                  }).catch(reject)
                } else {
                  d_objs.forEach(async obj => {
                    let flag = false
                    for (let i = 0; i < objs.length; i++) {
                      if (objs[i].uid === obj.uid) {
                        response[obj.po_key] = render(msg.success.delete, { type: type })
                        flag = true
                        objs.splice(i, 1)
                        break
                      }
                    }
                    if (!flag) {
                      response[obj.po_key] = render(msg.success.delete, { type: type })
                    }
                  })
                  return fs.writeFileP(pth, JSON.stringify(objs))
                    .then(() => {
                      log.info("Entry deleted sucessfully",query.data)
                      debug("Entry deleted sucessfully",query.data)
                      resolve(response)
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
                d_objs.forEach(obj => {
                  response[obj.po_key] = render(msg.error.delete, { type: type, error: error })
                })
                return reject(response)
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

  private deleteAssetFolder(query: DeleteAssetFolder) {
    debug("delete asset folder called with ", query)
    return new Promises((resolve, reject) => {
    
        return new Promises((_resolve, _reject) => {
          
          return this.find({
            content_type_uid: defs.ct.asset,
            locale: query.data.locale,
            query: {
              parent_uid: query.data.uid
            }
          }, {}).then(result => {
            return this.delete({
              content_type_uid: defs.ct.asset,
              locale: query.data.locale,
              data: result.assets
            }).then(_resolve).catch(_reject)
          }).catch(_reject)
        }
     
      , { concurrency: 1 }).then(() => {
        log.info("deleted asset folder successfully", query.data)
        return resolve({
          [query.po_key]: render(msg.success.delete, {type: defs.asset_folder})
        })
      }).catch(reject)
    })
  }

  public find (query: FindParams, options: OptionalParams, _context?: any, reference_depth?: any) {
    return new Promises((resolve, reject) => {
      if (this.validate(query) && typeof options === 'object' && query.hasOwnProperty(defs.locale) && typeof defs.locale === 'string') {
        const references: any = options.references || {}
        const parent_id: string | undefined = options.parent_id || undefined

        const content_type_uid: string = query.content_type_uid
        const locale: string = query.locale
        const type: string = (content_type_uid === defs.ct.asset) ? defs.asset: defs.entry
        const key: string = (content_type_uid === defs.ct.asset) ? defs.assets: defs.entries
        const count_only: boolean | undefined = query.count_only
        const remove: boolean = query.remove || false
        const _query: any | undefined = (query.query) ? query.query : undefined
        const include_reference: boolean = (query.include_reference) ? query.include_reference : false
        // const specific_reference: boolean = (query.reference) ? query.reference : undefined
        const include_count: boolean = (query.include_count) ? query.include_count : false

        let context: any = _context || {}

        // if (typeof reference_depth === 'object') {
        //   reference_depth.current_depth++
        // } else if (query.reference_depth || this.default_reference_depth) {
        //   reference_depth = {
        //     defined_depth: (query.reference_depth) ? query.reference_depth : this.default_reference_depth,
        //     current_depth: 0
        //   }
        // }

        if (typeof context === 'object' && context[content_type_uid]) {
          let data, _data
          if (_query) {
            data = sift(_query, context[content_type_uid])
          } else {
            data = context[content_type_uid]
          }
          if (data && data.length && (typeof reference_depth === 'undefined' || (reference_depth.current_depth <= reference_depth.defined_depth))) {
            _data = cloneDeep(data)
            if (!remove) {
              _data = {
                [key]: _data
              }
            }
            // if (include_reference) {
            //   if (parent_id) {
            //     references[parent_id] = references[parent_id] || []
            //     references[parent_id] = uniq(references[parent_id].concat(map(_data, 'uid')))
            //   }
            //   return this.includeReferences(_data, locale, references, parent_id, context, reference_depth)
            //     .then(resolve)
            //     .catch(reject)
            // } else if (specific_reference) {
            //   return this.includeSpecificReferences(_data, locale, context)
            //     .then(result => resolve(result))
            //     .catch(error => reject(error))
            //} else {
              return resolve(_data)
            //}
          } else {
            return resolve(_data)
          }
        } else {
          const pth: string = (content_type_uid === defs.ct.asset) ? 
          join('./_contents', locale,'assets',defs.asset_file): 
            join('./_contents', locale, 'data', content_type_uid, defs.index)
          const _sort: any | undefined = (options.sort) ? options.sort: undefined
          let sort_key: string, sort_operator: number
          if (_sort) {
            sort_key = Object.keys(_sort)[0]
            sort_operator = _sort[sort_key]
          }

          if (fs.existsSync(pth)) {
            return fs.readFileP(pth).then(content => {
              let data = JSON.parse(content)
              // keep a context of the data found during this iteration!
              context = {
                [content_type_uid]: cloneDeep(data)
              }
              if (_query) {
                data = sift(_query, data)
              }
              if (count_only) {
                return resolve({
                  count: data.length
                })
              }
              // if (_sort) {
              //   data = sort(data, sort_key, sort_operator)
              // }
              if (!remove) {
                data = {
                  [key]: data
                }
              }

              if (include_count) {
                data.count = (remove) ? data.length : data[key].length
              }
              if (key !== defs.assets && include_reference) {
                if (parent_id) {
                  references[parent_id] = references[parent_id] || []
                  references[parent_id] = uniq(references[parent_id].concat(map(((remove) ? data : data[key]), 'uid')))
                }
                // return this.includeReferences(data, locale, references, parent_id, context, reference_depth)
                //   .then(resolve)
                 // .catch(reject)
              // } else if (specific_reference) {
              //   return this.includeSpecificReferences(_entries, locale, context)
              //     .then(result => resolve(result))
              //     .catch(error => reject(error))
              } else {
                return resolve(data)
              }
            }).catch(error => reject(render(msg.error.find, { type: type, error: error })))
          } else {
            if (remove) {
              return resolve([])
            } else {
              return resolve({ [key]: [] })
            }
          }
        }
      } else {
        return reject(msg.error.invalid_find_keys)
      }
    })
  }

  public findOne (query: FindParams) {
    return new Promises((resolve, reject) => {
      const type: string = (query.content_type_uid === defs.ct.asset) ? defs.asset: defs.entry
      const key: string = (query.content_type_uid === defs.ct.asset) ? defs.assets: defs.entries
      return this.find(query, {}).then(result => {
        const response: any = {}
        if (result[key].length >= 1) {
          response[type] = result[key][0]
        } else {
          response[type] = {}
        }
        return resolve(response)
      }).catch(reject)
    })
  }

  

 }

export = FileSystem