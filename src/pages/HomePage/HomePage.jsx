import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import './HomePage.scss';

import {withFrontless} from 'lib/frontless'
import lient from '@/client';

class HomePage extends Component {

  static fetchData () {
    return new Promise((resolve, reject) => {
      resolve({
        userId: '123',
        title: 'That guy',
        body: 'fat'
      })
    })
  }

  render () {
    const { userId, id, title, body } = this.props // from the json above

    return (
      <div key={id}>
        <Link to="/about">About</Link>
        <p>User ID: {userId}</p>
        <p>Title: {title}</p>
        <p>Body: {body}</p>
      </div>
    )
  }
}

const homeComponentID = withFrontless(HomePage)

export default homeComponentID
