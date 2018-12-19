const axios = require('axios');

class OffersClient {
  constructor() {
    this.host = 'https://offers-stage-o-api-platform.c1b9.telusdigital.openshiftapps.com/api/v2/offers';
  }

  async getOffers(tags = []) {
    console.log('setting tags', tags);
    let response = await axios.get(`${this.host}?filter[tags]=${tags.join(',')}`);
    return response.data;
  }
}

module.exports = OffersClient;

