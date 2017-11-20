import axios from 'axios'

export const UNAUTHORIZED = 401

const DEFAULT_API_URL = 'https://api.opfront.ca'

const qs = (params) => {
  return Object
    .keys(params)
    .map(key => {
      let val = params[key]
      if (typeof val === 'object') val = JSON.stringify(val)
      return `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
    })
    .join('&')
}

const configureHeaders = (method, auth_token) => {
  let headers = {}

  if (method !== 'GET' && method !== 'DELETE') headers['Content-Type'] = 'application/json'
  if (auth_token) headers['X-Auth-Token'] = auth_token

  return headers
}

export const makeRequest = (method, path, {auth_token=null, query_params=null, payload=null}) => {
  const base_api_url = global.API_URL || DEFAULT_API_URL

  return axios({
    method,
    url: `${base_api_url}${path}`,
    data: payload,
    params: query_params,
    paramSerializer : qs,
    headers: configureHeaders(method, auth_token)
  })
  .then(res => res.data)
  .catch(err => {
    if (err.response && err.response.data) {
      return Promise.reject(err.response.data)
    } else {
      return Promise.reject(err)
    }
  })
}
