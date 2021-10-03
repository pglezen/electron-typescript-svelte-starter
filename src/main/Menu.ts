import { Menu } from 'electron';
import type { MenuItemConstructorOptions } from 'electron';

const isMac = process.platform === 'darwin';

export const addMenus = (showLogsCallback: () => void) => {
  let template: MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'View Log',
          click: showLogsCallback,
          enabled: true
        },
        { role: isMac ? 'close' : 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Edit Something',
        },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy'},
        { role: 'paste' },
      ]
    },
    { role: 'viewMenu' },
    { role: 'windowMenu' },
  ];
  if (isMac) {
    template.unshift({role: 'appMenu'});
  }
  let menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}