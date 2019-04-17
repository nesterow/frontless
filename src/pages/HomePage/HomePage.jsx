import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import { withRouter } from 'react-router'
import {withFrontless} from 'lib/frontless'

import client from '@/client';
import Appbar from 'muicss/lib/react/appbar';
import Button from 'muicss/lib/react/button';
import Container from 'muicss/lib/react/container';

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
       <Appbar><p>Response: {data}</p></Appbar>
        <Container>
          <Link to="/playground">
            <Button color="primary">button</Button>
          </Link>
        </Container>
      </div>
    )
  }
}

const homeComponentID = withRouter(HomePage)
export default homeComponentID
