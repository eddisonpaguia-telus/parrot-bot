# Parrot Bot

[![version][npm-image]][npm-url] [![Build Status][circle-image]][circle-url]

> ¯\_(ツ)_/¯ .

## Install

```bash
npm install @telus/parrot-bot
```

For local development, also run:
```bash
npm run setup-local
```

## Using Postman

1. Load the environments and collection into Postman
1. Change the URL parameter `q` to include your query

## Test file

For testing the lib locally. Yay, hacks.

## Usage

```js
const Parrot = require('@telus/parrot-bot');

let client = new Parrot('some key');

let expectedIntent = client.getIntent('add internet 25 to cart');
```

---
> Github: [@telus](https://github.com/telus) &bull; 
> Twitter: [@telusdigital](https://twitter.com/telusdigital)

[circle-url]: https://circleci.com/gh/telus/parrot-bot
[circle-image]: https://img.shields.io/circleci/project/github/telus/parrot-bot/master.svg?style=for-the-badge&logo=circleci

[npm-url]: https://www.npmjs.com/package/@telus/parrot-bot
[npm-image]: https://img.shields.io/npm/v/@telus/parrot-bot.svg?style=for-the-badge&logo=npm
