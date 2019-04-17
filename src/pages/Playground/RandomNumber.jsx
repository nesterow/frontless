import React, { Component } from 'react'
import { withRouter } from 'react-router'
import {withFrontless, Loader} from 'lib/frontless'
import Panel from 'muicss/lib/react/panel';
import Button from 'muicss/lib/react/button';
import client from '@/client';

import Gists from './Gists.jsx';


class RandomNumber extends Component {
  
  state = {}
  static displayName = 'randomNumber'
  
  static fetchData() {
    return client.service('random').get(' ').then((res) => {
      return res.data
    })
  }

  render() {
    const {number} = this.props;
    return (
      <React.Fragment>
        <Panel>
          <h2>
            <Loader service="random" empty={'0000'} context={this}>
              {number}
            </Loader>
          </h2> 
          <Button color="primary" onClick={ RandomNumber.fetchData } disabled={this.state.loading}>
            Generate Number
          </Button>
        </Panel>
        <Gists id="5a7da8b2ab8715327f1e0f0a5b4fcbbb" files={['RandomNumber.jsx', 'random.service.js']} />
      </React.Fragment>
    )
  }

}


const randomNumber = withRouter(
  withFrontless(
    RandomNumber
  )
)

export default randomNumber

