import { login } from './features/login';
import { loginRedirect } from './features/loginRedirect';

export class DotWallet {
	test = 'Hello DotWallet';
	login = login;
	loginRedirect = loginRedirect;
}

export default new DotWallet();
