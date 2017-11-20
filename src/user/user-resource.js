import Resource from '../resource/resource'

class UserResource extends Resource {
  constructor(configManager) {
    super('/users', configManager)
  }

  me(callback) {
    const retry = this.me.bind(this, ...arguments)
    const options = {
      auth_token: this.configManager.auth_token
    }

    return this.requestHandler.performRequestRefreshAndRetry('GET', `${this.path}/me`, options, retry, callback)
  }
}

export default UserResource
