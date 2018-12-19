#!/bin/sh
set -o nounset -o errexit
cd `dirname $0`

# Download and initialize shippy
if ! which shippy > /dev/null 2>&1
then
  npm i -g @telusdigital/shippy-cli
fi
shippy init
shippy login --silent

# Copy shared .npmrc read token for pulling TelusDigital NPM libraries.
if test -e ./.npmrc
then
  exit 0
fi
shippy get secret npmrc-dev --common --field=npmrc > .npmrc

# Install packages
npm run setup-local
npm install
