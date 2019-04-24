/*!
* contentstack-sync-content-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/

const contentConnector = require('../dist')
const assetConnector = require('./mock/asset-connector')
const config = require('./mock/config')



let data1 = {
	content_type_uid: 'optimizely',
	action: 'publish',
	publish_queue_uid: 'blt67729365be66c4af1b77',
	locale: 'en-us',
	data: {
		title: 'optimizely',
		url: '/optimizely',
		optimizely: ['editor', 'Designer'],
		tags: [],
		locale: 'en-us',
		uid: 'ablt93da1f4f2f59ec5c',
		created_by: 'blt607b206b64807684',
		updated_by: 'blt607b206b64807684',
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
				extension_uid: 'blt856887a740542cac',
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
				k: 'users.blt6c40372d2acfcabc',
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
	publish_queue_uid: 'bltbbdda2b410005b26a6e6',
	locale: 'es-es',
	data: {
		title: 'youtube',
		youtube_test: 'KMDRAmBceYw',
		tags: [],
		locale: 'en-us',
		uid: 'bltaf3fc89493975a43',
		created_by: 'blt607b206b64807684',
		updated_by: 'blt7d7118ed69e5742a',
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
				extension_uid: 'blte872df3cde2db0fd',
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
					uid: 'blt1b589a1e350e4032',
					details: [{
						locale: 'en-us',
						time: '2018-12-07T09:30:16.851Z'
					}]
				},
				{
					uid: 'blt7b98b4cea4baeebf',
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
				k: 'users.blt6c40372d2acfcabc',
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
	publish_queue_uid: 'bltbbdda2b410005b26a6e6',
	locale: 'en-us',
	data: {
		title: 'youtube',
		youtube_test: 'KMDRAmBceYw',
		tags: [],
		locale: 'en-us',
		uid: 'bltaf3fc89493975a43',
		created_by: 'blt607b206b64807684',
		updated_by: 'blt7d7118ed69e5742a',
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
				extension_uid: 'blte872df3cde2db0fd',
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
					uid: 'blt1b589a1e350e4032',
					details: [{
						locale: 'en-us',
						time: '2018-12-07T09:30:16.851Z'
					}]
				},
				{
					uid: 'blt7b98b4cea4baeebf',
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
				k: 'users.blt6c40372d2acfcabc',
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

let data = {
    "event_at": "2019-01-27T15:24:04.714Z",
    "content_type_uid": "product",
    "type": "entry_published",
    "data": {
        "title": "Amazon_Echo_Black",
        "url": "/product/Amazon_Echo_Black",
        "image_thumbnails": {
            "reference_to": "_assets",
            "values": ["blt014341962c1fe699", "blt9d2e87df7258f392", "blt720f608708b52157"]
        },
        "product_title": "abc Amazon Echo - Black!",
        "price_title": "Listed Price",
        "price": "$199",
        "product_description": "Plays all your music from Amazon Music, Spotify, Pandora, iHeartRadio, TuneIn, and more using just your voice Fills the room with immersive, 360º omni-directional audio",
        "category": {
            "reference_to": "categories",
            "values": ["bltd0f51996c27a61cc"]
        },
        "tags": [],
        "locale": "en-us",
        "uid": "acdblt862fc4f0862a900b",
        "created_by": "blt161e02c9fffa78f6",
        "updated_by": "blt161e02c9fffa78f6",
        "created_at": "2018-07-17T05:16:47.957Z",
        "updated_at": "2019-01-27T15:23:57.417Z",
        "_version": 3,
        "related_products": {
            "reference_to": "product",
            "values": ["bltda7f6b9f42df9cfb", "blt14c458b6028429d6"]
        },
        "publish_details": {
            "environment": "blt1b06d5cbcc2c1e8c",
            "locale": "en-us",
            "time": "2019-01-27T15:24:04.714Z",
            "user": "blt161e02c9fffa78f6"
        }
    },
    "action": "publish",
    "locale": "en-us",
    "uid": "acdblt862fc4f0862a900b"
} 
data2 = {
    "event_at": "2019-01-27T15:24:04.714Z",
    "content_type_uid": "product",
    "type": "entry_published",
    "data": {
        "title": "Amazon_Echo_Black",
        "url": "/product/Amazon_Echo_Black",
        "image_thumbnails": {
            "reference_to": "_assets",
            "values": ["blt014341962c1fe699", "blt9d2e87df7258f392", "blt720f608708b52157"]
        },
        "product_title": "abc Amazon Echo - Black!",
        "price_title": "Listed Price",
        "price": "$199",
        "product_description": "Plays all your music from Amazon Music, Spotify, Pandora, iHeartRadio, TuneIn, and more using just your voice Fills the room with immersive, 360º omni-directional audio",
        "category": {
            "reference_to": "categories",
            "values": ["bltd0f51996c27a61cc"]
        },
        "tags": [],
        "locale": "mr-in",
        "uid": "blt862fc4f0862a900bas",
        "created_by": "blt161e02c9fffa78f6",
        "updated_by": "blt161e02c9fffa78f6",
        "created_at": "2018-07-17T05:16:47.957Z",
        "updated_at": "2019-01-27T15:23:57.417Z",
        "_version": 3,
        "related_products": {
            "reference_to": "product",
            "values": ["bltda7f6b9f42df9cfb", "blt14c458b6028429d6"]
        },
        "publish_details": {
            "environment": "blt1b06d5cbcc2c1e8c",
            "locale": "en-us",
            "time": "2019-01-27T15:24:04.714Z",
            "user": "blt161e02c9fffa78f6"
        }
    },
    "action": "publish",
    "locale": "mr-in",
    "uid": "blt862fc4f0862a900bas"
}
 data3 = {
    "event_at": "2019-01-27T15:24:04.714Z",
    "content_type_uid": "product",
    "type": "entry_published",
    "data": {
        "title": "Amazon_Echo_Black",
        "url": "/product/Amazon_Echo_Black",
        "image_thumbnails": {
            "reference_to": "_assets",
            "values": ["blt014341962c1fe699", "blt9d2e87df7258f392", "blt720f608708b52157"]
        },
        "product_title": "abc Amazon Echo - Black!",
        "price_title": "Listed Price",
        "price": "$199",
        "product_description": "Plays all your music from Amazon Music, Spotify, Pandora, iHeartRadio, TuneIn, and more using just your voice Fills the room with immersive, 360º omni-directional audio",
        "category": {
            "reference_to": "categories",
            "values": ["bltd0f51996c27a61cc"]
        },
        "tags": [],
        "locale": "mr-in",
        "uid": "blt862fc4f0862a900basmit",
        "created_by": "blt161e02c9fffa78f6",
        "updated_by": "blt161e02c9fffa78f6",
        "created_at": "2018-07-17T05:16:47.957Z",
        "updated_at": "2019-01-27T15:23:57.417Z",
        "_version": 3,
        "related_products": {
            "reference_to": "product",
            "values": ["bltda7f6b9f42df9cfb", "blt14c458b6028429d6"]
        },
        "publish_details": {
            "environment": "blt1b06d5cbcc2c1e8c",
            "locale": "en-us",
            "time": "2019-01-27T15:24:04.714Z",
            "user": "blt161e02c9fffa78f6"
        }
    },
    "action": "publish",
    "locale": "mr-in",
    "uid": "blt862fc4f0862a900basmit"
}


assetConnector.start(config)
.then( assetConnector => {
    return contentConnector.start(assetConnector, config)
})
.then(async (connector) => {
	console.log("app started sucessfully!!")
    // console.time("label")
	// for(let i=0 ; i<200000; i++){
	// 	data.uid= 'blt'+i;
	// 	data.data.uid ='blt'+i
	// 	//data.data.title= data.data.title + data.uid
	// 	await connector.publish(data)
    //     console.log("published",i)
    //     if(i === 199999){
	// 		console.timeEnd("label")
	// 		// setTimeout(()=>{
	// 		// 	console.log("called")
	// 		// }, 6000)
    //     }
	// }
	connector.publish(data).then().catch()
    // connector.publish(data).then(
	// 	connector.publish(data1).then(
	// 		connector.publish(data2).then().catch(console.error)
	// 	).catch(console.error)
	// ).catch(console.error)
    // connector.publish(data1).then(console.log).catch(console.error)
    // connector.publish(data2).then(console.log).catch(console.error)
    // connector.publish(data3).then(console.log).catch(console.error)
	
})
.catch((error) =>{
	console.error(error)
})
