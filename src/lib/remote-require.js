import remote from 'remote';

// remote.require(), patched to work in both dev and prod mode:
export default function remoteRequire(module) {
	if (process.env.NODE_ENV!=='development') {
		module = module.replace(/^\.\//, __dirname+'/../');
	}
	return remote.require(module);
}
