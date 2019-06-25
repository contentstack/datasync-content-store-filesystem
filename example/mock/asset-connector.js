// Build mock asset connector
module.exports = {
  delete: function (asset) {
    return Promise.resolve(asset)
  },
  download: function (asset) {
    console.log(asset,"in asset store")
    asset.key = 'new key added'
    return Promise.resolve(asset)
  },
  unpublish: function (asset) {
    return Promise.resolve(asset)
  },
  start: function () {
    return Promise.resolve(this)
  }
}