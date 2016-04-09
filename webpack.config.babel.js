import pkg from './package.json';
import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';

const ENV = process.env.NODE_ENV || 'development';

module.exports = {
	context: `${__dirname}/src`,
	entry: './index.js',

	target: 'web',

	output: {
		path: `${__dirname}/build`,
		publicPath: '/',
		filename: 'index.js'
	},

	resolve: {
		modulesDirectories: [
			`${__dirname}/src/lib`,
			`${__dirname}/node_modules`,
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
				exclude: /(src|webpack\-dev\-server|socket\.io\-client)/,
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
				loader: ExtractTextPlugin.extract(
					'style?sourceMap',
					'css?sourceMap!postcss!less?sourceMap'
				)
			},
			{
				test: /\.(svg|woff2?|ttf|eot)$/,
				loader: 'url'
			}
		]
	},

	postcss: () => [
		autoprefixer({ browsers: 'last 2 versions' })
	],

	plugins: [
		new webpack.NoErrorsPlugin(),
		new ExtractTextPlugin('style.css', {
			allChunks: true
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.DefinePlugin({
			API_KEY: JSON.stringify(process.env.DROPBOX_API_KEY)
		}),
		new HtmlWebpackPlugin({
			title: pkg.productName || pkg.name,
			filename: 'index.html',
			minify: { collapseWhitespace: true }
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

	stats: { colors: true },

	// Create Sourcemaps for the bundle
	devtool: ENV==='development' ? 'inline-source-map' : 'source-map',

	devServer: {
		port: process.env.PORT || 19998,
		contentBase: './build',
		inline: true,
		hot: true,
		historyApiFallback: true
	}

};
