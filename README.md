# dotwallet-js

## to dev

```bash
# you need to create a symlink to use local files for the vue app test
npm link
cd ./examples/as-import/ && npm link dotwallet-js

yarn install
cd examples/as-import && yarn install
# back to the root
cd ../../

yarn dev:module
# or
yarn dev:main
```
