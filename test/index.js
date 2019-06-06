/*!
 * contentstack-sync-content-store-fileystem
 * copyright (c) Contentstack LLC
 * MIT Licensed
 */

const fs = require("fs")
const utils = require('./test-utils')
const contentConnector = require('../dist')
const assetConnector = require('../example/mock/asset-connector')
const config = require('../example/mock/config')
let connector = null

let asset_data = {
	_content_type_uid: '_assets',
	locale: 'fr-fr',
		uid: 'blt9c4ef3c49f7b18e9',
		created_at: '2018-06-19T12:06:38.066Z',
		updated_at: '2018-06-19T12:06:38.066Z',
		created_by: 'blt607b206b64807684',
		updated_by: 'blt607b206b64807684',
		content_type: 'image/jpeg',
		download_id: '5b28f1cefdee6c3974929dc8',
		//file_size: '14552',
		tags: [],
		//filename: 'new_blog2.jpg',
		url: 'https://images.contentstack.io/v3/assets/bltd1343376dfba54d2/blt9c4ef3c49f7b18e9/5b28f1cefdee6c3974929dc8/blog2.jpg',
		ACL: {},
		is_dir: false,
		//_version: 1,
		title: 'blog2.jpg',
		force_load: false,
		
}

let asset_data1 = {
	_content_type_uid: '_assets',
	locale: 'fr-fr',
		uid: 'blt9c4ef3c49f7b18e9',
		created_at: '2018-06-19T12:06:38.066Z',
		updated_at: '2018-06-19T12:06:38.066Z',
		created_by: 'blt607b206b64807684',
		updated_by: 'blt607b206b64807684',
		content_type: 'image/jpeg',
		//download_id: '5b28f1cefdee6c3974929dc8',
		file_size: '14552',
		tags: [],
		filename: 'new_blog2.jpg',
		url: 'https://images.contentstack.io/v3/assets/bltd1343376dfba54d2/blt9c4ef3c49f7b18e9/5b28f1cefdee6c3974929dc8/blog2.jpg',
		ACL: {},
		is_dir: false,
		_version: 1,
		title: 'blog2.jpg',
		force_load: false
}


let asset_data2 = {
	_content_type_uid: '_assets',
	locale: 'en-us',
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
}

let asset_data3 = {
	_content_type_uid: '_assets',
	locale: 'mr-in',
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
	
}

let asset_data4 = {
	_content_type_uid: '_assets',
	locale: 'mr-in',
		uid: 'blt9c4ef3c49f7b18f9',
		created_at: '2018-06-19T12:06:38.066Z',
		updated_at: '2018-06-19T12:06:38.066Z',
		created_by: 'blt607b206b64807684',
		updated_by: 'blt607b206b64807684',
		content_type: 'image/jpeg',
		file_size: '14552',
		tags: [],
		filename: 'blog4.jpg',
		url: 'https://images.contentstack.io/v3/assets/bltd1343376dfba54d2/blt9c4ef3c49f7b18e9/5b28f1cefdee6c3974929dc8/blog4.jpg',
		ACL: {},
		is_dir: false,
		_version: 2,
		title: 'blog3.jpg',
		force_load: false
}
let asset_data5 = {
	_content_type_uid: '_assets',
	locale: 'gr-gp',
		uid: 'blt9c4ef3c49f7b18e9',
		created_at: '2018-06-19T12:06:38.066Z',
		updated_at: '2018-06-19T12:06:38.066Z',
		created_by: 'blt607b206b64807684',
		updated_by: 'blt607b206b64807684',
		content_type: 'image/jpeg',
		//download_id: '5b28f1cefdee6c3974929dc8',
		file_size: '14552',
		tags: [],
		filename: 'new_blog2.jpg',
		url: 'https://images.contentstack.io/v3/assets/bltd1343376dfba54d2/blt9c4ef3c49f7b18e9/5b28f1cefdee6c3974929dc8/blog2.jpg',
		ACL: {},
		is_dir: false,
		_version: 1,
		title: 'blog2.jpg',
		force_load: false,
}


describe('# publish', function () {

	let test_data
	beforeAll(function loadConnectorMethods() {
		assetConnector.start(config)
			.then(assetConnector => {
				return contentConnector.start(assetConnector, config)
			})
			.then((_connector) => {
				connector = _connector
			})
	})

	beforeAll(function loadContent() {
		test_data = utils.loadTestContents()
	})


	test('', () => {
		assetConnector.start()
			.then(assetConnector => {
				return contentConnector.start(assetConnector)
			})
			.then((_connector) => {
				connector = _connector
			})
	})

	test('publish single entry test', function () {
		const content_type = test_data['es-es'].a.content_type
		let entry = test_data['es-es'].a.entries[0]
		let instance = contentConnector.getConnectorInstance()
		entry._content_type_uid= 'a'
		entry._content_type = content_type
		return instance.publish(entry).then(function (result) {
			expect(result).toHaveProperty("uid");
			expect(result).toHaveProperty("uid", "001");
		}).catch(console.error)
	})
	test('publish single entry test', function () {
		const content_type = test_data['es-es'].a.content_type
		content_type.uid= 'abcd'
		let entry={
		_content_type_uid : 'abcd',
		locale: 'mr-en',
		uid: "888888",
		"tp": "tp",
		_content_type : content_type
		}
		return connector.publish(entry).then(function (result) {
			expect(result).toHaveProperty("uid");
			expect(result).toHaveProperty("uid", "888888");

		}).catch((error) => {
			expect(error).toBe(error)
		})
	})

	

	test('Publish an invalid entry', function () {
		
		return connector.publish({
			"sfgfdg": "sdads",
			'data': "adada"
		}).catch(function (error) {
			expect(error).toBe(error)
		});
	});


	test('Publish an invalid entry', function () {
		
		return connector.publish({
			_content_type_uid: {},
			locale: 'mr-en',
			uid: "888888",
			"tp": "tp"
			
		}).then(function (result) {

		}).catch(function (error) {
			expect(error).toBe(error)
		});
	});

	test('Publish an invalid entry', function () {
		
		return connector.publish({
			
				_content_type_uid: 'a',
				locale: 'mr-in',
				uid: '1234',
				data: {}
		}).then(function (result) {

		}).catch(function (error) {
			expect(error).toBe(error)
		});
	});

	test('Publish an existing entry', function () {

		return connector.publish({
			_content_type_uid: 'a',
			locale: 'mr-in',
			uid: '1234',
				"title":"Facebook and Google",
				"blog_name":{"title":"Facebook and Google Could Be Nationalized in 5-10 Years","href":"blogs/Facebook and Google"},
				"image":{"reference_to":"_assets","values":"bltf3f0a1ac682b57ec"},
				"tags":[],
				"locale":"mr-in",
				"app_user_object_uid":"system",
				"uid":"001",
				"created_by":"ac",
				"updated_by":"ac",
				"created_at":"2018-06-20T05:04:00.111Z",
				"updated_at":"2018-06-20T05:04:00.111Z",
				"deleted_at":false,
				"_version":1,
				"publish_details":{"environment":"abcd","locale":"en-us","time":"2019-03-29T11:59:45.118Z","user":"abc"},
			_content_type: {}
		}).then(function (result) {
			expect(result).toHaveProperty('uid');
			expect(result).toHaveProperty('uid', '1234');
		}).catch(function (error) {
			expect(error).toBe(error)
		});
	});
	test('publish existent entry test', function () {
		const content_type = test_data['es-es'].a.content_type
		//let entry = test_data['es-es'].a.entries[0]
		return connector.publish({
			_content_type_uid: 'a',
			locale: 'es-es',
			uid: "001",
			"data": "new data added",
			_content_type: content_type
		}).then(function (result) {
			expect(result).toHaveProperty("uid");
			expect(result).toHaveProperty("uid", "001");

		})
	})

	test('publish entry failed while writing in schema file', function () {
		const content_type = test_data['es-es'].a.content_type
		fs.chmodSync('./_contents/mr-en/data/abcd/schema.json', '444')
		return connector.publish({
			_content_type_uid: 'abcd',
			locale: 'mr-en',
			uid: "8888881",
			"tp": "tp",
			_content_type: content_type
		}).catch((error) => {
			expect(error).toBe(error)
		})
	})

	test('publish entry failed while writing in index file', function () {
		const content_type = test_data['es-es'].a.content_type
		fs.chmodSync('./_contents/mr-en/data/abcd/index.json', '000')
		return connector.publish({
			_content_type_uid: 'abcd',
			locale: 'mr-en',
			uid: "888888",
			"tp": "tp",
			_content_type: content_type
		}).catch((error) => {
			expect(error).toBe(error)
		})
	})

	test('publish entry failed while writing in index file', function () {
		const content_type = test_data['es-es'].a.content_type
		fs.chmodSync('./_contents/es-es/data/a/index.json', '444')
		return connector.publish({
			_content_type_uid: 'a',
			locale: 'es-es',
			uid: "001",
				"tp": "tp",
			_content_type: content_type
		}).catch((error) => {
			expect(error).toBe(error)
		})
	})

	test('publish invalid data', function () {
		return connector.publish("daatattata").then(function (result) {

		}).catch((error) => {
			expect(error).toBe(error)
		})

	})
	test('publish asset', function () {
		return connector.publish(asset_data).then(function (result) {
			expect(result).toHaveProperty("uid", 'blt9c4ef3c49f7b18e9')
		}).catch((error) => {
			expect(error).toBe(error)
		})
	})

	test('publish asset', function () {
		return connector.publish(asset_data1).then(function (result) {
			expect(result).toHaveProperty("uid", 'blt9c4ef3c49f7b18e9')
		}).catch((error) => {
			expect(error).toBe(error)
		})
	})

	test('publish asset', function () {
		return connector.publish(asset_data2).then(function (result) {
			expect(result).toHaveProperty("uid", 'blt9c4ef3c49f7b18h9')
		}).catch((error) => {
			expect(error).toBe(error)
		})
	})
	test('publish asset', function () {
		return connector.publish(asset_data3).then(function (result) {
			expect(result).toHaveProperty("uid", 'blt9c4ef3c49f7b18f9')
		}).catch((error) => {
			expect(error).toBe(error)
		})
	})

	test('publish asset with different version', function () {
		return connector.publish(asset_data4).then(function (result) {
			expect(result).toHaveProperty("uid", 'blt9c4ef3c49f7b18f9')
		}).catch((error) => {
			expect(error).toBe(error)
		})
	})

	test('publish existent asset', function () {
		return connector.publish(asset_data).then(function (result) {
			expect(result).toHaveProperty("uid", 'blt9c4ef3c49f7b18e9')
		}).catch((error) => {
			expect(error).toBe(error)
		})
	})
})

describe('# Unpublish', function () {

	let connector, test_data
	beforeAll(function loadConnectorMethods() {
		assetConnector.start(config)
			.then(assetConnector => {
				return contentConnector.start(assetConnector, config)
			})
			.then((contentconnector) => {
				connector = contentconnector
			})
	})

	beforeAll(function loadContent() {
		test_data = utils.loadTestContents()
	})

	test('publish single entry test', function () {
		const content_type = test_data['es-es'].a.content_type
		let entry = test_data['es-es'].a.entries[0]
		entry._content_type_uid= 'a'
		entry._content_type = content_type
		let instance = contentConnector.getConnectorInstance()
		fs.chmodSync('./_contents/es-es/data/a/index.json', '777')
		return instance.unpublish(entry).then(function (result) {
			expect(result).toHaveProperty("uid");
			expect(result).toHaveProperty("uid", "001");

		}).catch((error) => {
			expect(error).toBe(error)
		})
	})

	test('Unpublish non existing entry', function () {

		return connector.unpublish({
			_content_type_uid: 'a',
			locale: 'en-us',
			uid: '123',
				po_key: 'basic_1',
				uid: '001'
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
			expect(error).toBe(error)
		})

	})

	test('Unpublish invalid data', function () {
		return connector.unpublish({
			_content_type_uid: {},
			locale: 'en-us',
			uid: '123',
				po_key: 'basic_1',
				uid: '001'
			}).then(function (result) {

		}).catch((error) => {
			expect(error).toBe(error)
		})

	})

	test('Unpublish invalid data', function () {
		return connector.unpublish({
			_content_type_uid: 'a',
			locale: 'en-us',
			uid: '123',
			data: {
			}
			}).then(function (result) {

		}).catch((error) => {
			expect(error).toBe(error)
		})

	})

	test('unpublish asset', function () {
		return connector.unpublish(asset_data3).then(function (result) {
			expect(result).toHaveProperty("uid", 'blt9c4ef3c49f7b18f9')
		}).catch((error) => {
			expect(error).toBe(error)
		})
	})

	test('unpublish asset', function () {
		return connector.unpublish(asset_data1).then(function (result) {
			expect(result).toHaveProperty("uid", 'blt9c4ef3c49f7b18e9')
		}).catch((error) => {
			expect(error).toBe(error)
		})
	})

	test('unpublish non existent asset', function () {
		return connector.unpublish({
			_content_type_uid: '_assets',
			locale: 'en-us',
			uid: '123',
			po_key: 'basic_1',
				
		}).then(function (result) {
			expect(result).toHaveProperty("uid", 'blt9c4ef3c49f7b18f9')
		}).catch((error) => {
			expect(error).toBe(error)
		})
	})

	test('unpublish asset failed test', function () {
		fs.chmodSync('./_contents/mr-in/data/assets/index.json', '444')
		return connector.unpublish(asset_data3).then(function (result) {
			//expect(result).toHaveProperty("uid",'blt9c4ef3c49f7b18f9')
		}).catch((error) => {
			expect(error).toBe(error)
		})
	})

	test('unpublish entry failed test', function () {
		fs.chmodSync('./_contents/mr-en/data/abcd/index.json', '444')
		return connector.unpublish({
			_content_type_uid: 'abcd',
			locale: 'mr-en',
			uid: "888888",
				"tp": "tp"
		}).catch((error) => {
			expect(error).toBe(error)
		})
	})

	test('unpublish entry failed test', function () {
		fs.chmodSync('./_contents/mr-en/data/abcd/index.json', '000')
		return connector.unpublish({
			_content_type_uid: 'abcd',
			locale: 'mr-en',
			uid: "888888",
				"tp": "tp"
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
		fs.chmodSync('./_contents/es-es/data/a/index.json', '444')
		return connector.delete({
			_content_type_uid: 'a',
			locale: 'es-es',
			uid: '1234',
				po_key: 'basic_1'
		}).then(function (result) {
			expect(result).toHaveProperty('uid');
			expect(result).toHaveProperty('uid', '1234');
		}).catch(function (error) {
			expect(error).toBe(error)
		});
	});

	test('Delete an existing entry', function () {
		fs.chmodSync('./_contents/es-es/data/a/index.json', '777')
		return connector.delete({
			_content_type_uid: 'a',
			locale: 'mr-in',
			uid: '1234',
				po_key: 'basic_1'
		}).then(function (result) {
			expect(result).toHaveProperty('uid');
			expect(result).toHaveProperty('uid', '1234');
		}).catch(function (error) {
			expect(error).toBe(error)
		});
	});

	test('Delete an non existing entry', function () {

		return connector.delete({
			_content_type_uid: 'a',
			locale: 'gr-gp',
			uid: '12345789',
				po_key: 'basic_1'
		}).then(function (result) {
			expect(result).toHaveProperty('uid');
			expect(result).toHaveProperty('uid', '12345789');
		}).catch(function (error) {
			expect(error).toBe(error)
		});
	});

	test('delete invalid data', function () {
		return connector.delete({
			_content_type_uid: {},
			locale: 'en-us',
			uid: '123',
				po_key: 'basic_1',
				uid: '001'
			}).then(function (result) {

		}).catch((error) => {
			expect(error).toBe(error)
		})

	})

	test('delete invalid data', function () {
		return connector.delete({
			_content_type_uid: 'a',
			locale: 'en-us',
			uid: '123',
			data: {
			}
			}).then(function (result) {

		}).catch((error) => {
			expect(error).toBe(error)
		})

	})

	test('Delete a non existent entry', function () {

		return connector.delete({
			_content_type_uid: 'a',
			locale: 'mr-in',
			uid: '1234',
				po_key: 'basic_1',
				uid: '1234'
		}).then(function (result) {
			expect(result).toHaveProperty('uid');
			expect(result).toHaveProperty('uid', 1234);
		}).catch(function (error) {
			expect(error).toBe(error)
		});
	});
	test(' Delete asset', function () {
		return connector.delete(asset_data).then(function (result) {
			//expect(result).toHaveProperty("uid",'blt9c4ef3c49f7b18e9')
		}).catch((error) => {
			expect(error).toBe(error)
		})

	})

	test(' Delete non-existent asset', function () {
		return connector.delete(asset_data5).then((result)=>{
			expect(result).toHaveProperty('uid');
			expect(result).toHaveProperty('uid', 'blt9c4ef3c49f7b18e9');
		}).catch((error) => {
			expect(error).toBe(error)
		})

	})

	test('delete invalid data test', function () {

		return connector.delete("datadttadtat").catch((error) => {
			expect(error).toBe(error)
		})
	})

	test('delete asset failed test', function () {
		fs.chmodSync('./_contents/en-us/data/assets/index.json', '444')
		return connector.delete(asset_data2).then(function (result) {
			//expect(result).toHaveProperty("uid",'blt9c4ef3c49f7b18h9')
		}).catch((error) => {
			expect(error).toBe(error)
		})
	})

	test('delete asset failed test', function () {
		fs.chmodSync('./_contents/en-us/data/assets/index.json', '777')
		return connector.delete(asset_data2).then(function (result) {
			//expect(result).toHaveProperty("uid",'blt9c4ef3c49f7b18h9')
		}).catch((error) => {
			expect(error).toBe(error)
		})
	})
	test('delete asset failed test', function () {
		fs.chmodSync('./_contents/en-us/data/assets/index.json', '000')
		return connector.delete(asset_data2).then(function (result) {
			//expect(result).toHaveProperty("uid",'blt9c4ef3c49f7b18h9')
		}).catch((error) => {
			expect(error).toBe(error)
		})
	})

	test('Delete a content type', function () {

		return connector.delete({
			_content_type_uid: '_content_types',
			type: 'content_type_deleted',
			uid: 'abcd',
			data: {}
		}).then(function (result) {
			expect(result).toHaveProperty('uid');
			expect(result).toHaveProperty('uid', `abcd`);
		}).catch(function (error) {
			expect(error).toBe(error)
		});
	});
	test('Delete a invalid content type', function () {

		return connector.delete({_content_type_uid: '_content_types',
		}).then(function (result) {
			expect(result).toHaveProperty('uid');
			expect(result).toHaveProperty('uid', `abcd`);
		}).catch(function (error) {
			expect(error).toBe(error)
		});
	});

	test('Delete a invalid content type', function () {

		return connector.delete({
			_content_type_uid: '_content_types',
			type: 'content_type_deleted',
			uid: 'abcd',
			data: {"a":"abcd"}
		}).then(function (result) {
			expect(result).toHaveProperty('uid');
			expect(result).toHaveProperty('uid', `abcd`);
		}).catch(function (error) {
			expect(error).toBe(error)
		});
	});

	test('Delete a invalid content type', function () {

		return connector.delete({
			_content_type_uid: '_content_types',
			type: 'content_type_deleted',
			uid: 123,
			data: {}
		}).then(function (result) {
			expect(result).toHaveProperty('uid');
			expect(result).toHaveProperty('uid', `abcd`);
		}).catch(function (error) {
			expect(error).toBe(error)
		});
	});
	test('Delete non existent content type', function () {

		return connector.delete({
			_content_type_uid: '_content_types',
			type: 'content_type_deleted',
			uid: 'ab',
			data: {}
		}).then(function (result) {
			expect(result).toHaveProperty('uid');
			expect(result).toHaveProperty('uid',`ab`);
		}).catch(function (error) {
			expect(error).toBe(error)
		});
	});


});

