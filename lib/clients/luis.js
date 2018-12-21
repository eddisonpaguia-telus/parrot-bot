const axios = require('axios');

const supportedEntities = ['Product', 'Speed', 'Term', 'UserSelection']

class LuisClient {
  constructor(key, isStaging) {
    const host = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/00333d34-afb8-409f-b148-eed60b8ffd4a';
    this.url = `${host}?staging=false&verbose=true&timezoneOffset=-360&subscription-key=${key}`;

    this.cache = {};
  }

  _updateCache(key, data) {
    if (this.cache[key]) {
      return;
    }

    this.cache[key] = data;
  }

  _getFromCache(key) {
    if (this.cache[key]) {
      return this.cache[key];
    }

    return;
  }

  async _getData(queryText) {
    let data = this._getFromCache(queryText);

    if (!data) {
      const url = `${this.url}&q=${encodeURI(queryText)}`;
      console.log('URL for luis', url)
      let response = await axios.get(url);
      data = response.data;

      this._updateCache(queryText, response.data);
    }

    return data;
  }


  async getIntent(queryText) {
    let data = await this._getData(queryText);

    return data.topScoringIntent;
  }

  async getEntities(queryText) {
    let data = await this._getData(queryText);
    console.log('All ze data', data)
    return data.entities
      .filter((entity) => {
        return supportedEntities.includes(entity.type);
      })
  }

}

module.exports = LuisClient;

