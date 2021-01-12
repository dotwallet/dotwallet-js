import { render } from './helpers';

export class LoginButton {
  render = (node: Element) => {
    render(node, this.testTemplate);
  };
  testTemplate = `<p>hello dotwallet</p>`;
}
