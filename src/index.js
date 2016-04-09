import { h, render } from 'preact';
import './styles/index.less';

function init() {
	let App = require('./app');
	render(<App />, document.body);
}
init();

if (module.hot) module.hot.accept('./app', () => requestAnimationFrame(init));
