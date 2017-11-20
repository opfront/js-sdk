jest.mock('../http')

import Resource from './resource'
import ConfigManager from '../config/config-manager'
import { UNAUTHORIZED } from '../http'

const MockHttp = require.requireMock('../http')

const AN_ID = 54
const A_PATH = 'res'
const A_RESPONSE = {a: 'response payload'}
const A_REQUEST_PAYLOAD = {a : 'request payload'}

describe('Resource', () => {
  let theResource

  beforeEach(() => {
    theResource = new Resource(A_PATH, new ConfigManager())
  })

  test('sets path and configManager', () => {
    expect(theResource.path).toEqual(A_PATH)
    expect(theResource.configManager).toBeInstanceOf(ConfigManager)
  })

  describe('create', () => {
    test('rejects and does not retry on request fails with other than UNAUTHORIZED', () => {
      const error = {status_code : 500}
      MockHttp.makeRequest = jest.fn(() => Promise.reject(error))

      expect(theResource.create(A_REQUEST_PAYLOAD)).rejects.toEqual(error)
    })

    test('resolves on request success without callback', () => {
      MockHttp.makeRequest = jest.fn(() => Promise.resolve(A_RESPONSE))

      const promise = theResource.create(A_REQUEST_PAYLOAD)
        .then(res => {
          expect(MockHttp.makeRequest.mock.calls.length).toEqual(1)
          expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('POST')
          expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual(A_PATH)
          expect(MockHttp.makeRequest.mock.calls[0][2].payload).toEqual(A_REQUEST_PAYLOAD)
          expect(res).toEqual(A_RESPONSE)
          return res
        })

      return expect(promise).resolves.toEqual(A_RESPONSE)
    })

    test('calls success callback on request success with callback', () => {
      MockHttp.makeRequest = jest.fn(() => Promise.resolve(A_RESPONSE))
      const callback = jest.fn((err, res) => {
        expect(MockHttp.makeRequest.mock.calls.length).toEqual(1)
        expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('POST')
        expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual(A_PATH)
        expect(MockHttp.makeRequest.mock.calls[0][2].payload).toEqual(A_REQUEST_PAYLOAD)
        expect(err).toBeNull()
        expect(res).toEqual(A_RESPONSE)
      })

      const noPromise = theResource.create(A_REQUEST_PAYLOAD, callback)

      return expect(noPromise).resolves.toBeUndefined()
    })

    test('resolves on request failed but refresh succeed without callback', () => {
      theResource.configManager.refresh = jest.fn(() => Promise.resolve())
      MockHttp.makeRequest = jest.fn()
        .mockImplementationOnce(() => Promise.reject({status_code: UNAUTHORIZED}))
        .mockImplementationOnce(() => Promise.resolve(A_RESPONSE))

      theResource.create(A_REQUEST_PAYLOAD)
        .then(res => {
            expect(MockHttp.makeRequest).toHaveBeenCalledTimes(2)
            expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('POST')
            expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual(A_PATH)
            expect(MockHttp.makeRequest.mock.calls[0][2].payload).toEqual(A_REQUEST_PAYLOAD)
            expect(MockHttp.makeRequest.mock.calls[1][0]).toEqual('POST')
            expect(MockHttp.makeRequest.mock.calls[1][1]).toEqual(A_PATH)
            expect(MockHttp.makeRequest.mock.calls[1][2].payload).toEqual(A_REQUEST_PAYLOAD)
            expect(theResource.configManager.refresh).toHaveBeenCalledTimes(1)

            expect(res).toEqual(A_RESPONSE)
        })
    })

    test('call success callback on request failed but refresh succeed with callback', () => {
      theResource.configManager.refresh = jest.fn(() => Promise.resolve())
      MockHttp.makeRequest = jest.fn()
        .mockImplementationOnce(() => Promise.reject({status_code: UNAUTHORIZED}))
        .mockImplementationOnce(() => Promise.resolve(A_RESPONSE))

      const callback = (err, res) => {
        expect(MockHttp.makeRequest).toHaveBeenCalledTimes(2)
        expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('POST')
        expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual(A_PATH)
        expect(MockHttp.makeRequest.mock.calls[0][2].payload).toEqual(A_REQUEST_PAYLOAD)
        expect(MockHttp.makeRequest.mock.calls[1][0]).toEqual('POST')
        expect(MockHttp.makeRequest.mock.calls[1][1]).toEqual(A_PATH)
        expect(MockHttp.makeRequest.mock.calls[1][2].payload).toEqual(A_REQUEST_PAYLOAD)
        expect(theResource.configManager.refresh).toHaveBeenCalledTimes(1)

        expect(err).toBeNull()
        expect(res).toEqual(A_RESPONSE)
      }

      const noPromise = theResource.create(A_REQUEST_PAYLOAD, callback)

      return expect(noPromise).resolves.toBeUndefined()
    })

    test('rejects on request failed and refresh failed', () => {
      const error = {status_code: UNAUTHORIZED}
      theResource.configManager.refresh = jest.fn(() => Promise.reject(error))
      MockHttp.makeRequest = jest.fn(() => Promise.reject(error))

      theResource.create(A_REQUEST_PAYLOAD)
        .catch(err => {
            expect(MockHttp.makeRequest).toHaveBeenCalledTimes(1)
            expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('POST')
            expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual(A_PATH)
            expect(MockHttp.makeRequest.mock.calls[0][2].payload).toEqual(A_REQUEST_PAYLOAD)
            expect(theResource.configManager.refresh).toHaveBeenCalledTimes(1)

            expect(err).toEqual(error)
        })
    })

    test('calls error callback on request failed and refresh failed with callback', () => {
      const error = {status_code: UNAUTHORIZED}
      theResource.configManager.refresh = jest.fn(() => Promise.reject(error))
      MockHttp.makeRequest = jest.fn(() => Promise.reject(error))

      const callback = (err, res) => {
        expect(MockHttp.makeRequest).toHaveBeenCalledTimes(1)
        expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('POST')
        expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual(A_PATH)
        expect(MockHttp.makeRequest.mock.calls[0][2].payload).toEqual(A_REQUEST_PAYLOAD)
        expect(theResource.configManager.refresh).toHaveBeenCalledTimes(1)

        expect(err).toEqual(error)
        expect(res).toBeUndefined()
      }

      const noPromise = theResource.create(A_REQUEST_PAYLOAD, callback)

      return expect(noPromise).resolves.toBeUndefined()
    })
  })

  describe('list', () => {
    const summary = false
    const offset = 10
    const size = 50

    test('resolves when request succeed', () => {
      MockHttp.makeRequest = jest.fn(() => Promise.resolve(A_RESPONSE))

      const promise = theResource.list(summary, offset, size)
        .then(res => {
          expect(MockHttp.makeRequest).toHaveBeenCalledTimes(1)
          expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('GET')
          expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual(A_PATH)
          expect(MockHttp.makeRequest.mock.calls[0][2].query_params).toEqual({summary, offset, size})
          expect(res).toEqual(A_RESPONSE)
          return res
        })

      return expect(promise).resolves.toEqual(A_RESPONSE)
    })

    test('resolves when request fails, refresh and retry succeed', () => {
      theResource.configManager.refresh = jest.fn(() => Promise.resolve())
      MockHttp.makeRequest = jest.fn()
        .mockImplementationOnce(() => Promise.reject({status_code: UNAUTHORIZED}))
        .mockImplementationOnce(() => Promise.resolve(A_RESPONSE))

      const promise = theResource.list(summary, offset, size)
        .then(res => {
            expect(MockHttp.makeRequest).toHaveBeenCalledTimes(2)
            expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('GET')
            expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual(A_PATH)
            expect(MockHttp.makeRequest.mock.calls[0][2].query_params).toEqual({summary, offset, size})
            expect(MockHttp.makeRequest.mock.calls[1][0]).toEqual('GET')
            expect(MockHttp.makeRequest.mock.calls[1][1]).toEqual(A_PATH)
            expect(MockHttp.makeRequest.mock.calls[1][2].query_params).toEqual({summary, offset, size})
            expect(theResource.configManager.refresh).toHaveBeenCalledTimes(1)

            expect(res).toEqual(A_RESPONSE)
            return res
        })

      return expect(promise).resolves.toEqual(A_RESPONSE)
    })

    test('rejects when request fails and refresh fails', () => {
      const error = {status_code: UNAUTHORIZED}
      theResource.configManager.refresh = jest.fn(() => Promise.reject(error))
      MockHttp.makeRequest = jest.fn(() => Promise.reject(error))

      theResource.list(summary, offset, size)
        .catch(err => {
            expect(MockHttp.makeRequest).toHaveBeenCalledTimes(1)
            expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('GET')
            expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual(A_PATH)
            expect(MockHttp.makeRequest.mock.calls[0][2].query_params).toEqual({summary, offset, size})
            expect(theResource.configManager.refresh).toHaveBeenCalledTimes(1)

            expect(err).toEqual(error)
        })
    })
  })

  describe('get', () => {
    const query_params = {store_id: 28, summary:false}

    test('resolves when request succeed', () => {
      MockHttp.makeRequest = jest.fn(() => Promise.resolve(A_RESPONSE))

      const promise = theResource.get(AN_ID, query_params)
        .then(res => {
          expect(MockHttp.makeRequest).toHaveBeenCalledTimes(1)
          expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('GET')
          expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual(A_PATH + '/' + AN_ID)
          expect(MockHttp.makeRequest.mock.calls[0][2].query_params).toEqual(query_params)
          expect(res).toEqual(A_RESPONSE)
          return res
        })

      return expect(promise).resolves.toEqual(A_RESPONSE)
    })

    test('resolves when request fails, refresh and retry succeed', () => {
      theResource.configManager.refresh = jest.fn(() => Promise.resolve())
      MockHttp.makeRequest = jest.fn()
        .mockImplementationOnce(() => Promise.reject({status_code: UNAUTHORIZED}))
        .mockImplementationOnce(() => Promise.resolve(A_RESPONSE))

      const promise = theResource.get(AN_ID, query_params)
        .then(res => {
          expect(MockHttp.makeRequest).toHaveBeenCalledTimes(2)
          expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('GET')
          expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual(A_PATH + '/' + AN_ID)
          expect(MockHttp.makeRequest.mock.calls[0][2].query_params).toEqual(query_params)
          expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('GET')
          expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual(A_PATH + '/' + AN_ID)
          expect(MockHttp.makeRequest.mock.calls[0][2].query_params).toEqual(query_params)

          expect(res).toEqual(A_RESPONSE)
          return res
      })

      return expect(promise).resolves.toEqual(A_RESPONSE)
    })

    test('rejects when request fails and refresh fails', () => {
      const error = {status_code: UNAUTHORIZED}
      theResource.configManager.refresh = jest.fn(() => Promise.reject(error))
      MockHttp.makeRequest = jest.fn(() => Promise.reject(error))

      theResource.get(AN_ID, query_params)
        .catch(err => {
            expect(MockHttp.makeRequest).toHaveBeenCalledTimes(1)
            expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('GET')
            expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual(A_PATH + '/' + AN_ID)
            expect(MockHttp.makeRequest.mock.calls[0][2].query_params).toEqual(query_params)
            expect(theResource.configManager.refresh).toHaveBeenCalledTimes(1)

            expect(err).toEqual(error)
        })
    })
  })

  describe('update', () => {
    // no neeed to write multiple test, mechanism is the same as create
    // only request params should be checked
    test('resolves when request succeed', () => {
      MockHttp.makeRequest = jest.fn(() => Promise.resolve(A_RESPONSE))

      const promise = theResource.update(AN_ID, A_REQUEST_PAYLOAD)
        .then(res => {
          expect(MockHttp.makeRequest).toHaveBeenCalledTimes(1)
          expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('PATCH')
          expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual(A_PATH + '/' + AN_ID)
          expect(MockHttp.makeRequest.mock.calls[0][2].payload).toEqual(A_REQUEST_PAYLOAD)
          expect(res).toEqual(A_RESPONSE)
          return res
        })

      return expect(promise).resolves.toEqual(A_RESPONSE)
    })
  })

  describe('delete', () => {
    // no neeed to write multiple test, mechanism is the same as create
    // only request params should be checked
    test('resolves when request succeed', () => {
      MockHttp.makeRequest = jest.fn(() => Promise.resolve(A_RESPONSE))

      const promise = theResource.delete(AN_ID)
        .then(res => {
          expect(MockHttp.makeRequest).toHaveBeenCalledTimes(1)
          expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('DELETE')
          expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual(A_PATH + '/' + AN_ID)
          expect(res).toEqual(A_RESPONSE)

          return res
        })

      return expect(promise).resolves.toEqual(A_RESPONSE)
    })
  })
})
