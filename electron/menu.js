import { openExternal } from 'shell';
import app from 'app';
import Menu from 'menu';

const MAC = process.platform==='darwin';
const DEV = process.env.NODE_ENV==='dev';
const MENU = [];

export default win => {
	Menu.setApplicationMenu(
		Menu.buildFromTemplate(
			filterDev(MENU)
		)
	);
};

let filterDev = menu => menu.filter( item => (DEV || item.devOnly!==true)).map( item => {
	let d = Object.assign({}, item);
	if (d.submenu) d.submenu = filterDev(d.submenu);
	return d;
});


MENU.push(
	{
		label: 'Edit',
		submenu: [
			{
				label: 'Undo',
				accelerator: 'CmdOrCtrl+Z',
				role: 'undo'
			},
			{
				label: 'Redo',
				accelerator: 'Shift+CmdOrCtrl+Z',
				role: 'redo'
			},
			{
				type: 'separator'
			},
			{
				label: 'Cut',
				accelerator: 'CmdOrCtrl+X',
				role: 'cut'
			},
			{
				label: 'Copy',
				accelerator: 'CmdOrCtrl+C',
				role: 'copy'
			},
			{
				label: 'Paste',
				accelerator: 'CmdOrCtrl+V',
				role: 'paste'
			},
			{
				label: 'Select All',
				accelerator: 'CmdOrCtrl+A',
				role: 'selectall'
			},
		]
	},
	{
		label: 'View',
		submenu: [
			{
				label: 'Reload',
				accelerator: 'CmdOrCtrl+R',
				click(item, focusedWindow) {
					if (focusedWindow)
						focusedWindow.reload();
				}
			},
			{
				label: 'Toggle Full Screen',
				accelerator: MAC ? 'Ctrl+Command+F' : 'F11',
				click(item, focusedWindow) {
					if (focusedWindow)
						focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
				}
			},
			{
				devOnly: true,
				label: 'Toggle Developer Tools',
				accelerator: MAC ? 'Alt+Command+I' : 'Ctrl+Shift+I',
				click(item, focusedWindow) {
					if (focusedWindow)
						focusedWindow.toggleDevTools();
				}
			},
		]
	},
	{
		label: 'Window',
		role: 'window',
		submenu: [
			{
				label: 'Minimize',
				accelerator: 'CmdOrCtrl+M',
				role: 'minimize'
			},
			{
				label: 'Close',
				accelerator: 'CmdOrCtrl+W',
				role: 'close'
			},
		]
	},
	{
		label: 'Help',
		role: 'help',
		submenu: [
			{
				label: 'Developer Website',
				click: () => openExternal('http://jasonformat.com')
			},
		]
	}
);


if (MAC) {
	let appName = app.getName();
	MENU.unshift({
		label: appName,
		submenu: [
			{
				label: `About ${appName}`,
				role: 'about'
			},
			{
				type: 'separator'
			},
			{
				label: 'Services',
				role: 'services',
				submenu: []
			},
			{
				type: 'separator'
			},
			{
				label: `Hide ${appName}`,
				accelerator: 'Command+H',
				role: 'hide'
			},
			{
				label: 'Hide Others',
				accelerator: 'Command+Shift+H',
				role: 'hideothers'
			},
			{
				label: 'Show All',
				role: 'unhide'
			},
			{
				type: 'separator'
			},
			{
				label: 'Quit',
				accelerator: 'Command+Q',
				click: () => app.quit()
			}
		]
	});

	// Window menu.
	MENU[3].submenu.push(
		{
			type: 'separator'
		},
		{
			label: 'Bring All to Front',
			role: 'front'
		}
	);
}
