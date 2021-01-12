import { LoginButton } from './lib/login';

export class DotWallet {
  login = LoginButton;
  test = 'test';
}

export {};
declare global {
  interface Window {
    dotwallet: DotWallet;
  }
}
console.log('module loaded!');
window.dotwallet = new DotWallet();
export default DotWallet;
