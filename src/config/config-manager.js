import { makeRequest } from '../http'

const DEFAULT_CONFIGS = {
  refresh_token: null,
  auth_token: null,
}

export default class ConfigManager {
  constructor() {
    this._config = Object.assign({}, DEFAULT_CONFIGS)
  }

  configure(email, password) {
    if (!email || !password) {
      return Promise.reject('Credentials are needed')
    }

    const options = {
      payload: {
        password,
        email,
      }
    }

    return makeRequest('POST', '/auth/login', options)
      .then(json => {
        this._config = Object.assign({}, json.data)

        return json.data
      })
  }

  configureWithToken(token) {
    if (!token || !token.auth_token || !token.refresh_token ) return Promise.reject('Properly formatted token is needed')

    this._config = Object.assign({}, token)
    return Promise.resolve()
  }

  refresh() {
    if (!this._config.refresh_token) {
      return Promise.reject('Refresh token is needed')
    }

    const options = {
      payload : { refresh_token: this._config.refresh_token }
    }

    // TODO: handle errors gracefully
    return makeRequest('POST', '/auth/refresh', options)
      .then(json => {
        this._config.auth_token = json.data.auth_token
      })
  }

  get auth_token() {
    return this._config.auth_token
  }
}
