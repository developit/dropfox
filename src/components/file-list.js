import { bind, memoize } from 'decko';
import { h, Component } from 'preact';
import neatime from 'neatime';
import { Icon } from 'preact-photon';

const time = memoize( str => neatime(new Date(str)).replace(/^(\d+[a-z])$/g,'$1 ago') );

export default class FileList extends Component {
	@bind
	handleKey(e) {
		if (e.code==='ArrowUp' || e.keyCode===38) {
			this.move(-1);
		}
		else if (e.code==='ArrowDown' || e.keyCode===40) {
			this.move(1);
		}
		else if (e.code==='Enter' || e.keyCode===13) {
			this.openSelected();
		}
		else {
			return;
		}
		e.preventDefault();
		return false;
	}

	openSelected() {
		let { action } = this.props,
			{ selected } = this.state;
		if (action && selected) {
			action({ file: selected });
		}
	}

	move(delta) {
		let { files } = this.props,
			{ selected } = this.state,
			index = files.indexOf(selected);
		if (index===-1 && delta<0) index = files.length;
		index += delta;
		if (index>=0 && index<files.length) {
			selected = files[index];
			this.setState({ selected });
		}
	}

	componentDidMount() {
		addEventListener('keydown', this.handleKey);
	}

	componentWillUnmount() {
		removeEventListener('keydown', this.handleKey);
	}

	componentDidUpdate() {
		let selected = this.base && this.base.querySelector('.selected');
		if (selected) selected.scrollIntoViewIfNeeded();
	}

	render({ files, action, ...props }, { selected }) {
		return (
			<div class="cotable file-list">
				<table>
					<thead>
						<tr>
							<th width="40"></th>
							<th>Name</th>
							<th width="80">Size</th>
							<th width="100">Modified</th>
						</tr>
					</thead>
				</table>
				<table class="striped">
					<tbody>{
						files.map( file => (
							<FileListItem
								selected={selected && selected.path===file.path}
								file={file}
								onAction={action}
								onSelect={this.linkState('selected', 'file')}
								{...props}
							/>
						))
					}</tbody>
				</table>
			</div>
		);
	}
}

const FileListItem = ({ showThumbs=false, file, selected, onContextMenu, onSelect, onAction, ...props }) => (
	<tr {...props} file={file} class={{selected}} onContextMenu={ fileProxy(file, onContextMenu) } onMouseDown={ fileProxy(file, onSelect) } onDblClick={ fileProxy(file, onAction) }>
		<td width="40">{ showThumbs && file.hasThumbnail ? (
			<div style={"width:1.8em; height:1.4em; background:url("+dropbox.thumbnailUrl(file.path)+") center/contain;"} />
		) : (
			<Icon class="square" name={ file.isFile ? 'doc-text-inv' : 'folder' } />
		) }</td>
		<td>{ file.name }</td>
		<td width="80">{ file.humanSize }</td>
		<td width="100">{ time(file.modifiedAt) }</td>
	</tr>
);


function fileProxy(file, fn) {
	return e => {
		e.file = file;
		if (fn) return fn(e);
	};
}
