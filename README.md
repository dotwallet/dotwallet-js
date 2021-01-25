# dotwallet-js

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
