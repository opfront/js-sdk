jest.mock('../http')

import ConfigManager from '../config/config-manager'
import EventResource from './event-resource'

const MockHttp = require.requireMock('../http')

const A_PRODUCT_ID = 1

describe('EventResource', () => {
  let eventResource

  beforeEach(() => {
    eventResource = new EventResource(new ConfigManager())
  })

  test('is initialized properly', () => {
    expect(eventResource.path).toEqual('/events')
    expect(eventResource.trackProductViewed).not.toBeUndefined()
  })

  describe('trackProductViewed', () => {
    test('makes a request properly and resolves on success', () => {
      MockHttp.makeRequest = jest.fn(() => Promise.resolve(A_PRODUCT_ID))

      const promise = eventResource.trackProductViewed()
        .then(res => {
          expect(MockHttp.makeRequest).toHaveBeenCalledTimes(1)
          expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('POST')
          expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual('/events')

          return res
        })

      return expect(promise).resolves.toEqual(A_PRODUCT_ID)
    })

    test('reject when request fail', () => {
      const error = { status_code: 500 }
      eventResource.requestHandler.configManager.refresh = jest.fn(() => Promise.reject(error))
      MockHttp.makeRequest = jest.fn(() => Promise.reject(error))

      return eventResource.trackProductViewed()
        .catch(err => {
          expect(MockHttp.makeRequest).toHaveBeenCalledTimes(1)
          expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('POST')
          expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual('/events')
          expect(eventResource.requestHandler.configManager.refresh).toHaveBeenCalledTimes(0)

          expect(err).toEqual(error)
        })
    })
  })
})
