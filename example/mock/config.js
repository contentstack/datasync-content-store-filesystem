module.exports = {
  contentstack: {
    // Small stack
    // apiKey: '***REMOVED***',
    // token: '***REMOVED***'
    // Dummy Stack - Ninad
    // apiKey: '***REMOVED***',
    // token: '***REMOVED***'
    apiKey: '***REMOVED***',
    token: '***REMOVED***'
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