import { v4 as uuid } from 'uuid';
import { html, render } from 'lit-html';
import { DOTWALLET_API } from '../config';
const engButton = require('../../assets/dotwallet-login-button-blue-254x48-en.svg');
const zhButton = require('../../assets/dotwallet-loginbutton-blue-152x48-zh.svg');

export interface LoginOptions {
	clientID: string;
	scope: string;
	lang?: 'en' | 'zh';
	redirectURI: string;
	log: boolean;
}

const validate = (redirectURI: string): string => {
	try {
		if (!redirectURI.includes('http://') || redirectURI.includes('https://')) {
			return 'invalid redirect URI';
		} else return 'valid';
	} catch (error) {
		return JSON.stringify(error);
	}
};

export function login(
	elementID: string,
	{
		clientID,
		scope = 'user.info',
		lang = 'en',
		redirectURI,
		log = false,
	}: LoginOptions
) {
	const valid = validate(redirectURI);
	if (valid !== 'valid') {
		if (log) console.log(valid);
		return;
	}

	const template = (buttonID: string, style: string) => html`
		<div id="dotwallet-login${buttonID}"></div>
		<style>
			${style}
		</style>
	`;

	const element = document.getElementById(elementID);
	const buttonID = uuid();
	// style template above does not accept string interpolation with ${ }
	const style = `
	#dotwallet-login${buttonID} {
		width: ${lang === 'zh' ? '152' : '254'}px;
		height: 48px;
		cursor: pointer;
		box-shadow: 0 0 10px gray;
		background: url(${lang === 'en' ? engButton : zhButton})
	}
	#dotwallet-login${buttonID}:hover {
		box-shadow: 0 0 10px rgb(40, 40, 40);
	}
	#dotwallet-login${buttonID}:active {
		opacity: 0.7;
	}`;
	const openLink = (scope: string, redirectURI: string, clientID: string) => {
		const scopeEncoded = encodeURIComponent(scope);
		const redirectURIEncoded = encodeURIComponent(redirectURI);
		const loginState = uuid();
		localStorage.setItem('dotwalletLoginState', loginState);
		localStorage.setItem('dotwalletLoginRedirectUri', redirectURI);
		const url = `${DOTWALLET_API}oauth2/authorize?client_id=${clientID}&redirect_uri=${redirectURIEncoded}&response_type=code&state=${loginState}&scope=${scopeEncoded}`;
		window.location.href = url;
	};
	render(template(buttonID, style), element);
	const button = document.getElementById(`dotwallet-login${buttonID}`);
	button.addEventListener('click', () => {
		openLink(scope, redirectURI, clientID);
	});
}
