import RequestHandler from '../resource/request-handler'

class ConnectorResource {
  constructor(configManager) {
    this.path = '/connector'

    this.configManager = configManager
    this.requestHandler = new RequestHandler(configManager)
  }

  setStoreConnector(store_id, payload, callback) {
    const retry = this.setStoreConnector.bind(this, ...arguments)
    const options = {
      auth_token: this.configManager.auth_token,
      payload: { ...payload, store_id }
    }

    return this.requestHandler.performRequestRefreshAndRetry('POST', this.path, options, retry, callback)
  }
}

export default ConnectorResource
