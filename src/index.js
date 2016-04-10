import { h, render } from 'preact';
import './styles/index.less';

let root;
function init() {
	let App = require('./components/app');
	root = render(<App />, document.body, root);
}
init();

if (module.hot) module.hot.accept('./components/app', () => requestAnimationFrame(init) );
