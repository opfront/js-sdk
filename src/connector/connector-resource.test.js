jest.mock('../http')

import ConfigManager from '../config/config-manager'
import ConnectorResource from './connector-resource'
import Resource from '../resource/resource'

import { UNAUTHORIZED } from '../http'

const MockHttp = require.requireMock('../http')

const store_id = 5

const A_CONNECTOR = {

  ehr_type: 'OPTOSYS',
  api_url: 'url',
  api_key: 'vakjbv'
}

describe('ConnectorResource', () => {
  let connectorResource

  beforeEach(() => {
    connectorResource = new ConnectorResource(new ConfigManager())
  })

  test('is initialized properly', () => {
    expect(connectorResource.path).toEqual('/connector')
    expect(connectorResource.configManager).not.toBeUndefined()
  })

  describe('setStoreConnector', () => {
    test('makes a request properly and resolves on success', () => {
      MockHttp.makeRequest = jest.fn(() => Promise.resolve({}))

      const promise = connectorResource.setStoreConnector(store_id, A_CONNECTOR)
        .then(res => {
          expect(MockHttp.makeRequest).toHaveBeenCalledTimes(1)
          expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('POST')
          expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual('/connector')

          return res
        })

      return expect(promise).resolves.toEqual({})
    })

    test('resolves when request fails, refresh and retry succeed', () => {
      connectorResource.configManager.refresh = jest.fn(() => Promise.resolve())
      MockHttp.makeRequest = jest.fn()
        .mockImplementationOnce(() => Promise.reject({status_code: UNAUTHORIZED}))
        .mockImplementationOnce(() => Promise.resolve({}))

      const promise = connectorResource.setStoreConnector(store_id, A_CONNECTOR)
        .then(res => {
          expect(MockHttp.makeRequest).toHaveBeenCalledTimes(2)
          expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('POST')
          expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual('/connector')
          expect(MockHttp.makeRequest.mock.calls[1][0]).toEqual('POST')
          expect(MockHttp.makeRequest.mock.calls[1][1]).toEqual('/connector')

          return res
      })

      return expect(promise).resolves.toEqual({})
    })

    test('rejects when request fails and refresh fails', () => {
      const error = {status_code: UNAUTHORIZED}
      connectorResource.configManager.refresh = jest.fn(() => Promise.reject(error))
      MockHttp.makeRequest = jest.fn(() => Promise.reject(error))

      return connectorResource.setStoreConnector(store_id, A_CONNECTOR)
        .catch(err => {
            expect(MockHttp.makeRequest).toHaveBeenCalledTimes(1)
            expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('POST')
            expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual('/connector')
            expect(connectorResource.configManager.refresh).toHaveBeenCalledTimes(1)

            expect(err).toEqual(error)
        })
    })
  })
})
