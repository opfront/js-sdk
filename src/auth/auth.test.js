jest.mock('../http')

import ConfigManager from '../config/config-manager'
import AuthResource from './auth'
import { UNAUTHORIZED } from '../http'

const MockHttp = require.requireMock('../http')

const AN_EMAIL = 'account@email.com'

const A_TOKEN = 'webrgre'
const A_PASSWORD = {
  'password': 'bertnwwtrnrtwn'
}

describe('AuthResource', () => {
  let authResource

  beforeEach(() => {
    authResource = new AuthResource(new ConfigManager())
  })

  test('is initialized properly', () => {
    expect(authResource.path).toEqual('/auth')
    expect(authResource.passwordReset).not.toBeUndefined()
    expect(authResource.passwordResetWithToken).not.toBeUndefined()
  })

  describe('passwordReset', () => {
    test('makes a request properly and resolves on success', () => {
      MockHttp.makeRequest = jest.fn(() => Promise.resolve({}))
      authResource.requestHandler.configManager.refresh = jest.fn(() => Promise.reject(error))

      const promise = authResource.passwordReset(AN_EMAIL)
        .then(res => {
          expect(MockHttp.makeRequest).toHaveBeenCalledTimes(1)
          expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('POST')
          expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual('/auth/passwordreset')
          expect(authResource.requestHandler.configManager.refresh).toHaveBeenCalledTimes(0)

          return res
        })

      return expect(promise).resolves.toEqual({})
    })

    test('reject when request fail', () => {
      const error = { status_code: 500 }
      authResource.requestHandler.configManager.refresh = jest.fn(() => Promise.reject(error))
      MockHttp.makeRequest = jest.fn(() => Promise.reject(error))

      return authResource.passwordReset(AN_EMAIL)
        .catch(err => {
          expect(MockHttp.makeRequest).toHaveBeenCalledTimes(1)
          expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('POST')
          expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual('/auth/passwordreset')
          expect(authResource.requestHandler.configManager.refresh).toHaveBeenCalledTimes(0)

          expect(err).toEqual(error)
        })
    })
  })

  describe('passwordResetWithToken', () => {
    test('makes a request properly and resolves on success', () => {
      MockHttp.makeRequest = jest.fn(() => Promise.resolve({}))
      authResource.requestHandler.configManager.refresh = jest.fn(() => Promise.reject(error))

      const promise = authResource.passwordResetWithToken(A_TOKEN, A_PASSWORD)
        .then(res => {
          expect(MockHttp.makeRequest).toHaveBeenCalledTimes(1)
          expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('POST')
          expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual(`/auth/passwordreset/${A_TOKEN}`)
          expect(authResource.requestHandler.configManager.refresh).toHaveBeenCalledTimes(0)

          return res
        })

      return expect(promise).resolves.toEqual({})
    })

    test('reject when request fail', () => {
      const error = { status_code: 500 }
      authResource.requestHandler.configManager.refresh = jest.fn(() => Promise.reject(error))
      MockHttp.makeRequest = jest.fn(() => Promise.reject(error))

      return authResource.passwordResetWithToken(A_TOKEN, A_PASSWORD)
        .catch(err => {
          expect(MockHttp.makeRequest).toHaveBeenCalledTimes(1)
          expect(MockHttp.makeRequest.mock.calls[0][0]).toEqual('POST')
          expect(MockHttp.makeRequest.mock.calls[0][1]).toEqual(`/auth/passwordreset/${A_TOKEN}`)
          expect(authResource.requestHandler.configManager.refresh).toHaveBeenCalledTimes(0)

          expect(err).toEqual(error)
        })
    })
  })
})
