import React, { Component } from 'react'

class HomePage extends Component {
  static fetchData () {
    return new Promise((resolve, reject) => {
      resolve({
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
