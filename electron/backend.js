import fs from 'fs';
import request from 'request';

export function upload(path, url, callback) {
	function done(err) {
		if (callback) callback(err);
		callback = null;
	}

	fs.createReadStream(path)
		.on('error', done)
		.pipe(
			request.put(url, done)
				.on('error', done)
				.on('finish', () => done() )
		)
		.on('finish', () => done() );
};
