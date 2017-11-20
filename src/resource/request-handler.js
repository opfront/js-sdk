import { makeRequest, UNAUTHORIZED } from '../http'

class RequestHandler {
  constructor(configManager) {
    this.configManager = configManager
  }

  _refreshAndRetryIfNecessary(retry, callback, err) {
    if (err.status_code === UNAUTHORIZED) {
      return this.configManager.refresh()
        .then(retry)
        .catch(this._errorRequest.bind(this, callback))
    } else {
      return this._errorRequest(callback, err)
    }
  }

  _errorRequest(callback, err) {
    if (callback && typeof (callback) === 'function') {
      callback(err)
    } else {
      return Promise.reject(err)
    }
  }

  _successRequest(callback, res) {
    if (callback && typeof (callback) === 'function') {
      callback(null, res)
    } else {
      return Promise.resolve(res)
    }
  }

  performRequestRefreshAndRetry(method, path, options, retry, callback) {
    return makeRequest(method, path, options)
      .then(this._successRequest.bind(this, callback))
      .catch(this._refreshAndRetryIfNecessary.bind(this, retry, callback))
  }
}

export default RequestHandler
