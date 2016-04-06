import remote from 'remote';
const Menu = remote.require('menu');
const MenuItem = remote.require('menu-item');

export function createMenu(template) {
	let menu = Menu.buildFromTemplate(template);
	return menu;
}

export function showMenu(menu, x, y) {
	menu.popup(remote.getCurrentWindow(), x, y);
}

export function createDomMenu(element) {
	let menu = new Menu();
	[].forEach.call(element.children, child => {
		let item = {};
		if (child.nodeName==='separator') {
			item.type = 'separator';
		}
		else {
			item.label = child.textContent;
			for (let i in child.attributes) {
				item[child.attributes[i].name] = child.attributes[i].value;
			}
			if (child.nodeName==='MENU') {
				item.type = 'submenu';
				item.submenu = createDomMenu(child);
			}
			else {
				item.click = () => { console.log('click'); child.click(); };
			}
		}
		menu.append(new MenuItem(item));
	});
	return menu;
}
