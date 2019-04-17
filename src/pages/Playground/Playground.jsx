import React, { Component } from 'react'
import classNames from 'classnames';
import {Link, Route, Switch} from 'react-router-dom';
import { withRouter } from 'react-router'
import {withFrontless} from 'lib/frontless'
import Container from 'muicss/lib/react/container'
import RandomNumber from './RandomNumber.jsx';

const NotFound = () => (
  <h2>
    Not Found
  </h2>
)



const Playground = (props) => {
  const {pathname} = props.location;
  const isActive = (path) => classNames({'mui--is-active': pathname === path})
  return (
    <section className="playground">
      <Container>
        <ul className="mui-tabs__bar">
          <li className={isActive('/playground')}>
            <Link to='/playground'>Server Sent State</Link>
          </li>
          <li className={isActive('/playground/api')}>
            <Link to='/playground/api'>Working with API</Link>
          </li>
          <li className={isActive('/playground/forms')}>
            <Link to='/playground/forms'>Working With Forms</Link>
          </li>
          <li className={isActive('/playground/sockets')}>
            <Link to='/playground/sockets'>Working With Sockets</Link>
          </li>
        </ul>
        <Switch>
          <Route exact path="/playground" component={ RandomNumber } />
          <Route component={ NotFound } />
        </Switch>
      </Container>
    </section>
  )
}

Playground.displayName = 'Playground'
Playground.ssrWaitFor = [
  RandomNumber.fetchData
]

const PlaygroundComponent = withRouter(
  withFrontless(
    Playground
  )
)

export default PlaygroundComponent