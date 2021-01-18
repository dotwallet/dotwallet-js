const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
function createConfig(target) {
	return {
		mode: 'development',
		entry: './src/index.ts',
		devtool: 'inline-source-map',
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: 'ts-loader',
					exclude: /node_modules/,
				},
			],
		},
		resolve: {
			extensions: ['.ts', '.js'],
		},
		output: {
			filename: 'dotwallet.' + target + '.js',
			path: path.resolve(__dirname, 'dist'),
			library: 'dotwallet',
			libraryTarget: target,
		},
		// externals: {
		// 	lodash: {
		// 		commonjs: 'lodash',
		// 		commonjs2: 'lodash',
		// 		amd: 'lodash',
		// 		root: '-',
		// 	},
		// },
		plugins: [
			new ForkTsCheckerWebpackPlugin(), // run TSC on a separate thread
		],
		watch: true,
	};
}

module.exports = [
	createConfig('var'),
	createConfig('commonjs2'),
	createConfig('amd'),
	createConfig('umd'),
];
