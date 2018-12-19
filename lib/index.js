import React from 'react'

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