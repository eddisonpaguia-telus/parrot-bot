import React from 'react'

const LuisClient = require('./clients/luis')
const OffersClient = require('./clients/offers')
const translate = require('./translate.js')
const FindProductIntent = require('./intents/FindProduct')
const BuyItemIntent = require('./intents/BuyItem')

const validIntents = (intent) => {
  return intent === 'Shopping.FindProduct'
    || intent === 'Shopping.GetDetails'
    || intent === 'Shopping.FindProduct.Eligibility' // TODO should do extra things here
}

let lastIntent = null

class Bot extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      response: null,
      query: 'show me internet',
      isEligible: false,
      chosenPlan: '',
      plansFetched: false,
      chosenTerm: '',
      chosenGift: '',
      messages: [
        {sender: 'Luis', message: 'Welcome to the Telus Parrot Chat! My name is Luis. How can I help you today?'}
      ],
      products: []
    }
    this.onChange = this.onChange.bind(this)
    this.submit = this.submit.bind(this)
    this.mapMessages = this.mapMessages.bind(this)
  }

  componentDidMount() {
    this.fetchData()
    this.fetchQual()
  }


  async getMessageFromIntent(queryText) {

    try {
      const luis = new LuisClient('03e86b807b3d4728b6b8a40dea6356bf', true)
      let customerIntent = await luis.getIntent(queryText)
      customerIntent = customerIntent.intent

      if (!customerIntent) {
        customerIntent = lastIntent
      }

      lastIntent = customerIntent
      if (customerIntent === 'Shopping.FindProduct' || customerIntent === 'Shopping.BuyProduct') {
        const entities = await FindProductIntent(await luis.getEntities(queryText))
        this.setState(prevState => ({
          products: entities.offers
        }))
        return entities.message
      }

      if (customerIntent === 'Shopping.AddToCart') {
        const entities = await luis.getEntities(queryText)
        const userSelection = entities.find((entity) => entity.type === 'UserSelection').entity
        this.props.addToCart([{
          qty: 1,
          offer: this.state.products[parseInt(userSelection)].digitalId
        }])

        return `${this.state.products[userSelection].name} has been added to your cart.`
      }
    } catch(e) {
      console.log(e)
    }

    return 'Sorry, I don\'t understand.'
  }

  async getOffers(queryText) {
    const luis = new LuisClient('03e86b807b3d4728b6b8a40dea6356bf', true)

    const customerIntent = (await luis.getIntent(queryText)).intent

    let validOffers = [];
    if (validIntents(customerIntent)) {
      validOffers = await FindProductIntent(await luis.getEntities(queryText))
    }

    return validOffers
  }


  async fetchQual() {
    const lpdsId = '2909523'
    const response = await fetch(new Request(`https://api.stage.digital.telus.com/api/v5/service?locationId=${lpdsId}`, {
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
  }

  async submit(e) {
    e.preventDefault()

    const userMessage = {
      sender: 'Me',
      message: this.state.query
    }

    this.input.value = ''

    this.setState(prevState => ({
      messages: [...prevState.messages, userMessage],
    }), () => {
      setTimeout(() => this.container.scrollTop = this.container.scrollHeight, 10)
    })

    const luisMessage = {
      sender: 'Luis',
      message: await this.getMessageFromIntent(this.state.query)
    }
    this.setState(prevState => ({
      messages: [...prevState.messages, luisMessage]
    }), () => {
      setTimeout(() => this.container.scrollTop = this.container.scrollHeight, 10)
    })

    this.setState({ query: '' })
  }

  mapMessages() {
    const senderStyle = {
      fontWeight: '600'
    }

    const senderImageStyle = {
      width: '100%',
      padding: '5px'
    }

    const getMessageMarkup = (messageObject) => {

      if(messageObject.sender === 'Luis') {
        return (
          <div style={{ maxWidth: '350px', display: 'flex', margin: '1.5rem 0', clear: 'both' }}>
            <div><div style={{ width: '50px', height: '50px',  border: '1px solid #d8d8d8', marginRight: '1rem', borderRadius: '99rem', overflow: 'hidden' }}><img style={senderImageStyle} src="https://i.imgur.com/tOBN0PK.png" /></div></div>
            <div style={{ flex: '1 100%'}}>
              <span style={{ fontWeight: '600'}}>{messageObject.sender}</span>
              <div style={{ background: '#F7F7F8', padding: '1rem', borderRadius: '6px' }} dangerouslySetInnerHTML={{__html: messageObject.message}} />
            </div>
          </div>
        )
      }

      return (
        <div style={{ maxWidth: '350px', display: 'inline-flex', margin: '.75rem 0', float: 'right', clear: 'both' }}>
          <div style={{ flex: '1 100%'}}>
            <div style={{ fontWeight: '600', textAlign: 'right' }}>{messageObject.sender}</div>
            <div style={{ background: '#9b65c9', color: 'white', padding: '1rem', borderRadius: '6px' }} dangerouslySetInnerHTML={{__html: messageObject.message}} />
          </div>
          <div><div style={{ width: '50px', height: '50px', border: '1px solid #d8d8d8', marginLeft: '1rem', borderRadius: '99rem', overflow: 'hidden' }}><img style={senderImageStyle} src="https://images.ctfassets.net/9mt4r6ro1ay9/1EtTz4pYKAwayiy4akKIo4/55d1d962b9653bb5c3b190d79878f6aa/gazania-yellow.png" /></div></div>
        </div>
      )
    }

    return this.state.messages.map((messageObject) => getMessageMarkup(messageObject))
  }

  onChange(e) {
    this.setState({query: e.target.value})
  }

  render() {
    const containerStyle = {
      borderRadius: '4px',
      border: '1px solid #d8d8d8',
      padding: '1rem',
      width: '500px',
      boxShadow: '0 0 16px 0 rgba(213, 213, 213, 0.5)',
      backgroundColor: 'rgba(255,255,255,0.8)'
    }

    const messagesStyle = {
      width: '100%',
      height: '400px',
      overflowY: 'scroll',
      padding: '0 0 2rem',
    }

    const formStyle = {
      display: 'flex',
      width: '100%'
    }

    const butttonStyle= {
      background: '#4B286D',
      width: '100px',
      color: 'white',
      fontWeight: '500',
      borderTopRightRadius: '4px',
      borderBottomRightRadius: '4px',
      border: 'none',
      cursor: 'pointer'
    }

    const textAreaStyle = {
      flex: '1',
      boxShadow: '0 0 16px 0 rgba(213, 213, 213, 0.5)',
      border: '1px solid #d8d8d8',
      borderTopLeftRadius: '4px',
      borderBottomLeftRadius: '4px',
      padding: '.5rem'
    }

    const imageStyle = {
      width: '250px',
      textAlign: 'center'                              
    }        

    return (
      <div style={containerStyle}>
        <img style={imageStyle} src="https://i.imgur.com/ceW0cJz.png" />
        <div style={messagesStyle} ref={(ref) => this.container = ref}>
          {(this.state.messages.length > 0) && this.mapMessages()}
        </div>
        <form onSubmit={this.submit} style={formStyle}>
          <textarea placeholder="Your message..." ref={(_ref) => this.input = _ref } style={textAreaStyle} type="test" name="test"  onKeyUp={this.onChange} />
          <button style={butttonStyle} type="submit"> Send </button>
        </form>
      </div>
    )
  }
}

export default Bot


