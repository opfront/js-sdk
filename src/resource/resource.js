import RequestHandler from './request-handler'

class Resource {
  constructor(path, configManager){
    this.path = path

    this.configManager = configManager
    this.requestHandler = new RequestHandler(configManager)
  }

  create(payload, callback) {
    const options = {
      auth_token: this.configManager.auth_token,
      payload,
    }

    const retry = this.create.bind(this, ...arguments)
    return this.requestHandler.performRequestRefreshAndRetry('POST', this.path, options, retry, callback)
  }

  list(summary, offset, size, params, callback) {
    let query_params = Object.assign({}, params)
    query_params['summary'] = summary
    query_params['offset'] = offset
    query_params['size'] = size

    const options = {
      auth_token: this.configManager.auth_token,
      query_params,
    }

    const retry = this.list.bind(this, ...arguments)
    return this.requestHandler.performRequestRefreshAndRetry('GET', this.path, options, retry, callback)
  }

  get(id, query_params, callback) {
    const options = {
      auth_token: this.configManager.auth_token,
      query_params,
    }

    const retry = this.get.bind(this, ...arguments)
    return this.requestHandler.performRequestRefreshAndRetry('GET', `${this.path}/${id}`, options, retry, callback)
  }

  update(id, payload, callback) {
    const options = {
      auth_token: this.configManager.auth_token,
      payload,
    }

    const retry = this.update.bind(this, ...arguments)
    return this.requestHandler.performRequestRefreshAndRetry('PATCH', `${this.path}/${id}`, options, retry, callback)
  }

  delete(id, callback) {
    const options = {
      auth_token: this.configManager.auth_token,
    }

    const retry = this.delete.bind(this, ...arguments)
    return this.requestHandler.performRequestRefreshAndRetry('DELETE', `${this.path}/${id}`, options, retry, callback)
  }
}

export default Resource
