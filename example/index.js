/*!
 * DataSync Content Store Filesystem
 * copyright (c) Contentstack LLC
 * MIT Licensed
 */

const contentConnector = require('../dist')
const assetConnector = require('./mock/asset-connector')
const config = require('./mock/config')

let data1 = {
	content_type_uid: 'optimizely',
	action: 'publish',
	locale: 'en-us',
	uid: '***REMOVED***',
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
	locale: 'es-es',
	uid: '***REMOVED***',
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
	},
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

let asset_data = {
	content_type_uid: '_assets',
	action: 'publish',
	publish_queue_uid: '***REMOVED***',
	locale: 'fr-fr',
	uid: '***REMOVED***',
	data: {
		uid: '***REMOVED***',
		created_at: '2018-06-19T12:06:38.066Z',
		updated_at: '2018-06-19T12:06:38.066Z',
		created_by: '***REMOVED***',
		updated_by: '***REMOVED***',
		content_type: 'image/jpeg',
		file_size: '14552',
		tags: [],
		filename: 'Teilchenmodell_Flüssigkeit.png',
		url:
		 '***REMOVED***',
		ACL: {},
		is_dir: false,
		_version: 1,
		title: 'blog2.jpg',
		force_load: false,
		content_type_uid: '_assets' }
}

let ct = {
		content_type_uid: '_content_types',
		data: {
			title: 'youtube',
			youtube_test: 'KMDRAmBceYw',
			tags: [],
			locale: 'en-us',
			uid: 'optimizely',
			created_by: '***REMOVED***',
			updated_by: '***REMOVED***',
			created_at: '2018-08-01T13:03:13.527Z',
			updated_at: '2018-10-24T07:17:45.654Z',
			ACL: {},
			_version: 7,
			content_type_uid: 'content_type'
		},
		uid: 'optimizely'
}

let data3 = {
	content_type_uid: 'youtube_test_new',
	locale: 'en-us',
	uid: '***REMOVED***',
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

return assetConnector.start(config)
	.then(assetConnector => {
		return contentConnector.start(assetConnector, config)
	})
	.then((connector) => {
		console.log("app started sucessfully!!")
		connector.publish(data1).then(()=>{
			console.log("data1")
		}).then(()=>{
			connector.publish(data2).then(()=>{
				console.log("data2")
			}).then(()=>{
				connector.publish(asset_data).then(()=>{
					console.log("asset_data")
				}).then(()=>{
					connector.publish(data3).then(()=>{
						console.log("data3")
					}).then(()=>{
						connector.delete(ct).then(()=>{
							console.log("ct")
						}).catch(console.error)
					}).catch(console.error)
				}).catch(console.error)
			}).catch(console.error)
		}).catch(console.error)
	}).catch(console.error)
	