import { bind, memoize } from 'decko';
import { h, Component } from 'preact';
import neatime from 'neatime';
import { Icon } from 'preact-photon';

const time = memoize( str => neatime(new Date(str)).replace(/^(\d+[a-z])$/g,'$1 ago') );

export default class FileList extends Component {
	// componentWillMount() {
	// 	store.subscribe( () =>
	// }
	// onSelect={ e => selectFile(e.file) }

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
