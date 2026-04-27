import { setSettings } from '@fantastic-admin/settings'

export default setSettings({
  app: {
    routeBaseOn: 'backend',
    account: {
      auth: false,
    },
    dynamicTitle: true,
    copyright: {
      enable: true,
      dates: '2026',
      company: '杰东药业',
      website: '',
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
