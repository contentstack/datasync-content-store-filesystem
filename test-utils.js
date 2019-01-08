const fs = require('fs');
const path = require('path');


exports.readFile = function (path) {
	try {
		if (fs.existsSync(path)) {
			return JSON.parse(fs.readFileSync(path));
		} else {
			return {};
		}
	} catch (error) {
		throw error;
	}
};

exports.loadTestAssetInfo = function () {
	const es_es_assets = path.join(__dirname, 'test_content', 'es-es', 'assets', '_assets.json');
	const fr_fr_assets = path.join(__dirname, 'test_content', 'fr-fr', 'assets', '_assets.json');

	const data = {
		po_key: 'basic',
		'es-es': {
			assets: this.readFile(es_es_assets)
		},
		'fr-fr': {
			assets: this.readFile(fr_fr_assets)
		}
	};

	return data;
};

exports.loadTestContents = function () {
	const es_es_data = path.join(__dirname, 'test_content', 'es-es', 'data');
	const fr_fr_data = path.join(__dirname, 'test_content', 'fr-fr', 'data');
	const data = {
		languages: ['es-es', 'fr-fr'],
		po_key: 'basic',
		'es-es': {
			a: {
				entries: this.readFile(path.join(es_es_data, 'a', 'index.json')),
				content_type: this.readFile(path.join(es_es_data, 'a', '_schema.json'))
			},
			b: {
				entries: this.readFile(path.join(es_es_data, 'b', 'index.json')),
				content_type: this.readFile(path.join(es_es_data, 'b', '_schema.json'))
			},
			assets_only: {
				entries: this.readFile(path.join(es_es_data, 'assets_only', 'index.json')),
				content_type: this.readFile(path.join(es_es_data, 'assets_only', '_schema.json'))
			},
			external_reference: {
				entries: this.readFile(path.join(es_es_data, 'external_reference', 'index.json')),
				content_type: this.readFile(path.join(es_es_data, 'external_reference', '_schema.json'))
			},
			self_reference: {
				entries: this.readFile(path.join(es_es_data, 'self_reference', 'index.json')),
				content_type: this.readFile(path.join(es_es_data, 'self_reference', '_schema.json'))
			}
		},
		'fr-fr': {
			a: {
				entries: this.readFile(path.join(fr_fr_data, 'a', 'index.json')),
				content_type: this.readFile(path.join(fr_fr_data, 'a', '_schema.json'))
			},
			b: {
				entries: this.readFile(path.join(fr_fr_data, 'b', 'index.json')),
				content_type: this.readFile(path.join(fr_fr_data, 'b', '_schema.json'))
			},
			assets_only: {
				entries: this.readFile(path.join(fr_fr_data, 'assets_only', 'index.json')),
				content_type: this.readFile(path.join(fr_fr_data, 'assets_only', '_schema.json'))
			},
			external_reference: {
				entries: this.readFile(path.join(fr_fr_data, 'external_reference', 'index.json')),
				content_type: this.readFile(path.join(fr_fr_data, 'external_reference', '_schema.json'))
			}
		}	
	};

	return data;
};