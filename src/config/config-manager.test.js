jest.mock('../http')

import ConfigManager from './config-manager'

const MockedHttp = require.requireMock('../http')

const A_TOKEN = '0987hjc!/v&mkSic.)\<'
const A_REFRESH_TOKEN = '9jk#@19fp/08.$'
const AN_EMAIL = 'iron.man@starkindustries.com'
const A_PASSWORD = 'Pepper_Potts'

describe('ConfigManager', () => {
  let configManager

  beforeEach(() => {
    configManager = new ConfigManager()
  })

  test('configs should default to null', () => {
    expect(configManager._config.auth_token).toBeNull()
    expect(configManager._config.refresh_token).toBeNull()
  })

  test('get auth_token to return auth token', () => {
    configManager._config.auth_token = A_TOKEN

    expect(configManager.auth_token).toEqual(A_TOKEN)
  })

  describe('configure', () => {
    test('fails when email is not provided', () => {
      return expect(configManager.configure('', A_PASSWORD)).rejects.toBeDefined()
    })

    test('fails when password is not provided', () => {
      return expect(configManager.configure(AN_EMAIL, '')).rejects.toBeDefined()
    })

    test('fails when request failure', () => {
      MockedHttp.makeRequest = jest.fn(() => Promise.reject('err'))

      return configManager.configure(AN_EMAIL, A_PASSWORD).catch(err => {
        expect(err).toEqual('err')
        expect(configManager._config.refresh_token).toBeNull()
        expect(configManager._config.auth_token).toBeNull()
      })
    })

    test('sets auth and refresh tokens on request succes', () => {
      MockedHttp.makeRequest = jest.fn(() => Promise.resolve({data : {auth_token: A_TOKEN, refresh_token: A_REFRESH_TOKEN}}))

      return configManager.configure(AN_EMAIL, A_PASSWORD).then(() => {
        expect(configManager._config.refresh_token).toEqual(A_REFRESH_TOKEN)
        expect(configManager._config.auth_token).toEqual(A_TOKEN)
      })
    })
  })

  describe('configureWithToken', () => {
    test('fails when token is not provided or not well formatted', () => {
      expect(configManager.configureWithToken('')).rejects.toBeDefined()
      expect(configManager.configureWithToken({ hulk_hogan: A_TOKEN})).rejects.toBeDefined()
      expect(configManager.configureWithToken({ auth_token: A_TOKEN, john_cena: A_REFRESH_TOKEN })).rejects.toBeDefined()
      expect(configManager.configureWithToken({ auth_token: '', refresh_token: '' })).rejects.toBeDefined()
    })

    test('sets auth and refresh tokens', () => {
      configManager.configureWithToken({ auth_token: A_TOKEN, refresh_token: A_REFRESH_TOKEN })

      expect(configManager._config.refresh_token).toEqual(A_REFRESH_TOKEN)
      expect(configManager._config.auth_token).toEqual(A_TOKEN)
    })
  })

  describe('refresh', () => {
    test('fails when refresh_token is not set', () => {
      return expect(configManager.refresh()).rejects.toBeDefined()
    })

    test('to make a request and throw on error on failure', () => {
      MockedHttp.makeRequest = jest.fn(() => Promise.reject('err'))
      configManager._config.refresh_token = A_REFRESH_TOKEN

      return expect(configManager.refresh()).rejects.toBeDefined()
    })

    test('to make a request and set auth token on success', () => {
      MockedHttp.makeRequest = jest.fn(() => Promise.resolve({ data: { auth_token: A_TOKEN } }))
      configManager._config.refresh_token = A_REFRESH_TOKEN

      configManager.refresh().then(() => {
        expect(configManager.auth_token).toEqual(A_TOKEN)
      })
    })
  })
})
