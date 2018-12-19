const LuisClient = require('./clients/luis');
const OffersClient = require('./clients/offers');
const translate = require('./translate.js');

const validIntents = (intent) => {
  return intent === 'Shopping.FindProduct'
    || intent === 'Shopping.GetDetails'
    || intent === 'Shopping.FindProduct.Eligibility'; // TODO should do extra things here
};

const getOffers = async (queryText) => {
  const luis = new LuisClient('03e86b807b3d4728b6b8a40dea6356bf', true);
  const offers = new OffersClient();

  const customerIntent = (await luis.getIntent(queryText)).intent;

  if (validIntents(customerIntent)) {
    const products = await luis.getProducts(queryText);
    console.log('Products', products);

    const tags = translate.tagsFromInternetProduct(products[0]);
    if (tags.length <= 0) { throw new Error('bummer'); }

    const foundOffers = await offers.getOffers(tags);
    console.log('Number of offers found', foundOffers.length);

    return foundOffers.map((offer) => {
      return {
        name: offer.name,
        price: offer.price
      };
    });
  }

  console.log('The intent', customerIntent);
  return {};
};


module.exports = {
  getOffers
};

