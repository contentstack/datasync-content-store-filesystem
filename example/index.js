/*!
* contentstack-sync-content-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/

const contentConnector = require('../dist')
const assetConnector = require('./mock/asset-connector')
const config = require('./mock/config')
const winston = require('winston')

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.json(),
	defaultMeta: {service: 'user-service'},
	transports: [
		//
		// - Write to all logs with level `info` and below to `combined.log` 
		// - Write all logs error (and below) to `error.log`.
		//
		new winston.transports.File({ filename: 'error.log', level: 'error' }),
		new winston.transports.File({ filename: 'combined.log' })
	]
})

contentConnector.setLogger(logger)
let data1 = {
	content_type_uid: 'optimizely',
	action: 'publish',
	publish_queue_uid: '***REMOVED***',
	locale: 'en-us',
	data: {
		title: 'optimizely',
		url: '/optimizely',
		optimizely: ['editor', 'Designer'],
		tags: [],
		locale: 'en-us',
		uid: '***REMOVED***',
		created_by: '***REMOVED***',
		updated_by: '***REMOVED***',
		created_at: '2018-10-09T10:11:19.788Z',
		updated_at: '2018-10-09T10:11:19.788Z',
		ACL: {},
		_version: 1,
		content_type_uid: 'optimizely'
	},
	content_type: {
		created_at: '2018-10-09T10:04:44.948Z',
		updated_at: '2018-10-09T10:04:59.633Z',
		title: 'optimizely',
		uid: 'optimizely',
		_version: 2,
		inbuilt_class: false,
		schema: [{
				display_name: 'Title',
				uid: 'title',
				data_type: 'text',
				mandatory: true,
				unique: true,
				field_metadata: {
					_default: true
				},
				multiple: false
			},
			{
				display_name: 'URL',
				uid: 'url',
				data_type: 'text',
				mandatory: true,
				field_metadata: {
					_default: true
				},
				multiple: false,
				unique: false
			},
			{
				display_name: 'optimizely',
				extension_uid: '***REMOVED***',
				field_metadata: {
					extension: true
				},
				uid: 'optimizely',
				data_type: 'text',
				multiple: true,
				mandatory: false,
				unique: false
			}
		],
		last_activity: {},
		maintain_revisions: true,
		description: '',
		options: {
			is_page: true,
			singleton: true,
			title: 'title',
			sub_title: []
		},
		abilities: {
			get_one_object: true,
			get_all_objects: true,
			create_object: true,
			update_object: true,
			delete_object: true,
			delete_all_objects: true
		},
		DEFAULT_ACL: [{
				k: 'others',
				v: {
					read: false,
					create: false
				}
			},
			{
				k: 'users.***REMOVED***',
				v: {
					read: true,
					sub_acl: {
						read: true
					}
				}
			}
		],
		SYS_ACL: {
			roles: []
		}
	}
}

let data2 = {
	content_type_uid: 'youtube_test',
	action: 'publish',
	publish_queue_uid: '***REMOVED***',
	locale: 'es-es',
	data: {
		title: 'youtube',
		youtube_test: 'KMDRAmBceYw',
		tags: [],
		locale: 'en-us',
		uid: '***REMOVED***',
		created_by: '***REMOVED***',
		updated_by: '***REMOVED***',
		created_at: '2018-08-01T13:03:13.527Z',
		updated_at: '2018-10-24T07:17:45.654Z',
		ACL: {},
		_version: 7,
		content_type_uid: 'youtube_test'
	}
	,
	content_type: {
		created_at: '2018-08-01T13:01:04.263Z',
		updated_at: '2018-08-01T13:02:53.793Z',
		title: 'youtube-test',
		uid: 'youtube_test',
		_version: 3,
		inbuilt_class: false,
		schema: [{
				display_name: 'Title',
				uid: 'title',
				data_type: 'text',
				mandatory: true,
				unique: true,
				field_metadata: {
					_default: true
				},
				multiple: false
			},
			{
				display_name: 'youtube-test',
				extension_uid: '***REMOVED***',
				field_metadata: {
					extension: true
				},
				uid: 'youtube_test',
				data_type: 'text',
				multiple: false,
				mandatory: false,
				unique: false
			}
		],
		last_activity: {
			environments: [{
					uid: '***REMOVED***',
					details: [{
						locale: 'en-us',
						time: '2018-12-07T09:30:16.851Z'
					}]
				},
				{
					uid: '***REMOVED***',
					details: [{
						locale: 'en-us',
						time: '2018-11-28T12:32:27.603Z'
					}]
				}
			]
		},
		maintain_revisions: true,
		description: '',
		options: {
			is_page: false,
			singleton: false,
			title: 'title',
			sub_title: []
		},
		abilities: {
			get_one_object: true,
			get_all_objects: true,
			create_object: true,
			update_object: true,
			delete_object: true,
			delete_all_objects: true
		},
		DEFAULT_ACL: [{
				k: 'others',
				v: {
					read: false,
					create: false
				}
			},
			{
				k: 'users.***REMOVED***',
				v: {
					read: true,
					sub_acl: {
						read: true
					}
				}
			}
		]
	}
}

let data3 = {
	content_type_uid: 'youtube_test_new',
	action: 'publish',
	publish_queue_uid: '***REMOVED***',
	locale: 'en-us',
	data: {
		title: 'youtube',
		youtube_test: 'KMDRAmBceYw',
		tags: [],
		locale: 'en-us',
		uid: '***REMOVED***',
		created_by: '***REMOVED***',
		updated_by: '***REMOVED***',
		created_at: '2018-08-01T13:03:13.527Z',
		updated_at: '2018-10-24T07:17:45.654Z',
		ACL: {},
		_version: 7,
		content_type_uid: 'youtube_test_new'
	},
	content_type: {
		created_at: '2018-08-01T13:01:04.263Z',
		updated_at: '2018-08-01T13:02:53.793Z',
		title: 'youtube-test-new',
		uid: 'youtube_test_new',
		_version: 3,
		inbuilt_class: false,
		schema: [{
				display_name: 'Title',
				uid: 'title',
				data_type: 'text',
				mandatory: true,
				unique: true,
				field_metadata: {
					_default: true
				},
				multiple: false
			},
			{
				display_name: 'youtube-test',
				extension_uid: '***REMOVED***',
				field_metadata: {
					extension: true
				},
				uid: 'youtube_test',
				data_type: 'text',
				multiple: false,
				mandatory: false,
				unique: false
			}
		],
		last_activity: {
			environments: [{
					uid: '***REMOVED***',
					details: [{
						locale: 'en-us',
						time: '2018-12-07T09:30:16.851Z'
					}]
				},
				{
					uid: '***REMOVED***',
					details: [{
						locale: 'en-us',
						time: '2018-11-28T12:32:27.603Z'
					}]
				}
			]
		},
		maintain_revisions: true,
		description: '',
		options: {
			is_page: false,
			singleton: false,
			title: 'title',
			sub_title: []
		},
		abilities: {
			get_one_object: true,
			get_all_objects: true,
			create_object: true,
			update_object: true,
			delete_object: true,
			delete_all_objects: true
		},
		DEFAULT_ACL: [{
				k: 'others',
				v: {
					read: false,
					create: false
				}
			},
			{
				k: 'users.***REMOVED***',
				v: {
					read: true,
					sub_acl: {
						read: true
					}
				}
			}
		]
	}
}


assetConnector.start(config)
.then( assetConnector => {
    return contentConnector.start(assetConnector, config)
})
.then( (connector) => {
	console.log("app started sucessfully!!")
	connector.publish(data1)
	connector.publish(data3)
	connector.publish(data2)
	setTimeout(()=>{connector.unpublish(data1)}, 500)
	setTimeout(()=>{connector.delete(data2)}, 1500)
})
.catch((error) =>{
	console.error(error)
})