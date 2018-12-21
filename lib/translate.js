const tagsFromInternetProduct = (internetProductEntity) => {
  let items = internetProductEntity.split(' ');

  if (items[0].toLowerCase() === 'internet') {
    if (items.length > 1) {
      let speed = parseInt(items[1]);
      if (isNaN(speed)) {
        return ['internet', 'service'];
      }

      return ['internet', `download-${speed}`, 'service'];
    } else {
      return ['internet', 'service'];
    }
  }
};

module.exports = {
  tagsFromInternetProduct
};

