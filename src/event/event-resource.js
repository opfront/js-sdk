import RequestHandler from '../resource/request-handler'

class EventResource {
  constructor(configManager) {
    this.path = '/events'

    this.requestHandler = new RequestHandler(configManager)
  }

  trackProductViewed(productId, callback) {
    const requestPayload = {
      collection: "product_views",
      payload : {
        product_id: productId
      }
    }

    const options = {
      payload: requestPayload
    }

    return this.requestHandler.performRequestRefreshAndRetry('POST', this.path, options, null, callback)
  }
}

export default EventResource
