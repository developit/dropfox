import { h, Component } from 'preact';
import { ButtonGroup, Button } from 'preact-photon';

const EXISTS = x => x;

export default ({ path, go }) => {
	let parts = path.split('/').filter(EXISTS);

	return (
		<ButtonGroup>
			<Button icon="home" onClick={ () => go('/') }>Home</Button>
			{ parts.map( (dir, i) => (
				<Button onClick={ () => go('/'+parts.slice(0,i+1).join('/')) }>{ dir }</Button>
			) ) }
		</ButtonGroup>
	);
};
