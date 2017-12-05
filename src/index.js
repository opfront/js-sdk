import ConfigProvider from './config/config-provider'
import UserResource from './user/user-resource'
import VersionResource from './version/version-resource'
import EventResource from './event/event-resource'
import Resource from './resource/resource'
import AuthResource from './auth/auth'
import ConnectorResource from './connector/connector-resource'
import StoreResource from './store/store-resource'

const pj = require('../package.json')

const configManager = ConfigProvider.getInstance()

// export variables both in an object and individually for convenience
export const authenticate = (u, p) => configManager.configure(u, p)
export const authenticateWithToken = (t) => configManager.configureWithToken(t)
export const configureUrl = (url) => global.API_URL = url
export const Spectacle = new Resource('/spectacles', configManager)
export const Product = new Resource('/products', configManager)
export const Order = new Resource('/orders', configManager)
export const Store = new StoreResource(configManager)
export const Banner = new Resource('/banners', configManager)
export const ApiVersion = new VersionResource(configManager)
export const Event = new EventResource(configManager)
export const User = new UserResource(configManager)
export const Auth = new AuthResource(configManager)
export const Connector = new ConnectorResource(configManager)
export const version = pj.version

const opfront = {
  authenticate,
  authenticateWithToken,
  configureUrl,
  Auth,
  Spectacle,
  Product,
  Order,
  Store,
  Banner,
  ApiVersion,
  Event,
  User,
  version,
  Connector,
}

export default opfront
