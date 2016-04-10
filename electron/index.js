import { parse as parseUrl } from 'url';
import app from 'app';
import BrowserWindow from 'browser-window';
import menu from './menu';

const HOST = `localhost:${process.env.PORT || 19998}`;

const DEV = process.env.NODE_ENV==='development';

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
		minWidth: 500,
		minHeight: 200,
		webgl: false,
		acceptFirstMouse: true,
		titleBarStyle: 'hidden',
		show: false
	});

	menu(win);

	win.on('closed', () => {
		mainWindow = null;
	});

	if (DEV) {
		win.loadURL(`http://${HOST}/`);
		win.toggleDevTools();
	}
	else {
		win.loadURL(`file://${__dirname}/web/index.html`);
	}

	setTimeout( () => win.show(), 150);

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
				titleBarStyle: 'visible',
				alwaysOnTop: true,
				useContentSize: true,
				skipTaskbar: true,
				nodeIntegration: false,
				webPreferences: {
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
