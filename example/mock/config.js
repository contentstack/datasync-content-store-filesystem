module.exports = {
  contentstack: {
    // Small stack
    // apiKey: 'blt2801eba9629034ca',
    // token: 'cs21e9179cf620f21c7efaf15e'
    // Dummy Stack - Ninad
    // apiKey: 'blte570a8fa36ad8689',
    // token: 'cse4529445b77da8b162e4b47b'
    apiKey: 'bltd1343376dfba54d2',
    token: 'cs12363bf3654a9b1dbf15a590'
  },
  'content-connector': {

  },
  'asset-connector': {

  },
  locales: [
    {
      code: 'en-us',
      relative_url_prefix: '/'
    },
    {
      code: 'fr-fr',
      relative_url_prefix: '/fr/'
    },
    {
      code: 'en-gb',
      relative_url_prefix: '/gb/'
    },
    {
      code: 'es-es',
      relative_url_prefix: '/es/'
    }
  ],
  listener: {

  },
  plugins: {
    myplugin: {
      name: 'Kashi'
    }
  },
  'sync-manager': {

  }
}