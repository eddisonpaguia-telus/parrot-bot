const main = require('./index');

main.getOffers('what internet plans are available')
  .then((offers) => {
    console.log('The offers', offers);
  })
  .catch((err) => {
    console.log('ALERT', err);
  });
