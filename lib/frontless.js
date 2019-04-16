import {Component, createElement} from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics'
import bus from './evbus';

/**
   * Serialize a form to object
   * @param {HTMLFormElement} element - a <form> element
   * @return {object}
  */
export function form(element) {
  let result = {};
  new FormData(element).forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

/**
   * Construct a component state message
   * @param {string} id - Uniq component _id
   * @param {Object} data - object with data
   * @return {Object} - `{ opts: {_id: "uniq-comp-id"}, data:{} }`
   */
export function MESSAGE(id, data) {
  return {
    opts: {
      _t: '/m/',
      _id: id,
    },
    data,
  };
}

/**
   * Parse 3S message
   * @param {Object} message - an message: `{opts:{_id: "uniq-id"}, data: {}}`
   * @return {Array} - `["compoenent_id", Object]`
   */
export function PARSE(message) {
    const {opts, data} = message;
    if (opts && opts._t === '/m/') {
      return [opts._id, data];
    }
}

export const withFrontless = DecoratedComponent => {
  
  class Frontless extends Component {
    
    constructor(props) {
      super(props);
      this.state = {}
    }
    
    subscribeToSSS() {
      if (typeof window !== 'undefined') {
        const eventName = 'update:' + DecoratedComponent.displayName;
        const handler = (props) => {
          this.setState({ ...props })
        };
        bus.removeAllListeners(eventName);
        bus.on(eventName, handler)
      }
    }

    render() {
      this.subscribeToSSS();
      return createElement(DecoratedComponent,{...this.props, ...this.state}, null)
    }
  }

  Frontless.ssrWaitsFor = DecoratedComponent.ssrWaitsFor
  Frontless.fetchData = DecoratedComponent.fetchData
  Frontless.displayName = DecoratedComponent.displayName || DecoratedComponent.name

  return hoistNonReactStatics(Frontless, DecoratedComponent)
};