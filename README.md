[![Contentstack](https://www.contentstack.com/docs/static/images/contentstack.png)](https://www.contentstack.com/)
## Contentstack content store filesystem

Contentstack is a headless CMS with an API-first approach. It is a CMS that developers can use to build powerful cross-platform applications in their favorite languages. Build your application frontend, and Contentstack will take care of the rest. [Read More](https://www.contentstack.com/). 

Contentstack provides Webhook listener to get notified when webhook gets triggered. It is build to use along with Contentstack Sync Manager and Contentstack Asset stores and Content stores.

### Prerequisite

You need Node.js version 4.4.7 or later installed to use the Contentstack wehbook listener and register a method which gets called on webhook triggered.

### Usage

```js
const contentConnector =  require('contentstack-content-store-filesystem')
const assetConnector = require('contentstack-asset-store-filesystem')

const config = require(./config) 
let connector

assetConnector.start(config)
.then( assetConnector  => {
	return  contentConnector.start(config, assetConnector)
})
.then( (_connector) => {
	connector = _connector
})
```
### Config

#### 1. type
-   type of storage for storing the contents. By defaults its value is  **filesystem**


#### 2. base_dir:
-   file location to store contents. By defaults its value is  **./_contents**
