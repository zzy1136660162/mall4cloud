import { setSettings } from '@fantastic-admin/settings'

export default setSettings({
  app: {
    account: {
      auth: true,
    },
    routeBaseOn: 'backend',
    dynamicTitle: true,
    copyright: {
      enable: true,
      dates: '2020-present',
      company: 'Mall4cloud',
      website: 'https://www.mall4j.com',
    },
  },
  menu: {
    mainMenuClickMode: 'smart',
    subMenuCollapseButton: true,
    hotkeys: true,
  },
  topbar: {
    tabbar: true,
    toolbar: true,
    mode: 'fixed',
  },
  tabbar: {
    icon: true,
    hotkeys: true,
  },
  toolbar: {
    fullscreen: true,
    pageReload: true,
    colorScheme: true,
  },
})
