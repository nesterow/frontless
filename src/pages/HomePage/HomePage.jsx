import React, { Component } from 'react'
import { withRouter } from 'react-router'
import {Link} from 'react-router-dom';
import './HomePage.scss';

import {withFrontless} from 'lib/frontless'
import client from '@/client';

class HomePage extends Component {
  
  static displayName = 'homePage'

  static fetchData ({req, res, match}) {
    return client.service('/ping').get('ping').then((res)=>{
      return {...res.data}
    })
  }

  render () {
    const { data } = this.props // from the json above

    return (
      <div>
        <Link to="/about">About</Link>
        <button onClick={() => { client.service('/ping').get('ping') }}>update</button>
        <p>Response: {data}</p>
      </div>
    )
  }
}

const homeComponentID = withRouter(
  withFrontless(HomePage)
)
export default homeComponentID
