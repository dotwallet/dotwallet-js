export interface LoginOptions {
	clientID: string;
	lang?: 'en' | 'zh';
}

import { v4 as uuid } from 'uuid';
import { html, render } from 'lit-html';
const engButton = require('../../assets/dotwallet-login-button-blue-254x48-en.svg');
export function login(elementID: string, options: LoginOptions) {
	const template = (buttonID: string, style: string) => html`
		<div id="dotwallet-login${buttonID}"></div>
		<style>
			${style}
		</style>
	`;
	const element = document.getElementById(elementID);
	const buttonID = uuid();
	const style = `
	#dotwallet-login${buttonID} {
		width: 254px;
		height: 48px;
		cursor: pointer;
		box-shadow: 0 0 10px gray;
		background: url(${engButton})
	}
	#dotwallet-login${buttonID}:hover {
		box-shadow: 0 0 10px rgb(40, 40, 40);
	}
	#dotwallet-login${buttonID}:active {
		opacity: 0.7;
	}`;

	render(template(buttonID, style), element);
	const button = document.getElementById(`dotwallet-login${buttonID}`);
}
