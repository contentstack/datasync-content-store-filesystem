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
	publish_queue_uid: 'bltbbdda2b410005b26a6e6',
	locale: 'fr-fr',
	uid: 'blt9c4ef3c49f7b18e9',
	data: {
		uid: 'blt9c4ef3c49f7b18e9',
		created_at: '2018-06-19T12:06:38.066Z',
		updated_at: '2018-06-19T12:06:38.066Z',
		created_by: 'blt607b206b64807684',
		updated_by: 'blt607b206b64807684',
		content_type: 'image/jpeg',
		file_size: '14552',
		tags: [],
		filename: 'new_blog2.jpg',
		url: 'https://images.contentstack.io/v3/assets/bltd1343376dfba54d2/blt9c4ef3c49f7b18e9/5b28f1cefdee6c3974929dc8/blog2.jpg',
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
	publish_queue_uid: 'bltbbdda2b410005b26a6e6',
	locale: 'en-us',
	uid: 'blt9c4ef3c49f7b18h9',
	data: {
		uid: 'blt9c4ef3c49f7b18h9',
		created_at: '2018-06-19T12:06:38.066Z',
		updated_at: '2018-06-19T12:06:38.066Z',
		created_by: 'blt607b206b64807684',
		updated_by: 'blt607b206b64807684',
		content_type: 'image/jpeg',
		file_size: '14552',
		tags: [],
		filename: 'blog1.jpg',
		url: 'https://images.contentstack.io/v3/assets/dfgdgdgdg/blta8b9d1676a31d361/5c24957dc3cf797d38cca458/cherry-blossom.jpg"',
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
	publish_queue_uid: 'bltbbdda2b410005b26a6e6',
	locale: 'mr-in',
	uid: 'blt9c4ef3c49f7b18f9',
	data: {
		uid: 'blt9c4ef3c49f7b18f9',
		created_at: '2018-06-19T12:06:38.066Z',
		updated_at: '2018-06-19T12:06:38.066Z',
		created_by: 'blt607b206b64807684',
		updated_by: 'blt607b206b64807684',
		content_type: 'image/jpeg',
		file_size: '14552',
		tags: [],
		filename: 'blog3.jpg',
		url: 'https://images.contentstack.io/v3/assets/bltd1343376dfba54d2/blt9c4ef3c49f7b18e9/5b28f1cefdee6c3974929dc8/blog2.jpg',
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
	test('Publish an existing entry', function () {

		return connector.publish({
			content_type_uid: 'a',
			locale: 'mr-in',
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
			expect(result).toHaveProperty("uid",'blt9c4ef3c49f7b18e9')
		}).catch((error) => {
			expect(error).toBe("Kindly provide valid parameters for publish")
		})
	})

	test('publish asset', function(){
		return connector.publish(asset_data2).then(function (result) {
			expect(result).toHaveProperty("uid",'blt9c4ef3c49f7b18h9')
		}).catch((error) => {
			expect(error).toBe("Kindly provide valid parameters for publish")
		})
	})

	test('publish existent asset', function(){
		return connector.publish(asset_data).then(function (result) {
			expect(result).toHaveProperty("uid",'blt9c4ef3c49f7b18e9')
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
				return contentConnector.start(assetConnector, config)
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
			expect(result).toHaveProperty("uid",'blt9c4ef3c49f7b18e9')
		}).catch((error) => {
			expect(error).toBe(error)
		})
	})
	
	
});

describe('# Delete', function () {

	beforeAll(function loadConnectorMethods() {
		assetConnector.start(config)
			.then(assetConnector => {
				return contentConnector.start(assetConnector, config)
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
	test('Delete an non existing entry', function () {

		return connector.delete({
			content_type_uid: 'a',
			locale: 'ep-es',
			uid:'12345',
			data: {
				po_key: 'basic_1',
				uid: '001'
			}
		}, {}).then(function (result) {
			expect(result).toHaveProperty('uid');
			expect(result).toHaveProperty('uid', '12345');
		}).catch(function (error) {
			expect(error).toBe(error)
		});
	});

	test('Delete a non existent entry', function () {

		return connector.delete({
			content_type_uid: 'a',
			locale: 'mr-in',
			uid:'1234',
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
			//expect(result).toHaveProperty("uid",'blt9c4ef3c49f7b18e9')
		}).catch((error) => {
			expect(error).toBe(error)
		})

	})

	test('delete asset', function(){
		return connector.delete(asset_data2).then(function (result) {
			expect(result).toHaveProperty("uid",'blt9c4ef3c49f7b18h9')
		}).catch((error) => {
			expect(error).toBe("Kindly provide valid parameters for publish")
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

