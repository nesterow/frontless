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

export class Loader extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      flag: 'empty'
    };
  }

  bindEvents(props) {

    const {service, context} = props;
    const eventService = service ? service + ':' : '';
    const startEventName = eventService + 'start';
    const endEventName = eventService + 'end';
    const errEventName = eventService + 'error';

    const updateContextState = (state) => {
      if (context) {
        context.state = context.state || {};
        context.setState({ ...context.state, ...state });
      }
    }
    
    bus.removeAllListeners(startEventName);
    bus.on(startEventName, (ctx) => {
      this.setState({ flag: 'loading', ctx })
      updateContextState({ loading: true, loadingContext: ctx })
      this.onStart(ctx);
    })

    bus.removeAllListeners(endEventName);
    bus.on(endEventName, (ctx) => {
      this.setState({ flag: 'done', ctx })
      updateContextState({ loading: false, loadingContext: ctx })
      this.onEnd(ctx);
    })

    bus.removeAllListeners(errEventName);
    bus.on(errEventName, (ctx) => {
      this.setState({ flag: 'error', ctx });
      updateContextState({ loading: false, error: true, loadingContext: ctx })
      this.onEnd(ctx);
      this.onError(ctx);
    })
  }

  onStart(ctx) {
    const {onStart} = this.props;
    if (typeof onStart === 'function')
      onStart(ctx);
  }

  onEnd(ctx) {
    const {onEnd} = this.props;
    if (typeof onEnd === 'function')
      onEnd(ctx);
  }

  onError(ctx) {
    const {onError} = this.props;
    if (typeof onError === 'function')
    onError(ctx);
  }

  componentDidMount() {
    this.bindEvents(this.props);
  }

  componentDidUpdate() {
    this.bindEvents(this.props);
  }

  render() {
    const {flag} = this.state
    if (flag === 'done')
      return this.props.children;
    return this.props[flag] || this.props.children || this.props.empty || '....';
  }
}