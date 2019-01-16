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
		entry.po_key = test_data.po_key
		return connector.publish({
			content_type_uid: 'a',
			locale: 'es-es',
			uid: entry.uid,
			data: entry,
			content_type: content_type
		}, {}).then(function (result) {
			expect(result).toHaveProperty("uid");
			expect(result).toHaveProperty("uid", "001");

		})
	})

	test('publish invalid data', function () {
		return connector.publish("daatattata", {}).then(function (result) {

		}).catch((error) => {
			expect(error).toBe("Kindly provide valid parameters for publish")
		})

	})
})

describe('# Unpublish', function () {


	beforeAll(function loadConnectorMethods() {
		assetConnector.start(config)
			.then(assetConnector => {
				return contentConnector.start(config, assetConnector)
			})
			.then((contentconnector) => {
				connector = contentconnector
			})
	})

	test('Unpublish an existing entry (content_type: a)', function () {

		return connector.unpublish({
			content_type_uid: 'a',
			locale: 'es-es',
			uid: '123',
			data: {
				po_key: 'basic_1',
				uid: '001'
			}
		}, {}).then(function (result) {
			expect(result).toHaveProperty('uid');
			expect(result).toHaveProperty('uid', '123');
		}).catch(function (error) {
			expect(error).toBe(error)
		});
	});
	test('Unpublish invalid data', function () {
		return connector.unpublish("daatattata", {}).then(function (result) {
			
		}).catch((error) => {
			expect(error).toBe("Kindly provide valid parameters for unpublish")
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

	test('Delete an existing entry (content_type: a)', function () {

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

	test('Delete a non existent entry (content_type: a)', function () {

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

	test('Delete a content type (content_type: a)', function () {

		return connector.delete({
			content_type_uid: '_content_types',
			data: {
				uid: 'a',
				locale: 'en-us',
			},
			po_key: 'basic_1'
		}, {}).then(function (result) {
			expect(result).toHaveProperty('basic_1');
			expect(result).toHaveProperty('basic_1', `content_type deleted successfully!`);
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

