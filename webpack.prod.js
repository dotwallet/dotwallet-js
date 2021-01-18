const path = require('path');
function createConfig(target) {
	return {
		mode: 'production',
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
	};
}

module.exports = [
	createConfig('var'),
	createConfig('commonjs2'),
	createConfig('amd'),
	createConfig('umd'),
];
