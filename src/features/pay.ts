import { v4 as uuid } from "uuid";
import { html, render } from "lit-html";
import { DOTWALLET_API } from "../config";
const engButton = require("../../assets/dotwallet-pay-button-blue-138x48-en.svg");
const zhButton = require("../../assets/dotwallet-paybutton-blue-152x48-zh.svg");

export interface PayOptions {
  productName: string;
  orderAmount: number;
  createOrderEndpoint: string;
  receiveAddress: string;
  productDetail?: string;
  redirectURI?: string;
  notifyURL?: string;
  subject?: string;
  coinType?: string;
  fetchHeaders?: Record<string, string>;
  fetchOptions?: Record<string, string>;
  log?: boolean;
  lang?: "en" | "zh";
  successCallback?: (orderData: any) => any;
  failureCallback?: (error: any) => any;
}

const validate = (options: PayOptions): string => {
  let result = "";
  try {
    if (!options.productName) result += "Must have productName. \n";
    if (!options.orderAmount) result += "Must have orderAmount. \n";
    if (!options.createOrderEndpoint)
      result += "Must have createOrderEndpoint. \n";
    if (!options.receiveAddress) result += "Must have receiveAddress. \n";
    if (!options.notifyURL && !options.redirectURI)
      result += "Must have either notifyURL or redirectURI. \n";
    if (options.redirectURI)
      if (
        !options.redirectURI.includes("http://") &&
        !options.redirectURI.includes("https://")
      )
        result += "Invalid redirect URI. \n";
    if (options.notifyURL)
      if (
        !options.notifyURL.includes("http://") &&
        !options.notifyURL.includes("https://")
      )
        result += "Invalid notifyURL. \n";
    if (
      !options.createOrderEndpoint.includes("http://") &&
      !options.createOrderEndpoint.includes("https://")
    )
      result +=
        "Invalid createOrderEndpoint. Please use your backend server endpoint URI. \n";
    if (["en", "zh"].indexOf(options.lang) === -1)
      result += "Invalid language option \n";
    if (["BSV", "BTC", "ETH"].indexOf(options.coinType) === -1)
      result += "Invalid cointype option. \n";
    if (
      25 > options.receiveAddress.length ||
      options.receiveAddress.length > 36
    )
      result += "Invalid address (length not between 25-36 characters). \n";

    if (result === "") return "valid";
    else return result;
  } catch (error) {
    return JSON.stringify(error);
  }
};

export function pay(elementID: string, options: PayOptions) {
  if (!options.lang) options.lang = "en";
  if (!options.coinType) options.coinType = "BSV";

  const valid = validate(options);
  if (valid !== "valid") {
    if (options.log) console.log(valid);
    return;
  }
  const template = (buttonID: string, style: string) => html`
    <div id="dotwallet-pay${buttonID}"></div>
    <style>
      ${style}
    </style>
  `;
  const element = document.getElementById(elementID);
  const buttonID = uuid().slice(0, 10);
  // style template above does not accept string interpolation with ${ }
  const style = `
	#dotwallet-pay${buttonID} {
		width: ${options.lang === "zh" ? "152" : "138"}px;
		height: 48px;
		cursor: pointer;
		box-shadow: 0 0 10px gray;
		background: url(${options.lang === "en" ? engButton : zhButton})
	}
	#dotwallet-pay${buttonID}:hover {
		box-shadow: 0 0 10px rgb(40, 40, 40);
	}
	#dotwallet-pay${buttonID}:active {
		opacity: 0.7;
	}`;
  const pay = (options: PayOptions) => {
    const orderData: any = {
      out_order_id: uuid(),
      coin_type: options.coinType,
      to: [
        {
          type: "address",
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
    if (options.redirectURI) orderData.redirect_uri = options.redirectURI;
    if (options.subject) orderData.subject = options.subject;
    if (options.log) console.log("order data:\n", orderData);
    const fetchOptions: any = {
      method: "POST",
      body: JSON.stringify(orderData),
    };
    if (options.fetchHeaders)
      fetchOptions.headers = {
        ...options.fetchHeaders,
      };
    else {
      fetchOptions.headers = {
        "Content-type": "application/json; charset=UTF-8",
      };
    }
    if (options.fetchOptions)
      for (const option in options.fetchOptions)
        fetchOptions[option] = options.fetchOptions[option];
    if (options.log) console.log("fetch options:\n", options);

    fetch(options.createOrderEndpoint, fetchOptions)
      .then((orderResponse) => orderResponse.json())
      .then((orderData) => {
        if (options.log) console.log("order response data:\n", orderData);
        if (orderData.order_id) {
          if (options.log) console.log({ orderData });
          window.location.href = `${DOTWALLET_API}transact/order/apply_payment?order_id=${orderData.order_id}`;
          if (options.successCallback) options.successCallback(orderData);
        } else {
          if (options.failureCallback) options.failureCallback(orderData);
          if (options.log) console.log({ orderData });
        }
      })
      .catch((error) => {
        if (options.failureCallback) options.failureCallback(error);
        if (options.log) console.log({ error });
      });
  };
  render(template(buttonID, style), element);
  const button = document.getElementById(`dotwallet-pay${buttonID}`);
  button.addEventListener("click", () => {
    pay(options);
  });
}
