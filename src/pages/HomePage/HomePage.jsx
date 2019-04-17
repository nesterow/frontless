import React, { Component } from 'react'
import { withRouter } from 'react-router'
import {Link} from 'react-router-dom';

import {withFrontless} from 'lib/frontless'
import client from '@/client';
import Appbar from 'muicss/lib/react/appbar';
import Button from 'muicss/lib/react/button';
import Container from 'muicss/lib/react/container';
import DatePicker from 'react-datepicker';

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
          <Button color="primary" onClick={() => { client.service('/ping').get('ping') }}>button</Button>
          <DatePicker/>
        </Container>
      </div>
    )
  }
}

const homeComponentID = withRouter(
  withFrontless(HomePage)
)
export default homeComponentID
