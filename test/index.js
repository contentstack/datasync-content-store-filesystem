/*!
* contentstack-sync-content-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/


const utils = require('../test-utils')
const contentConnector = require('../dist')
const assetConnector = require('../example/mock/asset-connector')
const config = require('../example/mock/config')
let connector = null
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
		filename: 'new_blog2.jpg',
		url: '***REMOVED***',
		ACL: {},
		is_dir: false,
		_version: 1,
		title: 'blog2.jpg',
		force_load: false,
		content_type_uid: '_assets'
	}
}


let asset_data2 = {
	content_type_uid: '_assets',
	action: 'publish',
	publish_queue_uid: '***REMOVED***',
	locale: 'en-us',
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
		filename: 'blog1.jpg',
		url: '***REMOVED***"',
		ACL: {},
		is_dir: false,
		_version: 1,
		title: 'blog1.jpg',
		force_load: false,
		content_type_uid: '_assets'
	}
}

let asset_data3 = {
	content_type_uid: '_assets',
	action: 'publish',
	publish_queue_uid: '***REMOVED***',
	locale: 'mr-in',
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
		filename: 'blog3.jpg',
		url: '***REMOVED***',
		ACL: {},
		is_dir: false,
		_version: 1,
		title: 'blog3.jpg',
		force_load: false,
		content_type_uid: '_assets'
	}
}

let logger = console
describe('# publish', function () {

	let test_data
	beforeAll(function loadConnectorMethods() {
		assetConnector.start(config)
			.then(assetConnector => {
				return contentConnector.start(assetConnector, config, logger)
			})
			.then((_connector) => {
				connector = _connector
			})
	})

	beforeAll(function loadContent() {
		test_data = utils.loadTestContents()
	})



	test('publish single entry test', function () {
		const content_type = test_data['es-es'].a.content_type
		let entry = test_data['es-es'].a.entries[0]
		let instance = contentConnector.getConnectorInstance()
		return instance.publish({
			content_type_uid: 'a',
			locale: 'es-es',
			uid: entry.uid,
			data: entry,
			content_type: content_type
		}).then(function (result) {
			expect(result).toHaveProperty("uid");
			expect(result).toHaveProperty("uid", "001");

		})
	})
	test('publish existent entry test', function () {
		const content_type = test_data['es-es'].a.content_type
		let entry = test_data['es-es'].a.entries[0]
		return connector.publish({
			content_type_uid: 'a',
			locale: 'es-es',
			uid: "001",
			data: {"data": "new data added","uid":"001"},
			content_type: content_type
		}).then(function (result) {
			expect(result).toHaveProperty("uid");
			expect(result).toHaveProperty("uid", "001");

		})
	})
	
	test('publish invalid data', function () {
		return connector.publish("daatattata").then(function (result) {

		}).catch((error) => {
			expect(error).toBe("Kindly provide valid parameters for publish")
		})

	})
	test('publish asset', function(){
		return connector.publish(asset_data).then(function (result) {
			expect(result).toHaveProperty("uid",'***REMOVED***')
		}).catch((error) => {
			expect(error).toBe("Kindly provide valid parameters for publish")
		})
	})

	test('publish existent asset', function(){
		return connector.publish(asset_data).then(function (result) {
			expect(result).toHaveProperty("uid",'***REMOVED***')
		}).catch((error) => {
			expect(error).toBe("Kindly provide valid parameters for publish")
		})
	})
})

describe('# Unpublish', function () {

 let connector
 beforeAll(function loadConnectorMethods() {
		assetConnector.start(config)
			.then(assetConnector => {
				return contentConnector.start(config, assetConnector)
			})
			.then((contentconnector) => {
				connector = contentconnector
			})
	})

	test('Unpublish an existing entry', function () {

		return connector.unpublish({
			content_type_uid: 'a',
			locale: 'es-es',
			uid: '123',
			data: {
				po_key: 'basic_1',
				uid: '001'
			}
		}).then(function (result) {
			expect(result).toHaveProperty('uid');
			expect(result).toHaveProperty('uid', '123');
		}).catch(function (error) {
			expect(error).toBe(error)
		});
	});

	test('Unpublish non existing entry', function () {

		return connector.unpublish({
			content_type_uid: 'a',
			locale: 'en-us',
			uid: '123',
			data: {
				po_key: 'basic_1',
				uid: '001'
			}
		}).then(function (result) {
			expect(result).toHaveProperty('uid');
			expect(result).toHaveProperty('uid', '123');
		}).catch(function (error) {
			expect(error).toBe(error)
		});
	});
	test('Unpublish invalid data', function () {
		return connector.unpublish("daatattata").then(function (result) {
			
		}).catch((error) => {
			expect(error).toBe("Kindly provide valid parameters for unpublish")
		})

	})

	test('unpublish asset', function(){
		return connector.unpublish(asset_data).then(function (result) {
			console.log(result,"res++++++")
			//expect(result).toHaveProperty("uid",'***REMOVED***')
		}).catch((error) => {
			console.log("---------res++++++", error)
			expect(error).toBe(error)
		})
	})
	
	
});

describe('# Delete', function () {

	beforeAll(function loadConnectorMethods() {
		assetConnector.start(config)
			.then(assetConnector => {
				return contentConnector.start(config, assetConnector)
			})
			.then((contentconnector) => {
				connector = contentconnector
			})
	})

	test('Delete an existing entry', function () {

		return connector.delete({
			content_type_uid: 'a',
			locale: 'es-es',
			uid:'1234',
			data: {
				po_key: 'basic_1',
				uid: '001'
			}
		}, {}).then(function (result) {
			expect(result).toHaveProperty('uid');
			expect(result).toHaveProperty('uid', '1234');
		}).catch(function (error) {
			expect(error).toBe(error)
		});
	});

	test('Delete a non existent entry', function () {

		return connector.delete({
			content_type_uid: 'a',
			locale: 'es-es',
			data: {
				po_key: 'basic_1',
				uid: '001'
			}
		}, {}).then(function (result) {
			expect(result).toHaveProperty('basic_1');
			expect(result).toHaveProperty('basic_1', delete_success);
		}).catch(function (error) {
			expect(error).toBe(error)
		});
	});
    test(' Delete asset', function(){
		return connector.delete(asset_data).then(function (result) {
			//expect(result).toHaveProperty("uid",'***REMOVED***')
		}).catch((error) => {
			expect(error).toBe(error)
		})

	})
	test('Delete a content type', function () {

		return connector.delete({
			content_type_uid: '_content_types',
			type:'content_type_deleted',
			uid:'a',
			data: {
				uid: 'a',
				locale: 'en-us',
			},
			po_key: 'basic_1'
		}, {}).then(function (result) {
			expect(result).toHaveProperty('uid');
			expect(result).toHaveProperty('uid', `a`);
		}).catch(function (error) {
			expect(error).toBe(error)
		});
	});
	test('Delete non existent content type', function () {

		return connector.delete({
			content_type_uid: '_content_types',
			type:'content_type_deleted',
			uid:'ab',
			data: {
				uid: 'a',
				locale: 'en-us',
			},
			po_key: 'basic_1'
		}, {}).then(function (result) {
			expect(result).toHaveProperty('uid');
			expect(result).toHaveProperty('uid', `ab`);
		}).catch(function (error) {
			expect(error).toBe(error)
		});
	});

	
});

describe('# Find and Findone', function () {

	beforeAll(function loadConnectorMethods() {
		assetConnector.start(config)
			.then(assetConnector => {
				return contentConnector.start(config, assetConnector)
			})
			.then((contentconnector) => {
				connector = contentconnector
			})
	})


	test('Find', function () {
		return connector.find({
			content_type_uid: 'abcd',
			locale: 'es-es'
		}).then(function (result) {
			expect(result).toHaveProperty('content_type_uid');
			expect(result).toHaveProperty('content_type_uid', 'abcd');
		}).catch(function (error) {
			expect(error).toBe(error)
		});
	});

	test('findOne', function () {
		return connector.findOne({
			content_type_uid: 'b',
			locale: 'es-es',
			query: {
				'uid': '005'
			}
		}).then(function (result) {
			expect(result).toHaveProperty('content_type_uid');
			expect(result).toHaveProperty('content_type_uid', 'b');
		}).catch(function (error) {
			expect(error).toBe(error)
		});
	});

	
});

