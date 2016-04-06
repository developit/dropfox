var fs = require('fs');
	request = require('request');

exports.upload = function upload(path, url, callback) {
	function done(err) {
		if (callback) callback(err);
		callback = null;
	}

	fs.createReadStream(path)
		.on('error', function(err) {
			done(err);
		})
		.pipe(
			request.put(url, done)
				.on('error', function(err) {
					done(err);
				})
				.on('finish', function() {
					done();
				})
		)
		.on('finish', function() {
			done();
		});
};
