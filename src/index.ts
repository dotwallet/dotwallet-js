import * as _ from 'lodash';

function component() {
	const element = document.createElement('div');

	element.innerHTML = _.join(['Hello', 'webpack'], ' ');

	return element;
}

class DotWallet {
	test = 'Hello DotWallet';
	testFunc = () => {
		console.log('hi');
	};
	testAppend = () => {
		document.body.appendChild(component());
	};
}

export default new DotWallet();
