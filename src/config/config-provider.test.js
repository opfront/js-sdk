import ConfigProvider from './config-provider'
import ConfigManager from './config-manager'

describe('ConfigProvider', () => {
  test('getInstance retuns a configManager', () => {
    const configManager = ConfigProvider.getInstance()

    expect(configManager).toBeInstanceOf(ConfigManager)
  })

  test('getInstance always return the same instance', () => {
    const configManager = ConfigProvider.getInstance()
    const configManager1 = ConfigProvider.getInstance()
    const configManager2 = ConfigProvider.getInstance()

    expect(configManager).toBe(configManager1)
    expect(configManager).toBe(configManager2)
    expect(configManager1).toBe(configManager2)
  })
})
