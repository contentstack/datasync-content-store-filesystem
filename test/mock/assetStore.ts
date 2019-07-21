export const connector = {
  delete: () => {
    return Promise.resolve()
  },
  download: (asset) => {
    return Promise.resolve(asset)
  },
  unpublish: () => {
    return Promise.resolve()
  },
}

export const assetConnector = {
  setLogger: () => {
    return
  },
  start: () => {
    return Promise.resolve(connector)
  },
}
