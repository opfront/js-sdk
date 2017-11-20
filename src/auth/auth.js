import RequestHandler from '../resource/request-handler'

class AuthResource {
  constructor(configManager) {
    this.path = '/auth'

    this.configManager = configManager
    this.requestHandler = new RequestHandler(configManager)
  }

  passwordReset(email, callback) {
    return this.requestHandler.performRequestRefreshAndRetry('POST', `${this.path}/passwordreset`, { payload: { email } }, null, callback)
  }

  passwordResetWithToken(token, payload, callback) {
    return this.requestHandler.performRequestRefreshAndRetry('POST', `${this.path}/passwordreset/${token}`, { payload }, null, callback)
  }
}

export default AuthResource
