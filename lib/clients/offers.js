class OffersClient {
  constructor() {
    this.host = 'https://api.stage.digital.telus.com/api/v2/offers';
  }

  async getOffers(tags = []) {
    console.log('setting tags', tags);
    let response = await fetch(new Request(`${this.host}?filter[tags]=${tags.join(',')}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          't-target': 'offers'
        }
      }
    ))
    return response.json()
  }
}

module.exports = OffersClient;

