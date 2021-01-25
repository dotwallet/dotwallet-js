import { login } from "./features/login";
import { loginRedirect } from "./features/loginRedirect";
import { pay } from "./features/pay";

export class DotWallet {
  test = "Hello DotWallet";
  loginButton = login;
  loginRedirect = loginRedirect;
  payButton = pay;
}

export default new DotWallet();
