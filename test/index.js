/*!
* contentstack-sync-content-store-filesystem
* copyright (c) Contentstack LLC
* MIT Licensed
*/

const ncp = require('ncp').ncp;
const path = require('path');
const rimraf = require('rimraf');
const utils = require('../test-utils')
const contentConnector = require('../dist')
const assetConnector = require('../.././new/contentstack-sync-asset-store/dist')
const config = require('../.././new/contentstack-sync-asset-store/dist/default')
let connector = null

const publish_success = 'entry published successfully!'
const unpublish_success = 'entry unpublished successfully!'
const delete_success = 'entry deleted successfully!'

const keys = {
	act: '_assets',
	afct: '_asset_folders',
	locales: {
		es: 'es-es',
		fr: 'fr-fr'
	}
}
const success_publish = 'asset published successfully!'
const success_unpublish = 'asset unpublished successfully!'
const success_folder_delete = 'asset_folder deleted successfully!'
const data = {
	key: [{
		uid: 'f1',
		assets: ['001', '002', '003']
	}]
}


describe('# publish', function () {

	let test_data
	beforeAll(function loadConnectorMethods() {
		assetConnector.start(config)
			.then(assetConnector => {
				return contentConnector.start(config, assetConnector)
			})
			.then((_connector) => {
				connector = _connector
			})
	})

	beforeAll(function loadContent() {
		test_data = utils.loadTestContents()
		//asset_data = utils.loadTestAssetInfo();

	})

	// test('asset publish', function () {
	// 	//const content_type = '_assets';
	// 	const asset = asset_data['es-es'].assets[0];
	// 	console.log("asdaghdhasd", asset)
	// 	asset.po_key = asset_data.po_key;
	// 	console.log("asdaghdhasd")
	// 	return connector.publish({
	// 		content_type_uid: '_assets',
	// 		locale: 'es-es',
	// 		data: asset
	// 	}, {}).then(function success(result) {
	// 		console.log(result, "result.basiccccccccccccccccccc>>>>>>>>>>", result.basic)
	// 		expect(result).toHaveProperty('basic');
	// 		expect(result.basic).toEqual("asset published successfully!");
	// 	}).catch(function error(error) {
	// 		console.error(error);
	// 	});
	// });


	test('publish single entry test', function () {
		console.log(test_data, "test_data")
		const content_type = test_data['es-es'].a.content_type
		let entry = test_data['es-es'].a.entries[0]
		//console.log(content_type, "cttttttttttt", entry,"entryyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
		entry.po_key = test_data.po_key
		return connector.publish({
			content_type_uid: 'a',
			locale: 'es-es',
			data: entry,
			content_type: content_type
		}, {}).then(function (result) {
			expect(result).toHaveProperty(test_data.po_key);
			expect(result).toHaveProperty(test_data.po_key, publish_success);

		})
	})

	test('publish invalid data', function () {
		//const content_type = test_data['es-es'].a.content_type
		return connector.publish("daatattata", {}).then(function (result) {
			expect(result).toHaveProperty(test_data.po_key);
			expect(result).toHaveProperty(test_data.po_key, publish_success);

		}).catch((error) => {
			expect(error).toBe("Kindly provide valid parameters for publish")
		})

	})

	test('publish bulk objects (content_type: a)', function () {
		//const self = this
		const entries = test_data['es-es'].a.entries.slice(1)
		entries.forEach(function (entry) {
			entry.po_key = test_data.po_key
		})
		return connector.publish({
			content_type_uid: 'a',
			locale: 'es-es',
			data: entries,
			content_type: test_data['es-es'].a.content_type
		}, {}).then(function (result) {
			entries.forEach(function (entry) {
				expect(result).toHaveProperty(test_data.po_key);
				expect(result).toHaveProperty(test_data.po_key, publish_success);
			})
		}).catch(function (error) {
			console.error(error)
			return
		})
	})

	test('publish bulk objects (content_type: external_reference)', function () {

		const entries = test_data['es-es'].external_reference.entries
		entries.forEach(function (entry) {
			entry.po_key = test_data.po_key
		})
		return connector.publish({
			content_type_uid: 'external_reference',
			locale: 'es-es',
			data: entries,
			content_type: test_data['es-es'].external_reference.content_type
		}, {}).then(function (result) {
			entries.forEach(function (entry) {
				expect(result).toHaveProperty(test_data.po_key);
				expect(result).toHaveProperty(test_data.po_key, publish_success);
			})
		}).catch(function (error) {
			console.error(error)
			return
		})
	})

	test('publish bulk objects (content_type: assets_only)', function () {

		const entries = test_data['es-es'].assets_only.entries
		entries.forEach(function (entry) {
			entry.po_key = test_data.po_key
		})
		return connector.publish({
			content_type_uid: 'assets_only',
			locale: 'es-es',
			data: entries,
			content_type: test_data['es-es'].assets_only.content_type
		}, {}).then(function (result) {
			entries.forEach(function (entry) {
				expect(result).toHaveProperty(test_data.po_key);
				expect(result).toHaveProperty(test_data.po_key, publish_success);
			})
		}).catch(function (error) {
			console.error(error)
			return
		})
	})

	test('publish bulk objects (content_type: b)', function () {

		const entries = test_data['es-es'].b.entries
		entries.forEach(function (entry) {
			entry.po_key = test_data.po_key
		})
		return connector.publish({
			content_type_uid: 'b',
			locale: 'es-es',
			data: entries,
			content_type: test_data['es-es'].b.content_type
		}, {}).then(function (result) {
			entries.forEach(function (entry) {
				expect(result).toHaveProperty(test_data.po_key);
				expect(result).toHaveProperty(test_data.po_key, publish_success);
			})
		}).catch(function (error) {
			console.error(error)
			return
		})
	})

	test('publish bulk objects (content_type: self_reference)', function () {

		const entries = test_data['es-es'].self_reference.entries
		entries.forEach(function (entry) {
			entry.po_key = test_data.po_key
		})
		return connector.publish({
			content_type_uid: 'self_reference',
			locale: 'es-es',
			data: entries,
			content_type: test_data['es-es'].self_reference.content_type
		}, {}).then(function (result) {
			entries.forEach(function (entry) {
				expect(result).toHaveProperty(test_data.po_key);
				expect(result).toHaveProperty(test_data.po_key, publish_success);
			})
		}).catch(function (error) {
			console.error(error)
			return
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
			data: {
				po_key: 'basic_1',
				uid: '001'
			}
		}, {}).then(function (result) {
			expect(result).toHaveProperty('basic_1');
			expect(result).toHaveProperty('basic_1', unpublish_success);
		}).catch(function (error) {
			console.error(error);
		});
	});
	test('Unpublish invalid data', function () {
		//const content_type = test_data['es-es'].a.content_type
		return connector.unpublish("daatattata", {}).then(function (result) {
			expect(result).toHaveProperty(test_data.po_key);
			expect(result).toHaveProperty(test_data.po_key, publish_success);

		}).catch((error) => {
			expect(error).toBe("Kindly provide valid parameters for unpublish")
		})

	})
	test('Unpublish a non existent entry (content_type: a)', function () {

		return connector.unpublish({
			content_type_uid: 'a',
			locale: 'es-es',
			data: {
				po_key: 'basic_1',
				uid: '001'
			}
		}, {}).then(function (result) {
			expect(result).toHaveProperty('basic_1');
			expect(result).toHaveProperty('basic_1', unpublish_success);
		}).catch(function (error) {
			console.error(error);
		});
	});

	test('Unpublish entries in bulk [ 2 existing, 1 non existent ] (content_type: external_reference)', function () {

		return connector.unpublish({
			content_type_uid: 'external_reference',
			locale: 'es-es',
			data: [{
					po_key: 'basic_1',
					uid: '001'
				},
				{
					po_key: 'basic_2',
					uid: '002'
				},
				{
					po_key: 'basic_3',
					uid: '003'
				}
			]
		}, {}).then(function (result) {

			expect(result).toHaveProperty('basic_1');
			expect(result).toHaveProperty('basic_2');
			expect(result).toHaveProperty('basic_3');
			expect(result).toHaveProperty('basic_1', unpublish_success);
			expect(result).toHaveProperty('basic_2', unpublish_success);
			expect(result).toHaveProperty('basic_3', unpublish_success);

		}).catch(function (error) {
			console.error(error);
		});
	});
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
			data: {
				po_key: 'basic_1',
				uid: '001'
			}
		}, {}).then(function (result) {
			expect(result).toHaveProperty('basic_1');
			expect(result).toHaveProperty('basic_1', delete_success);
		}).catch(function (error) {
			console.error(error);
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
			console.error(error);
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
			console.error(error);
		});
	});

	test('remove entries in bulk [ 2 existing, 1 non existent ] (content_type: external_reference)', function () {

		return connector.delete({
			content_type_uid: 'external_reference',
			locale: 'es-es',
			data: [{
					po_key: 'basic_1',
					uid: '001'
				},
				{
					po_key: 'basic_2',
					uid: '002'
				},
				{
					po_key: 'basic_3',
					uid: '003'
				}
			]
		}, {}).then(function (result) {
			expect(result).toHaveProperty('basic_1');
			expect(result).toHaveProperty('basic_1', delete_success);
			expect(result).toHaveProperty('basic_2');
			expect(result).toHaveProperty('basic_2', delete_success);
			expect(result).toHaveProperty('basic_3');
			expect(result).toHaveProperty('basic_3', delete_success);
		}).catch(function (error) {
			console.error(error);
		});
	});
});

describe('# find', function () {

	beforeAll(function loadConnectorMethods() {
		assetConnector.start(config)
			.then(assetConnector => {
				return contentConnector.start(config, assetConnector)
			})
			.then((contentconnector) => {
				connector = contentconnector
			})
	})


	test('Find all (content_type: b)', function () {
		return connector.find({
			content_type_uid: 'b',
			locale: 'es-es'
		}, {}).then(function (result) {
			expect(result).toHaveProperty('entries');
			expect(result.entries).toHaveLength(1);
		}).catch(function (error) {
			console.error(error);
		});
	});

	test('test the entry which is not exist', function () {
		return connector.findOne({
			content_type_uid: 'a',
			locale: 'es-es',
			query: {
				'uid': '001'
			}
		}).then(function (result) {
			//console.log(result,"result")	
			expect(result).toHaveProperty("entry");
			expect(result.entry).toMatchObject({})
		}).catch(function (error) {
			console.error(error);
		});
	});

	test('Find all (content_type: external_reference)', function () {

		return connector.find({
			content_type_uid: 'external_reference',
			locale: 'es-es'
		}, {}).then(function (result) {
			expect(result).toHaveProperty('entries');
			expect(result.entries).toHaveLength(3);
		}).catch(function (error) {
			console.error(error);
		});
	});

	// test('External referencing', function () {
	// 	//const self = this;
	// 	return connector.find({
	// 		content_type_uid: 'external_reference',
	// 		locale: 'es-es',
	// 		include_reference: true
	// 	}, {}).then(function (result) {
	// 		//console.log(result.entries, "gdsdfsghhhhhhhhhhhhhhhhhhhhhhhhhhd")
	// 		result.entries.forEach(function (entry) {
	// 			//expect(entry.reference_to_b.values[0]).toBe('001');
	// 			expect(entry.reference_to_b).toEqual(expect.arrayContaining([]));
	// 		});
	// 	}).catch(function (error) {
	// 		console.error(error);
	// 	});
	// });

	test('sorting (ascending)', function () {

		return connector.find({
			content_type_uid: 'external_reference',
			locale: 'es-es'
		}, {
			sort: {
				age: 1
			}
		}).then(function (result) {
			let temp_value = result.entries[0].age;
			//console.log(temp_value, "temp value", result.entries, "entries")
			result.entries.forEach(function (entry) {

				expect(temp_value).toBeLessThanOrEqual(entry.age);
				temp_value = entry.age;
			});
		}).catch(function (error) {
			console.error(error);
		});
	});

	test('sorting (descending)', function () {

		return connector.find({
			content_type_uid: 'external_reference',
			locale: 'es-es'
		}, {
			sort: {
				age: -1
			}
		}).then(function (result) {
			for (let i = 0, j = result.entries.length; i < j - 1; i++) {
				expect(result.entries[i].age).toBeGreaterThanOrEqual(result.entries[i + 1].age)
			}
		}).catch(function (error) {
			console.error(error);
		});
	});

});

describe('# findOne', function () {
	beforeAll(function loadConnectorMethods() {
		assetConnector.start(config)
			.then(assetConnector => {
				return contentConnector.start(config, assetConnector)
			})
			.then((contentconnector) => {
				connector = contentconnector
			})
	})

	test('uid only (content_type: b)', function () {
		return connector.findOne({
			content_type_uid: 'b',
			locale: 'es-es',
			query: {
				'uid': '005'
			}
		}).then(function (result) {
			expect(result).toHaveProperty('entry');
			expect(result.entry.uid).toBe("005");
		}).catch(function (error) {
			console.error(error);
		});
	});

	test('test the entry which is not exist', function () {
		return connector.findOne({
			content_type_uid: 'a',
			locale: 'es-es',
			query: {
				'uid': '001'
			}
		}).then(function (result) {
			//console.log(result,"result")
			expect(result).toHaveProperty("entry");
			expect(result.entry).toMatchObject({});
		}).catch(function (error) {
			console.error(error);
		});
	});
});

describe('# Publish Asset', function () {
	beforeEach(() => {
		jest.setTimeout(10000);
	});
	let asset_data
	beforeAll(function loadConnectorMethods() {
		assetConnector.start(config)
			.then(assetConnector => {
				return contentConnector.start(config, assetConnector)
			})
			.then((_connector) => {
				connector = _connector
			})
	})

	beforeAll(function loadContent() {
		asset_data = utils.loadTestAssetInfo();

	})

	test('publish single object', function () {
		const asset = asset_data['es-es'].assets[0];
		asset.po_key = asset_data.po_key;
		console.log("asdaghdhasd")
		return connector.publish({
			content_type_uid: '_assets',
			locale: 'es-es',
			data: asset
		}, {}).then(function success(result) {
			console.log(result, "result.basiccccccccccccccccccc>>>>>>>>>>", result.basic)
			expect(result).toHaveProperty('basic');
			expect(result.basic).toEqual("asset published successfully!");
		}).catch(function error(error) {
			console.error(error);
		});
	});

	test('bulk publish assets (new inserts)', function () {
		//var self = this;
		//const content_type = '_assets';
		var index = 0;
		const assets = asset_data['es-es'].assets;
		assets.forEach(function (asset, _index) {
			index = _index
			asset.po_key = asset_data.po_key + index.toString();
		});
		console.log("assets", assets)
		return connector.publish({
			content_type_uid: '_assets',
			locale: 'es-es',
			data: assets
		}, {}).then(function success(result) {
			
			for (var key in result) {
				//expect(key).toEqual(asset_data.po_key + index.toString());
				expect(result[key]).toEqual("asset published successfully!");
				index++;
			}
		})
		// .catch(function error (error) {
		// 	console.error(error);
		// });
	});

	test('bulk publish assets (already inserted)', function () {
		// var self = this;
		// const content_type = '_assets';
		const assets = asset_data['es-es'].assets;
		assets.forEach(function (asset, index) {
			asset.po_key = asset_data.po_key + index.toString();
		});

		return connector.publish({
			content_type_uid: '_assets',
			locale: 'es-es',
			data: assets
		}, {}).then(function success(result) {
			var index = 0;
			for (var key in result) {
				//expect(key).toEqual(asset_data.po_key + index.toString());
				expect(result[key]).toEqual("asset published successfully!");
				index++;
			}
		}).catch(function error(error) {
			console.error(error);
		});
	});

	test('Update asset', function () {
		// var self = this;
		// const content_type = '_assets';
		const asset = asset_data['es-es'].assets[2];
		asset.title = 'I am modified';
		asset.po_key = asset_data.po_key;

		return connector.publish({
			content_type_uid: '_assets',
			locale: 'es-es',
			data: asset
		}, {}).then(function success(result) {
			expect(result).toHaveProperty('basic');
			expect(result.basic).toEqual("asset published successfully!");
		}).catch(function error(error) {
			console.error(error);
		});
	});
});

describe('# Unpublish Asset', function () {
	// beforeEach(() => {
	// 	jest.setTimeout(20000);
	// });
	let asset_data
	beforeAll(function loadConnectorMethods() {
		assetConnector.start(config)
			.then(assetConnector => {
				return contentConnector.start(config, assetConnector)
			})
			.then((_connector) => {
				connector = _connector
			})
	})

	beforeAll(function loadContent() {
		asset_data = utils.loadTestAssetInfo();

	})


	beforeAll(function cleanAndReplaceContent (done) {
		const src = path.join(__dirname, '..', '_contents')
		const dest = path.join(__dirname, '..', '..', '_contents')
		rimraf.sync(dest)
		ncp(src, dest, done)
	})

	afterAll(function cleanFolder () {
		const dest = path.join(__dirname, '..', '..', '_contents')
		rimraf.sync(dest)
	})

	
	test('Unpublish an existing asset', function () {
		console.log(asset_data['es-es'].assets[0],"assetdata")
		//const self = this;
		return connector.unpublish({
			content_type_uid: '_assets',
			locale: 'es-es',
			data: {
				po_key: 'asset_1',
				uid: asset_data['es-es'].assets[0].uid,
				filename: asset_data['es-es'].assets[0].filename
			}
		}, {}).then(function (result) {
			expect(result).toHaveProperty('asset_1');
			expect(result.asset_1).toEqual(success_unpublish);
		}).catch(function (error) {
			console.error(error);
		});
	});

	test('Unpublish a non existent asset', function () {
		//const self = this;
		return connector.unpublish({
			content_type_uid: '_assets',
			locale: 'es-es',
			data: {
				po_key: 'asset_1',
				uid: asset_data['es-es'].assets[0].uid,
				filename: asset_data['es-es'].assets[0].filename
			}
		}, {}).then(function (result) {
			expect(result).toHaveProperty('asset_1');
			expect(result.asset_1).toEqual(success_unpublish);
		}).catch(function (error) {
			console.error(error);
		});
	});

	test('Unpublish assets in bulk [ 2 existing, 1 non existent ]', function () {
		//const self = this;
		return connector.unpublish({
			content_type_uid: '_assets',
			locale: 'es-es',
			data: [{
					po_key: 'asset_1',
					uid: asset_data['es-es'].assets[0].uid,
					filename: asset_data['es-es'].assets[0].filename
				},
				{
					po_key: 'asset_2',
					uid: asset_data['es-es'].assets[1].uid,
					filename: asset_data['es-es'].assets[1].filename
				},
				{
					po_key: 'asset_3',
					uid: asset_data['es-es'].assets[2].uid,
					filename: asset_data['es-es'].assets[2].filename
				}
			]
		}, {}).then(function (result) {
			expect(result).toHaveProperty('asset_1');
			expect(result).toHaveProperty('asset_2');
			expect(result).toHaveProperty('asset_3');

			expect(result.asset_1).toEqual(success_unpublish);
			expect(result.asset_2).toEqual(success_unpublish);
			expect(result.asset_3).toEqual(success_unpublish);
		}).catch(function (error) {
			console.error(error);
		});
	});
});




describe('# delete asset folders', function () {
	let asset_data
	beforeEach(() => {
		jest.setTimeout(30000);
	});
	beforeAll(function loadConnectorMethods() {
		assetConnector.start(config)
			.then(assetConnector => {
				return contentConnector.start(config, assetConnector)
			})
			.then((_connector) => {
				connector = _connector
			})
	})

	beforeAll(function loadContent() {
		asset_data = utils.loadTestAssetInfo();

	})

	test('delete asset folder (es-es)', function () {
		const assets = asset_data[keys.locales.es].assets
		assets.forEach(function (asset, index) {
			asset.po_key = asset_data.po_key + index.toString()
		})

		return connector.publish({
			content_type_uid: keys.act,
			locale: keys.locales.es,
			data: assets
		}, {}).then(function success(result) {
			assets.forEach(function (asset, index) {
				const p_key = 'basic' + index.toString()
				expect(result).toHaveProperty(p_key)
				expect(result[p_key]).toEqual(success_publish)
			})

			return connector.delete({
				content_type_uid: keys.afct,
				po_key: 'asset_1',
				data: {
					uid: data.key[0].uid,
					locale:'es-es'
				}
			}, {}).then(function (result) {
				console.log('@result; ', JSON.stringify(result))
				expect(result).toHaveProperty('asset_1')
				expect(result.asset_1).toEqual(success_folder_delete)
			}).catch(function (error) {
				console.error(error)
			})
		})
	})

// 	test('delete asset folder (es-es, fr-fr)', function () {

// 		const es_assets = asset_data[keys.locales.es].assets
// 		const fr_assets = asset_data[keys.locales.fr].assets
// 		es_assets.forEach(function (asset, index) {
// 			asset.po_key = asset_data.po_key + index.toString()
// 		})
// 		fr_assets.forEach(function (asset, index) {
// 			asset.po_key = asset_data.po_key + index.toString()
// 		})

// 		return connector.publish({
// 			content_type_uid: keys.act,
// 			locale: keys.locales.es,
// 			data: es_assets
// 		}, {}).then(function success(result) {
// 			es_assets.forEach(function (asset, index) {
// 				const p_key = 'basic' + index.toString()
// 				expect(result).toHaveProperty(p_key)
// 				expect(result[p_key]).toEqual(success_publish)
// 			})
// 			return connector.publish({
// 				content_type_uid: keys.act,
// 				locale: keys.locales.fr,
// 				data: fr_assets
// 			}, {}).then(function success(result) {
// 				fr_assets.forEach(function (asset, index) {
// 					const p_key = 'basic' + index.toString()
// 					expect(result).toHaveProperty(p_key)
// 					expect(result[p_key]).toEqual(success_publish)
// 				})
// 				return connector.delete({
// 					content_type_uid: keys.afct,
// 					po_key: 'asset_1',
// 					data: {
// 						uid: data.key[0].uid,
// 						locale: data.key[0].locale
// 					}
// 				}, {}).then(function (result) {
// 					console.log('@result: ' + JSON.stringify(result))
// 					expect(result).toHaveProperty('asset_1')
// 					expect(result.asset_1).toEqual(success_folder_delete)
// 				}).catch(function (error) {
// 					console.error(error)
// 				})
// 			}).catch(console.error)
// 		}).catch(console.error)
// 	})
 })



describe('# delete assets', function () {

	let asset_data
	beforeEach(() => {
		jest.setTimeout(10000);
	});

	beforeAll(function loadConnectorMethods() {
		assetConnector.start(config)
			.then(assetConnector => {
				return contentConnector.start(config, assetConnector)
			})
			.then((_connector) => {
				connector = _connector
			})
	})

	beforeAll(function loadContent() {
		asset_data = utils.loadTestAssetInfo();

	})

	test('Delete an existing asset', function () {
		//const self = this
		return connector.delete({
			content_type_uid: '_assets',
			locale: 'es-es',
			data: {
				po_key: 'asset_1',
				uid: asset_data['es-es'].assets[0].uid,
				filename: asset_data['es-es'].assets[0].filename
			}
		}, {}).then(function (result) {
			expect(result).toHaveProperty('asset_1')
			expect(result.asset_1).toEqual('asset deleted successfully!')
		}).catch(function (error) {
			console.error(error)
		})
	})

	test('Delete a non existent asset', function () {
		//const self = this
		return connector.delete({
			content_type_uid: '_assets',
			locale: 'es-es',
			data: {
				po_key: 'asset_1',
				uid: asset_data['es-es'].assets[0].uid,
				filename: asset_data['es-es'].assets[0].filename
			}
		}, {}).then(function (result) {
			expect(result).toHaveProperty('asset_1')
			expect(result.asset_1).toEqual('asset deleted successfully!')
		}).catch(function (error) {
			console.error(error)
		})
	})

	test('Delete assets in bulk [ 2 existing, 1 non existent ]', function () {
		//const self = this
		return connector.delete({
			content_type_uid: '_assets',
			locale: 'es-es',
			data: [{
					po_key: 'asset_1',
					uid: asset_data['es-es'].assets[0].uid,
					filename: asset_data['es-es'].assets[0].filename
				},
				{
					po_key: 'asset_2',
					uid: asset_data['es-es'].assets[1].uid,
					filename: asset_data['es-es'].assets[1].filename
				},
				{
					po_key: 'asset_3',
					uid: asset_data['es-es'].assets[2].uid,
					filename: asset_data['es-es'].assets[2].filename
				}
			]
		}, {}).then(function (result) {
			console.log(result,"result")
			expect(result).toHaveProperty('asset_1')
			expect(result).toHaveProperty('asset_2')
			expect(result).toHaveProperty('asset_3')

			expect(result.asset_1).toEqual('asset deleted successfully!')
			expect(result.asset_2).toEqual('asset deleted successfully!')
			expect(result.asset_3).toEqual('asset deleted successfully!')
		}).catch(function (error) {
			console.error(error)
		})
	})
})