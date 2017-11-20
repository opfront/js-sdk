jest.mock('../http')

import ConfigManager from '../config/config-manager'
import VersionResource from './version-resource'

const MockHttp = require.requireMock('../http')

const AN_API_VERSION = {
  "data": {
    "release_date": "2017-01-01", 
    "version": "1.0"
  },
  "status_code": 200
}

describe('VersionResource', () => {
  let versionResource

  beforeEach(() => {
    versionResource = new VersionResource(new ConfigManager())
  })

  test('is initialized properly', () => {
    expect(versionResource.path).toEqual('/version')
    expect(versionResource.get).not.toBeUndefined()
  })

  describe('get', () => {
    test('makes a request properly and resolves on success', () => {
      MockHttp.makeRequest = jest.fn(() => Promise.resolve(AN_API_VERSION))

      const promise = versionResource.get()
        .then(res => {
          expect(MockHttp.makeRequest).toHaveBeenCalledTimes(1)
          expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('GET')
          expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual('/version')

          return res
        })

      return expect(promise).resolves.toEqual(AN_API_VERSION)
    })

    test('reject when request fail', () => {
      const error = { status_code: 500 }
      versionResource.requestHandler.configManager.refresh = jest.fn(() => Promise.reject(error))
      MockHttp.makeRequest = jest.fn(() => Promise.reject(error))

      return versionResource.get()
        .catch(err => {
          expect(MockHttp.makeRequest).toHaveBeenCalledTimes(1)
          expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('GET')
          expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual('/version')
          expect(versionResource.requestHandler.configManager.refresh).toHaveBeenCalledTimes(0)

          expect(err).toEqual(error)
        })
    })
  })
})
