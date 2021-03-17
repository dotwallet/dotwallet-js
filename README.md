# dotwallet-js

Quickly add DotWallet functionality to your JavaScript front-end application or website.

Includes:
- A login button and hidden element to handle login redirects
- A payments button
- An 'Automatic Payments' button (can also be invisible and called programattically) 

## To use

```js
// In script tag:
<script src="https://unpkg.com/@dotwallet/js/dist/dotwallet.umd.js"></script>

// As import
npm i @dotwallet/js
```

Please see the examples in ./examples


## to dev

```bash
yarn install
cd examples/as-import && yarn install
# back to the root
cd ../../

# you need to create a symlink to use local files for the vue app test
yarn build
npm link
cd ./examples/as-import/ && npm link dotwallet-js

# back to the root
cd ../../
yarn dev:module
# or
yarn dev:main
```
