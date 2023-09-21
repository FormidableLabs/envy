#! /bin/bash -e

# This script will build and install the webui package
# into your global npm cache to test the dist
# Run this script from the repository root

yarn install
yarn build --force

cd packages/webui

NAME="$(npm pack)"
npm install -g "./$NAME"
npx @envyjs/webui
