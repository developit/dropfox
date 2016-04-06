import { bind, memoize } from 'decko';
import { parallel } from 'praline';
import { Component, h, render } from 'preact';
import { Header, Title, Footer, Icon, Button, ButtonGroup } from 'preact-photon';
import Sidebar from './components/sidebar';
import PathBar from './components/path-bar';
import FileList from './components/file-list';
import { createMenu, createDomMenu, showMenu } from 'menu';
import dropbox from 'dropbox-client';

export default class App extends Component {
	getInitialState() {
		return {
			path: '/',
			loading: false,
			history: [],
			files: []
		};
	}

	componentDidMount() {
		dropbox.init( err => {
			if (err) return alert(err);
			this.navigate('/');
		});
	}

	@bind
	navigate(to, { go=1 }={}) {
		if (typeof to==='number') { go=to; to=''; }
		let { path, history } = this.state;
		if (to[0]=='/') {
			path = to;
		}
		else {
			path = path.replace(/\/+$/,'') + '/' + to.replace(/^\/+/,'');
		}
		while ( path !== (path = path.replace(/[^\/]+\/\.\.\//)) );
		if (go) {
			if (go===-1) {
				history.pop();
				path = history[history.length-1];
			}
			else {
				history.push(path);
			}
		}
		this.setState({ path, loading:true, history });
		dropbox.readdir(path, (err, names, dir, files) => {
			this.setState({ files, loading:false });
		});
	}

	@bind
	search(search) {
		this.setState({ search, loading:true });
		dropbox.search(this.state.path, search, (err, files) => {
			this.setState({ files, loading:false });
		});
	}

	@bind
	handleSearch({ target:{value:search} }) {
		if (search) {
			this.search(search);
		}
		else {
			this.navigate(0);
		}
	}

	@bind
	handleFile(e) {
		let file = e.file || this.menuFile;
		if (file.isFolder) {
			return this.navigate(file.name, { go:1 });
		}
		else {
			this.openFile(file);
		}
	}

	openFile(file) {
		this.setState({ loading:true });
		dropbox.open(file.path, {
			autoSync: true,
			onUpload: () => {
				console.log('File changed and uploaded. Reloading list.');
				this.go(0);
			}
		}, (err, localPath) => {
			this.setState({ loading:false });
			if (err) return alert(String(err));
		});
	}

	@bind
	to(...args) {
		return () => this.navigate(...args);
	}

	getActions() {
		return this.actions || (this.actions = {
			go: ::this.navigate,
			to: ::this.to
		});
	}

	onDragOver(e) {
		e.dataTransfer.dropEffect = 'copy';
		e.preventDefault();
		e.stopPropagation();
		return false;
	}

	@bind
	onDrop(e) {
		let { path } = this.state,
			files = [].slice.call(e.dataTransfer.files);
		this.setState({ loading:true });
		parallel( files.map( f => cb => {
			let basename = (f.path.match(/([^\/]+)\/?$/g) || [])[0] || '';
			dropbox.upload(f.path, `${path}/${basename}`, cb);
		}), (err, ...results) => {
			this.navigate(0);
		});

		e.preventDefault();
		e.stopPropagation();
		return false;
	}

	@bind
	showFilesMenu(e) {
		let { left, top } = e.target.getBoundingClientRect();
		showMenu(createMenu([
			{ label: 'New File', click: () => this.newFile() },
			{ label: 'New Folder', click: () => this.newDirectory() },
			{ type: 'separator' }
		]));		// , left, top
	}

	newFile(name, path=this.state.path) {
		// @TODO: prompt is not supported in Atom, use my custom modal.
		if (!name) name = prompt('Enter a name for the new file:');
		if (!name) return;
		dropbox.writeFile(`${path}/${basename}`, '', err => {
			if (err) console.error(err);
			this.navigate(0);
		});
	}

	newDirectory(name, path=this.state.path) {
		// @TODO: prompt is not supported in Atom, use my custom modal.
		if (!name) name = prompt('Enter a name for the new folder:');
		if (!name) return;
		dropbox.mkdir(`${path}/${basename}`, err => {
			if (err) console.error(err);
			this.navigate(0);
		});
	}

	@bind
	spawnContextMenu(e) {
		let t = e.target;
		if (e && e.button!==2) return;
		while (!t.hasAttribute('contextmenu') && (t=t.parentNode));
		let id = t.getAttribute('contextmenu'),
			dom = document.getElementById(id),
			menu = dom && createDomMenu(dom);
		if (menu) {
			this.menuFile = e.file;
			setTimeout( () => showMenu(menu), 100);
		}
	}

	no() {
		alert('Nobody uses this button');
	}

	render({}, { files, path, search, loading }) {
		let actions = this.getActions();
		return (
			<div id="app" class="window">
				<Header>
					<Title>Dropfox</Title>

					<div class="toolbar-actions">
						<ButtonGroup>
							<Button icon="left-open-big" onClick={ this.to(-1) } />
							<Button icon="right-open-big" onClick={ this.no } />
						</ButtonGroup>

						<PathBar path={path} go={this.navigate} />

						<Button dropdown disabled={loading} class="pull-right" onMouseDown={this.showFilesMenu}>
							<Icon name="cog" />
						</Button>

						<label class="toolbar-input pull-right">
							<span class="icon icon-search"></span>
							<input
								class="form-control"
								type="search"
								placeholder="Search..."
								value={ search }
								onSearch={ this.handleSearch } />
						</label>
					</div>
				</Header>

				<div class="window-content">
					<div class="pane-group">
						<Sidebar path={path} actions={actions} />
						<div class="pane" onDragOver={this.onDragOver} onDragEnter={this.onDragOver} onDrop={this.onDrop}>
							<FileList
								files={files}
								action={this.handleFile}
								onContextMenu={this.spawnContextMenu}
								contextmenu="file-menu" />
						</div>
					</div>
				</div>

				<Footer>
					<Icon name={ loading?'switch':'cloud' } class="pull-right square" />
					<Title>
						{ files.length.toLocaleString() + ' items' }
					</Title>
				</Footer>

				<menu type="context" id="file-menu" style="display:none;">
					<menuitem label="Open" onClick={ this.handleFile } />
					<menuitem label="Download" disabled />
					<menuitem label="Properties" disabled />
					<menu label="Open with...">
						<menuitem label="Atom" />
						<menuitem label="Sublime Text" />
						<menuitem label="TextWrangler" />
					</menu>
				</menu>
			</div>
		);
	}
}
