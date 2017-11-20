jest.mock('../http')

import ConfigManager from '../config/config-manager'
import UserResource from './user-resource'
import Resource from '../resource/resource'

import { UNAUTHORIZED } from '../http'

const MockHttp = require.requireMock('../http')

const A_USER = {
  id: 27,
  first_name: 'Tony',
  last_name: 'Stark',
}

describe('UserResource', () => {
  let userResource

  beforeEach(() => {
    userResource = new UserResource(new ConfigManager())
  })

  test('is initialized properly', () => {
    expect(userResource).toBeInstanceOf(Resource)
    expect(userResource.path).toEqual('/users')
    expect(userResource.configManager).not.toBeUndefined()
  })

  describe('me', () => {
    test('makes a request properly and resolves on success', () => {
      MockHttp.makeRequest = jest.fn(() => Promise.resolve(A_USER))

      const promise = userResource.me()
        .then(res => {
          expect(MockHttp.makeRequest).toHaveBeenCalledTimes(1)
          expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('GET')
          expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual('/users/me')

          return res
        })

      return expect(promise).resolves.toEqual(A_USER)
    })

    test('resolves when request fails, refresh and retry succeed', () => {
      userResource.configManager.refresh = jest.fn(() => Promise.resolve())
      MockHttp.makeRequest = jest.fn()
        .mockImplementationOnce(() => Promise.reject({status_code: UNAUTHORIZED}))
        .mockImplementationOnce(() => Promise.resolve(A_USER))

      const promise = userResource.me()
        .then(res => {
          expect(MockHttp.makeRequest).toHaveBeenCalledTimes(2)
          expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('GET')
          expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual('/users/me')
          expect(MockHttp.makeRequest.mock.calls[1][0]).toEqual('GET')
          expect(MockHttp.makeRequest.mock.calls[1][1]).toEqual('/users/me')

          return res
      })

      return expect(promise).resolves.toEqual(A_USER)
    })

    test('rejects when request fails and refresh fails', () => {
      const error = {status_code: UNAUTHORIZED}
      userResource.configManager.refresh = jest.fn(() => Promise.reject(error))
      MockHttp.makeRequest = jest.fn(() => Promise.reject(error))

      return userResource.me()
        .catch(err => {
            expect(MockHttp.makeRequest).toHaveBeenCalledTimes(1)
            expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('GET')
            expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual('/users/me')
            expect(userResource.configManager.refresh).toHaveBeenCalledTimes(1)

            expect(err).toEqual(error)
        })
    })
  })
})
