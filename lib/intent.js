const axios = require('axios');

module.exports = async (url) => {
  let response = await axios.get(url);
  return response.data.topScoringIntent;
};

