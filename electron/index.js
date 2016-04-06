import { parse as parseUrl } from 'url';
import app from 'app';
import BrowserWindow from 'browser-window';
import menu from './menu';

const HOST = `localhost:${process.env.PORT || 19998}`;

const DEV = process.env.ENV==='dev';

// adds debug features like hotkeys for triggering dev tools and reload
if (DEV) {
	try { require('electron-debug')(); }catch(err){}
}

// prevent window being garbage collected
let mainWindow;

app.on('ready', () => {
	mainWindow = createMainWindow();
	overrideWindowOpen();
});

function createMainWindow() {
	const win = new BrowserWindow({
		width: DEV ? 1200 : 800,
		height: DEV ? 600 : 500,
		'min-width': 500,
		'min-height': 200,
		'accept-first-mouse': true,
		'title-bar-style': 'hidden'
	});

	menu(win);

	win.on('closed', () => {
		mainWindow = null;
	});

	if (DEV) {
		win.loadUrl(`http://${HOST}/`);
		win.toggleDevTools();
	}
	else {
		win.loadUrl(`file://${__dirname}/../index.html`);
	}

	return win;
}

function overrideWindowOpen() {
	mainWindow.webContents.on('new-window', (e, url, name, disp, options) => {
		let host = parseUrl(url).host;
		if (host && host!==HOST) {
			Object.assign(options, {
				width: 400,
				height: 500,
				center: true,
				frame: true,
				resizable: false,
				title: `Loading ${host}...`,
				'title-bar-style': 'visible',
				'always-on-top': true,
				'use-content-size': true,
				'skip-taskbar': true,
				'node-integration': false,
				'web-preferences': {
					'web-security': true
				}
			});
		}
		else {
			console.warn(`Allowing node integration for URL: ${url}`);
		}
	});
}

// quit if all windows are closed
app.on('window-all-closed', () => app.quit() );

/*
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate-with-no-open-windows', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});
*/
