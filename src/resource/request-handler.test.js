import RequestHandler from './request-handler'
import ConfigManager from '../config/config-manager'
import { UNAUTHORIZED } from '../http'

const A_RESPONSE = { a: 'response payload' }


describe('RequestHandler', () => {
  let requestHandler

  beforeEach(() => {
    requestHandler = new RequestHandler(new ConfigManager())
  })

  test('sets configManager', () => {
    expect(requestHandler.configManager).toBeInstanceOf(ConfigManager)
  })

  test('_successRequest with a callback calls the callback with data', () => {
    const callback = jest.fn()

    const noPromise = requestHandler._successRequest(callback, A_RESPONSE)

    expect(callback.mock.calls.length).toEqual(1)
    expect(callback.mock.calls[0][0]).toBeNull()
    expect(callback.mock.calls[0][1]).toEqual(A_RESPONSE)
    return expect(noPromise).toBeUndefined()
  })

  test('_successRequest without a callback resolves a promise with data', () => {
    expect(requestHandler._successRequest(null, A_RESPONSE)).resolves.toEqual(A_RESPONSE)
  })

  test('_errorRequest with a callback calls the callback with err', () => {
    const callback = jest.fn()
    const err = { message: 'error message' }

    const noPromise = requestHandler._errorRequest(callback, err)


    expect(callback.mock.calls.length).toEqual(1)
    expect(callback.mock.calls[0][0]).toEqual(err)
    expect(callback.mock.calls[0][1]).toBeUndefined()
    return expect(noPromise).toBeUndefined()
  })

  test('_errorRequest without a callback rejects a promise with err', () => {
    const err = { message: 'error message' }

    expect(requestHandler._errorRequest(null, err)).rejects.toEqual(err)
  })

  describe('_refreshAndRetryIfNecessary', () => {
    let retry
    let err

    beforeEach(() => {
      retry = jest.fn(() => Promise.resolve(A_RESPONSE))
      err = { status_code: UNAUTHORIZED }
    })

    test('rejects with error other than UNAUTHORIZED', () => {
      err.status_code = 500

      expect(requestHandler._refreshAndRetryIfNecessary(retry, null, err)).rejects.toEqual(err)
      expect(retry.mock.calls.length).toEqual(0)
    })

    test('with UNAUTHORIZED refreshes token and retries on refresh success', () => {
      requestHandler.configManager.refresh = jest.fn(() => Promise.resolve()) //monkey patch token refresh

      const promise = requestHandler._refreshAndRetryIfNecessary(retry, null, err)

      return expect(promise).resolves.toEqual(A_RESPONSE)
    })

    test('rejects with UNAUTHORIZED refreshes token calls on refresh success', () => {
      requestHandler.configManager.refresh = jest.fn(() => Promise.reject(err)) //monkey patch token refresh

      const promise = requestHandler._refreshAndRetryIfNecessary(retry, null, err)

      return expect(promise).rejects.toEqual(err)
    })
  })
})