import React, { Component } from 'react'
import './HomePage.scss';

class HomePage extends Component {
  static fetchData () {
    return new Promise((resolve, reject) => {
      resolve({
        userId: 123,
        title: 'That guy',
        body: 'fat'
      })
    })
  }

  render () {
    const { userId, id, title, body } = this.props // from the json above

    return (
      <div key={id}>
        <p>User ID: {userId}</p>
        <p>Title: {title}</p>
        <p>Body: {body}</p>
      </div>
    )
  }
}

export default HomePage
