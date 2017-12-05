jest.mock('../http')

import ConfigManager from '../config/config-manager'
import StoreResource from './store-resource'
import Resource from '../resource/resource'

import { UNAUTHORIZED } from '../http'

const MockHttp = require.requireMock('../http')

describe('StoreResource', () => {
  let storeResource

  beforeEach(() => {
    storeResource = new StoreResource(new ConfigManager())
  })

  test('is initialized properly', () => {
    expect(storeResource).toBeInstanceOf(Resource)
    expect(storeResource.path).toEqual('/stores')
    expect(storeResource.configManager).not.toBeUndefined()
  })

  describe('transfer', () => {
    test('makes a request properly and resolves on success', () => {
      MockHttp.makeRequest = jest.fn(() => Promise.resolve({}))

      const promise = storeResource.transfer(1, 'bob@gmail.com')
        .then(res => {
          expect(MockHttp.makeRequest).toHaveBeenCalledTimes(1)
          expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('POST')
          expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual('/stores/1/transfer')

          return res
        })

      return expect(promise).resolves.toEqual({})
    })

    test('resolves when request fails, refresh and retry succeed', () => {
      storeResource.configManager.refresh = jest.fn(() => Promise.resolve())
      MockHttp.makeRequest = jest.fn()
        .mockImplementationOnce(() => Promise.reject({status_code: UNAUTHORIZED}))
        .mockImplementationOnce(() => Promise.resolve({}))

      const promise = storeResource.transfer(1, 'bob@gmail.com')
        .then(res => {
          expect(MockHttp.makeRequest).toHaveBeenCalledTimes(2)
          expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('POST')
          expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual('/stores/1/transfer')
          expect(MockHttp.makeRequest.mock.calls[1][0]).toEqual('POST')
          expect(MockHttp.makeRequest.mock.calls[1][1]).toEqual('/stores/1/transfer')

          return res
      })

      return expect(promise).resolves.toEqual({})
    })

    test('rejects when request fails and refresh fails', () => {
      const error = {status_code: UNAUTHORIZED}
      storeResource.configManager.refresh = jest.fn(() => Promise.reject(error))
      MockHttp.makeRequest = jest.fn(() => Promise.reject(error))

      return storeResource.transfer(1, 'bob@gmail.com')
        .catch(err => {
            expect(MockHttp.makeRequest).toHaveBeenCalledTimes(1)
            expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('POST')
            expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual('/stores/1/transfer')
            expect(storeResource.configManager.refresh).toHaveBeenCalledTimes(1)

            expect(err).toEqual(error)
        })
    })
  })

  describe('acceptTransfer', () => {
    test('makes a request properly and resolves on success', () => {
      MockHttp.makeRequest = jest.fn(() => Promise.resolve({}))

      const promise = storeResource.acceptTransfer(true, 'afom4023hugb23f23')
        .then(res => {
          expect(MockHttp.makeRequest).toHaveBeenCalledTimes(1)
          expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('POST')
          expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual('/stores/transfer/afom4023hugb23f23')

          return res
        })

      return expect(promise).resolves.toEqual({})
    })

    test('resolves when request fails, refresh and retry succeed', () => {
      storeResource.configManager.refresh = jest.fn(() => Promise.resolve())
      MockHttp.makeRequest = jest.fn()
        .mockImplementationOnce(() => Promise.reject({status_code: UNAUTHORIZED}))
        .mockImplementationOnce(() => Promise.resolve({}))

      const promise = storeResource.acceptTransfer(false, 'afom4023hugb23f23')
        .then(res => {
          expect(MockHttp.makeRequest).toHaveBeenCalledTimes(2)
          expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('POST')
          expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual('/stores/transfer/afom4023hugb23f23')
          expect(MockHttp.makeRequest.mock.calls[1][0]).toEqual('POST')
          expect(MockHttp.makeRequest.mock.calls[1][1]).toEqual('/stores/transfer/afom4023hugb23f23')

          return res
      })

      return expect(promise).resolves.toEqual({})
    })

    test('rejects when request fails and refresh fails', () => {
      const error = {status_code: UNAUTHORIZED}
      storeResource.configManager.refresh = jest.fn(() => Promise.reject(error))
      MockHttp.makeRequest = jest.fn(() => Promise.reject(error))

      return storeResource.acceptTransfer(true, 'afom4023hugb23f23')
        .catch(err => {
            expect(MockHttp.makeRequest).toHaveBeenCalledTimes(1)
            expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('POST')
            expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual('/stores/transfer/afom4023hugb23f23')
            expect(storeResource.configManager.refresh).toHaveBeenCalledTimes(1)

            expect(err).toEqual(error)
        })
    })
  })
})
