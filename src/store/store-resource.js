import Resource from '../resource/resource'

class StoreResource extends Resource {
  constructor(configManager) {
    super('/stores', configManager)
  }

  transfer(storeId, email, callback) {
    const retry = this.transfer.bind(this, ...arguments)

    const options = {
      auth_token: this.configManager.auth_token,
      payload: { email }
    }

    return this.requestHandler.performRequestRefreshAndRetry('POST', `${this.path}/${storeId}/transfer`, options, retry, callback)
  }

  acceptTransfer(accept, token, callback) {
    const retry = this.acceptTransfer.bind(this, ...arguments)

    const options = {
      auth_token: this.configManager.auth_token,
      payload: { accept }
    }

    return this.requestHandler.performRequestRefreshAndRetry('POST', `${this.path}/transfer/${token}`, options, retry, callback)
  }
}

export default StoreResource
