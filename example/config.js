module.exports = {
  contentstack: {
    apiKey: '',
    deliveryToken: ''
  },
  contentStore: {
    baseDir: '_development_contents'
  },
  assetStore: {
    baseDir: './_development_contents'
  },
  syncManager: {
    inet: {
      dns: '8.8.8.8',
      host: 'google.com',
      port: 53,
      retries: 2,
      retryTimeout: 3 * 1000,
      retryIncrement: 1 * 1000,
      timeout: 6 * 1000,
      type: 'A',
    }
  }
  // filtering now available!
  // syncManager: {
  //   filters: {
  //     content_type_uid: ['authors'],
  //     locale: ['en-us'],
  //     action: ['publish']
  //   }
  // }
}