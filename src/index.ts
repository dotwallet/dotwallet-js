import { login } from "./features/login";
import { loginRedirect } from "./features/loginRedirect";
import { pay } from "./features/pay";
import { autoPay } from "./features/autoPay";

export class DotWallet {
  loginButton = login;
  loginRedirect = loginRedirect;
  payButton = pay;
  autoPayButton = autoPay;
}

export default new DotWallet();
