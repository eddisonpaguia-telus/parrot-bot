const intent = require('./intent');

class LuisClient {
  constructor(key, isStaging) {
    const host = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/00333d34-afb8-409f-b148-eed60b8ffd4a';
    this.url = `${host}?staging=${isStaging}&verbose=true&timezoneOffset=-360&subscription-key=${key}`;
  }

  async getIntent(queryText) {
    const url = `${this.url}&q=${queryText}`;
    return intent(url);
  }
}

module.exports = LuisClient;

