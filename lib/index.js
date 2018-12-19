import React from 'react'

const LuisClient = require('./clients/luis')
const OffersClient = require('./clients/offers')
const translate = require('./translate.js')

const validIntents = (intent) => {
  return intent === 'Shopping.FindProduct'
    || intent === 'Shopping.GetDetails'
    || intent === 'Shopping.FindProduct.Eligibility' // TODO should do extra things here
}

class Bot extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      response: null
    }
  }

  componentDidMount() {
    this.fetchData()
    this.fetchQual()
  }

  async getOffers(queryText) {
    const luis = new LuisClient('03e86b807b3d4728b6b8a40dea6356bf', true)
    const offers = new OffersClient()

    const customerIntent = (await luis.getIntent(queryText)).intent

    if (validIntents(customerIntent)) {
      const products = await luis.getProducts(queryText)
      console.log('Products', products)

      const tags = translate.tagsFromInternetProduct(products[0])
      if (tags.length <= 0) { throw new Error('bummer') }

      const foundOffers = await offers.getOffers(tags)
      console.log('Number of offers found', foundOffers.length)

      return foundOffers.map((offer) => {
        return {
          name: offer.name,
          price: offer.price
        }
      })
    }

    console.log('The intent', customerIntent)
    return {}
  }


  async fetchQual() {
    const response = await fetch(new Request('https://api.stage.digital.telus.com/api/v5/service/search?address=4364%20Prince%20Albert%20St%2C%20Vancouver%2C%20BC', {
        method: 'GET',
        credentials: 'include',
        headers: {
          't-target': 'qualification'
        }
      }
    ))
    const json = await response.json()
    await this.setContext(json.addressMatches.locationId)
  }


  async setContext(id) {
    const response = await fetch(new Request('/shop/home/api/v1/context', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          lpdsId: id
        })
      }
    ))
  }

  async fetchData() {
    const response = await fetch(new Request('https://api.stage.digital.telus.com/api/messages', {
      method: 'GET',
      credentials: 'include',
      headers: {
        't-target': 'smart-cart'
      }
    }
  ))
  console.log(await response.json())
  }

  submit() {
    
  }

  render() {
    return (
      <form onSubmit={this.submit}>
         <textArea type="test" name="test" placeholder={this.props.placeholder} />
         <button type="submit" />
      </form>

    )
  }
}

export default Bot


