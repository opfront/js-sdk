import RequestHandler from '../resource/request-handler'

class VersionResource {
  constructor(configManager) {
    this.path = '/version'

    this.requestHandler = new RequestHandler(configManager)
  }

  get(callback) {  
    return this.requestHandler.performRequestRefreshAndRetry('GET', this.path, {}, null, callback)
  }
}

export default VersionResource
