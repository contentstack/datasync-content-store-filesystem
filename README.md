
[![Contentstack](https://www.contentstack.com/docs/static/images/contentstack.png)](https://www.contentstack.com/)

  

Contentstack is a headless CMS with an API-first approach. It is a CMS that developers can use to build powerful cross-platform applications in their favorite languages. Build your application frontend, and Contentstack will take care of the rest. [Read More](https://www.contentstack.com/).

  
  
  
  

  
  

## Contentstack DataSync Content Store Filesystem

  Contentstack DataSync lets you sync your Contentstack data with your database, enabling you to save data locally and serve content directly from your database. It is a combination of four powerful modules that is [DataSync Webhook Listener](https://github.com/contentstack/webhook-listener), [DataSync Manager](https://github.com/contentstack/datasync-manager), [DataSync Asset Store Filesystem](https://github.com/contentstack/datasync-asset-store-filesystem), DataSync Content Store — [Filesystem](https://github.com/contentstack/datasync-content-store-filesystem) and [MongoDB](https://github.com/contentstack/datasync-content-store-mongodb).

This module is basically a Filesystem database where the Sync Manager stores the most recent version of content. When the Sync Manager syncs with the server or any other device where the content is updated, it fetches that content and places it in the Content Store Filesystem.

  

## Prerequisite

 - Node.js 8+  
 - Contentstack Data Sync Asset Store.

  

## Usage

```js
const  assetStore = require('@contentstack/datasync-asset-store-filesystem')
const  contentStore = require('@contentstack/datasync-content-store-filesystem')// <<--
const  listener = require('@contentstack/webhook-listener')
const  syncManager = require('@contentstack/datasync-manager')
const  config = require('./config')

syncManager.setAssetStore(assetStore) 
syncManager.setContentStore(contentStore)// Sets required asset store to sync manager.
syncManager.setListener(listener)
syncManager.setConfig(config)

syncManager.start()
.then(() => {
	console.log('Contentstack sync started successfully!')
})
.catch(console.error)

```

  

## Configuration

  

Here is the config table for the module:

  

|Property | DataType|Default|Description
|--|--|--|--|
| content-store-filesystem.baseDir|string |./_contents |**Optional**. The location of the file for storing the contents|

  
  
  

  


  

### Further Reading

-  [Getting started with Contentstack DataSync](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync)
-  [Contentstack DataSync](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync/configuration-files-for-contentstack-datasync) doc lists the configuration for different modules

  

### Support and Feature requests

  

If you have any issues working with the library, please file an issue [here](https://github.com/contentstack/datasync-content-store-filesystem/issues) at Github.

  

You can send us an e-mail at [support@contentstack.com](mailto:support@contentstack.com) if you have any support or feature requests. Our support team is available 24/7 on the intercom. You can always get in touch and give us an opportunity to serve you better!

  

### License
This repository is published under the [MIT license](LICENSE).