import ConfigManager from './config-manager'

let __INSTANCE__ = null

class ConfigProvider {
  getInstance() {
    if (!__INSTANCE__) __INSTANCE__ = new ConfigManager()

    return __INSTANCE__
  }
}

export default new ConfigProvider()
