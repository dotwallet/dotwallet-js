import { stringify, v4 as uuid } from 'uuid';
import { html, render } from 'lit-html';
import { DOTWALLET_API } from '../config';
const engButton = require('../../assets/dotwallet-pay-button-blue-138x48-en.svg');
const zhButton = require('../../assets/dotwallet-paybutton-blue-152x48-zh.svg');

export interface AutoPayOptions {
	duration?: number;
	productName?: string;
	orderAmount?: number;
	userID?: string;
	autopayEndpoint?: string;
	receiveAddress?: string;
	productDetail?: string;
	notifyURL?: string;
	subject?: string;
	coinType?: string;
	fetchHeaders?: Record<string, string>;
	fetchOptions?: Record<string, string>;
	log?: boolean;
	lang?: 'en' | 'zh';
	successCallback?: (orderData: any) => any;
	failureCallback?: (error: any) => any;
}

export function autoPay(elementID: string, options: AutoPayOptions) {
	if (options.log) console.log({ options });
	// set defaults:
	if (!options.lang) options.lang = 'en';
	if (!options.coinType) options.coinType = 'BSV';
	if (!options.duration) options.duration = 2;

	const valid = validate(options);
	if (valid !== 'valid') {
		if (options.log) console.log(valid);
		return;
	}
	const buttonID = `dotwallet-autopay${uuid().slice(0, 10)}`;

	render(
		template(buttonID, styles(buttonID, options)),
		document.getElementById(elementID)
	);
	const button = document.getElementById(buttonID);
	countDown(button, submit, options);
}
const validate = (options: AutoPayOptions): string => {
	try {
		let result = 'validator: \n';
		if (!options.productName) result += 'Must have productName. \n';
		if (!options.orderAmount) result += 'Must have orderAmount. \n';
		if (!options.autopayEndpoint) result += 'Must have autopayEndpoint. \n';
		else if (
			!options.autopayEndpoint.includes('http://') &&
			!options.autopayEndpoint.includes('https://')
		)
			result +=
				'Invalid autopayEndpoint. Please use your backend server endpoint URI. \n';

		if (!options.receiveAddress) result += 'Must have receiveAddress. \n';
		if (options.notifyURL)
			if (
				!options.notifyURL.includes('http://') &&
				!options.notifyURL.includes('https://')
			)
				result += 'Invalid notifyURL. \n';

		if (['en', 'zh'].indexOf(options.lang) === -1)
			result += 'Invalid language option \n';
		if (['BSV', 'BTC', 'ETH'].indexOf(options.coinType) === -1)
			result += 'Invalid cointype option. \n';
		if (
			25 > options.receiveAddress.length ||
			options.receiveAddress.length > 36
		)
			result += 'Invalid address (length not between 25-36 characters). \n';
		console.log('validate result', result);

		if (result === 'validator: \n') return 'valid';
		else return result;
	} catch (error) {
		if (options.log) console.log('validation error: ', error);
		return JSON.stringify(error);
	}
};
const submit = (options: AutoPayOptions) => {
	const orderData: any = {
		out_order_id: uuid(),
		user_id: options.userID,
		coin_type: options.coinType,
		to: [
			{
				type: 'address',
				content: options.receiveAddress,
				amount: options.orderAmount,
			},
		],
		product: {
			id: uuid(),
			name: options.productName,
			detail: options.productDetail,
		},
	};
	if (options.notifyURL) orderData.notify_url = options.notifyURL;
	if (options.subject) orderData.subject = options.subject;
	if (options.log) console.log('order data:\n', orderData);
	const fetchOptions: any = {
		method: 'POST',
		body: JSON.stringify(orderData),
	};
	if (options.fetchHeaders)
		fetchOptions.headers = {
			...options.fetchHeaders,
		};
	else {
		fetchOptions.headers = {
			'Content-type': 'application/json; charset=UTF-8',
		};
	}
	if (options.fetchOptions)
		for (const option in options.fetchOptions)
			fetchOptions[option] = options.fetchOptions[option];
	if (options.log) console.log('fetch options:\n', options);

	fetch(options.autopayEndpoint, fetchOptions)
		.then((orderResponse) => orderResponse.json())
		.then((orderData) => {
			if (options.log) console.log('order response data:\n', orderData);
			if (orderData.txid) {
				if (options.log) console.log({ orderData });
				if (options.successCallback) options.successCallback(orderData);
			} else {
				if (options.log) console.log({ orderData });
				if (options.failureCallback) options.failureCallback(orderData);
			}
		})
		.catch((error) => {
			if (options.log) console.error({ error });
			if (options.failureCallback) options.failureCallback(error);
		});
};
const countDown = (
	button: HTMLElement,
	callback: (data: any) => any,
	options: AutoPayOptions
) => {
	button.dataset.status = 'default';
	button.dataset.counter = '0';
	let timer: NodeJS.Timeout;

	const execute = () => {
		button.dataset.status = 'executing';
		clearTimeout(timer);
		setTimeout((_) => {
			try {
				callback(options);
			} catch (error) {
				if (options.log) console.log('error', error);
			}
			reset();
		}, 100);
		return;
	};
	const countAndConfirm = () => {
		if (parseInt(button.dataset.counter) >= options.duration) execute();
		timer = setTimeout(() => {
			if (options.log) console.log({ counter: button.dataset.counter });
			button.dataset.counter = JSON.stringify(
				parseInt(button.dataset.counter) + 1
			);
			if (options.log) console.log({ counter: button.dataset.counter });
			countAndConfirm();
		}, 1000);
	};
	const triggerCount = () => {
		if (
			button.dataset.status === 'executing' ||
			button.dataset.status === 'counting'
		)
			return;
		button.dataset.status = 'counting';
		countAndConfirm();
	};
	const cancel = () => {
		if (button.dataset.status === 'executing') return;
		button.dataset.counter = '0';
		clearTimeout(timer);
		button.dataset.status = 'default';
	};
	const reset = () => {
		button.dataset.status = 'default';
		cancel();
	};
	button.addEventListener('touchstart', (e) => {
		e.preventDefault();
		triggerCount();
	});
	button.addEventListener('touchend', (e) => {
		cancel();
	});
	button.addEventListener('mousedown', (e) => {
		e.preventDefault();
		triggerCount();
	});
	button.addEventListener('mouseup', (e) => {
		cancel();
	});
};
const template = (buttonID: string, style: string) => html`
	<div id="${buttonID}"></div>
	<style>
		${style}
	</style>
`;

// style template does not accept string interpolation with ${ }
const styles = (buttonID: string, options: AutoPayOptions) => `
#${buttonID} {
  width: ${options.lang === 'zh' ? '152' : '138'}px;
  height: 48px;
  cursor: pointer;
  box-shadow: 0 0 10px gray;
  background: url(${options.lang === 'en' ? engButton : zhButton})
}
#${buttonID}:hover {
  box-shadow: 0 0 10px rgb(40, 40, 40);
}
#${buttonID}[data-status="default"] {
  cursor: pointer;
  transform: scale(1);
  transition-duration: 0.2s;
}
#${buttonID}[data-status="counting"] {
  cursor: progress;
  transition-duration: 3s;
  transform: scale(0.7);
}
#${buttonID}[data-status="executing"] {
  transform: scale(1);
  transition-duration: 0.2s;
  opacity: 0.7;
  cursor: denied;
}`;
