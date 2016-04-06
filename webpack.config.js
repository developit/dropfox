var pkg = require('./package.json'),
	webpack = require('webpack'),
	path = require('path'),
	ExtractTextPlugin = require("extract-text-webpack-plugin"),
	HtmlPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/index.js',

	target: 'web',

	output: {
		path: path.join(__dirname, 'build'),
		filename: 'index.js'
	},

	resolve: {
		modulesDirectories: [
			path.resolve(__dirname, 'src/lib'),
			'node_modules'
		]
		// alias: {
		// 	'dropbox': path.resolve(__dirname, 'node_modules/dropbox/lib/dropbox.js')
		// }
	},

	externals: [{
		'remote': 'commonjs remote'
	}],

	module: {
		noParse: [
			/\b(node_modules|~)\/dropbox\//,
		],

		preLoaders: [
			{
				test: /\.(jsx?|css|less)$/,
				exclude: /(webpack\-dev\-server|socket\.io\-client)/,
				loader: 'source-map'
			}
		],

		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules|\/~\/|webpack\-dev\-server|socket\.io\-client)/,
				loader: 'babel'
			},
			{
				test: /\.(css|less)$/,
				loader: ExtractTextPlugin.extract('style?sourceMap', 'css?sourceMap!autoprefixer?browsers=last 2 version!less?sourceMap?noIeCompat')
				// loaders: ['style?sourceMap', 'css?sourceMap', 'autoprefixer?browsers=last 2 version', 'less?config=--inline-urls']
			},
			{
				test: /\.(eot|ttf|otf|woff)$/,
				loader: 'url'
			}
		]
	},

	plugins: [
		new webpack.NoErrorsPlugin(),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.DefinePlugin({
			API_KEY: JSON.stringify(process.env.DROPBOX_API_KEY)
		}),
		new ExtractTextPlugin('style.css', {
			allChunks: true
		}),
		new HtmlPlugin({
			title: pkg.productName || pkg.name,
			filename: 'index.html',
			minify: {
				collapseWhitespace: true
			}
		})
	],

	// turn off node shims
	node: {
		console: false,
		global: false,
		process: false,
		Buffer: false,
		setImmediate: false
	},

	stats: {
		colors: true
	},

	// Create Sourcemaps for the bundle
	devtool: process.env.ENV==='dev' ? 'inline-source-map' : 'source-map',

	devServer: {
		port: process.env.PORT || 19998,
		contentBase: './build',
		inline: true,
		hot: true,
		historyApiFallback: true
	}

};
