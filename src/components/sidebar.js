import { h, Component } from 'preact';
import { NavGroup } from 'preact-photon';

export default class Sidebar extends Component {
	// shouldComponentUpdate() {
	// 	return false;
	// }

	paths = [
		{ path:'/', icon:'home', label:'Home' },
		{ path:'/Photos', icon:'picture' },
		{ path:'/Music', icon:'note-beamed' },
		{ path:'/Public', icon:'globe' },
		{ path:'/Apps', icon:'cloud' }
	];

	render({ path, actions }) {

		return (
			<div class="pane pane-sm sidebar">
				<NavGroup>
					<NavGroup.Title>Places</NavGroup.Title>
					{ this.paths.map( item => (
						<SidebarItem {...item} actions={actions} active={ path===item.path } />
					)) }
				</NavGroup>
			</div>
		);
	}
}


const SidebarItem = ({ active, icon, path, label, actions:{ to }, children }) => {
	return <NavGroup.Item icon={ icon } onclick={ to(path) } class={{ active }}>{ children || label || path.replace('/','') }</NavGroup.Item>
};
