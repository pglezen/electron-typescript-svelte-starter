import { Menu } from 'electron';
import type { MenuItemConstructorOptions } from 'electron';

export default () => {
  let template: MenuItemConstructorOptions[] = [
    { role: 'viewMenu' },
    { role: 'windowMenu' },
  ];
  if (process.platform === 'darwin') {
    template.unshift({role: 'appMenu'});
  }
  let menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}