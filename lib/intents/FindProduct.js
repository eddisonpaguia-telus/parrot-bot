const OffersClient = require('../clients/offers');
const translate = require('../translate')


const getOffers = async (tags) => {
  const oc = new OffersClient();
  return oc.getOffers(tags)
}

// Assumptions:
// * internet only entity
// * only one entity

/* 
{
  entity: 'internet',
  type: 'product'
} 
*/


module.exports = async (entities) => {

  console.log('entities', entities)

  const isProductDefined     = entities.some((entity) => entity.type === 'Product'),
        isSpeedDefined       = entities.some((entity) => entity.type === 'Speed'),
        isTermDefined        = entities.some((entity) => entity.type === 'Term')

  let tagQuery = []

  console.log(entities.find((entity) => entity.type === 'Product'))
  console.log(entities.find((entity) => entity.type === 'Speed'))
  console.log('isProductDefined', isProductDefined)
  
  if(isProductDefined) {
    if(entities.find((entity) => entity.type === 'Product').entity === 'internet') {
      tagQuery.push('service')
    }

    tagQuery.push(entities.find((entity) => entity.type === 'Product').entity)
  }

  if(isSpeedDefined) {
    tagQuery.push(`download-${entities.find((entity) => entity.type === 'Speed').entity}`)
  }

  if(isTermDefined) {
    // assuming they always want MTM for now
    if(entities.find((entity) => entity.type === 'Term').entity) {
      tagQuery.push('mtm')
    }
  }

  const offers = tagQuery.length > 0 ? (await getOffers(tagQuery)).filter((offer) => !offer.tags.includes('optik')) : []

  return {
    offers: offers,
    message: offers.length > 0 ? `
      We have the following services available.
      ${offers.map((offer, index) => `
      <br><br>(${index}) <strong style="font-weight: 600;" >${offer.name}</strong> for $${offer.price / 100} ${offer.rules.eligibility.term.length > 0 ? `on a ${offer.rules.eligibility.term.length} month term.` : 'with no term'}    
      ` )}
      <br><br><strong style="font-weight: 600; color: #248700">Which one would you like to add to the cart?</strong>` : 'We did not find any products.'
  }
};

