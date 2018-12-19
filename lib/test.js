const lc = require('./index');

let client = new lc('03e86b807b3d4728b6b8a40dea6356bf', true);

client.getIntent('add internet 25 to cart')
  .then((response) => {
    console.log('yay', response);
  })
  .catch((err) => {
    console.log('error', err);
  });
