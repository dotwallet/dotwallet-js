export interface LoginRedirectOptions {
	authEndpoint: string;
	fetchHeaders?: Record<string, string>;
	fetchOptions?: Record<string, string>;
	log: boolean;
	successCallback: (authResponse: any) => any;
	failureCallback: (error: any) => any;
}
const validate = (authEndpoint: string | undefined): string => {
	try {
		if (
			!authEndpoint ||
			(!authEndpoint.includes('http://') && !authEndpoint.includes('https://'))
		) {
			return 'invalid authEndpoint URI: ' + authEndpoint;
		} else return 'valid';
	} catch (error) {
		return JSON.stringify(error);
	}
};

/** Adds a function to window.addEventListener('load', ...)
 * Will examine the URLSearchParam queries for 'state' and 'code'.
 * If present, will send a request to the */
export function loginRedirect({
	authEndpoint,
	fetchHeaders = undefined,
	fetchOptions = undefined,
	log = false,
	successCallback,
	failureCallback,
}: LoginRedirectOptions) {
	const valid = validate(authEndpoint);
	if (valid !== 'valid') {
		if (log) console.log(valid);
		return;
	}
	function callAuthServer(code: string) {
		const options: RequestInit = {
			method: 'POST',
			body: JSON.stringify({
				code,
				redirect_uri: localStorage.getItem('dotwalletLoginRedirectUri'), // this must match step one but not urlencoded
			}),
		};
		if (fetchHeaders)
			options.headers = {
				...fetchHeaders,
				'Content-type': 'application/json; charset=UTF-8',
			};
		else {
			options.headers = {
				'Content-type': 'application/json; charset=UTF-8',
			};
		}
		if (fetchOptions)
			for (const option in fetchOptions) {
				//@ts-ignore
				options[option] = fetchOptions[option];
			}
		if (log) console.log('fetch options:\n', options);
		fetch(authEndpoint, options)
			.then((res) => res.json())
			.then((authResponse) => {
				if (log) console.log('authResponse', JSON.stringify(authResponse));
				successCallback(authResponse);
			})
			.catch((error) => {
				failureCallback(JSON.stringify(error));
				if (log) console.log('error: ', JSON.stringify(error));
			});
	}
	window.addEventListener('load', () => {
		const urlParams = new URLSearchParams(window.location.search);
		const state = urlParams.get('state');
		const code = urlParams.get('code');
		const savedState = localStorage.getItem('dotwalletLoginState');
		if (!code || !state) return;
		if (log) console.log('state, saved state: ', state, savedState);
		if (log)
			console.log('saved state matches returned state: ', savedState === state);
		if (savedState === state) callAuthServer(code);
	});
}
