import evbus from './evbus';

/**
 * Provides general purpose SSR methods
 * @mixin
 */
export const RiotFrontLess = {

  /**
   * @property {string|null} - a unique tag id, the same on client and server
   * */
  _id: null,

  /**
   * @property {Riot.Observer} - an event bus
   * */
  bus: null,

  /** Initialize FrontLess mixin.
   *  @listens this#before-mount
   *  @emits this#server
   */
  init() {
    if (this.isServer()) {
      this.opts.req = this.parent ?
            this.parent.opts.req : (this.opts.req || {});
      this.opts.req.tags = this.opts.req.tags || [];
      this.opts.req.tags.push(this);

      this.on('before-mount', () => {
        /**
         * @event this#server
        */
        this.trigger('server');
      });

      this.on('before-ready', this.setInitialState);
    } else {
      this.opts.req = this.parent ?
              this.parent.opts.req || {} : {};
    }

    if (!this.bus) {
      this.bus = this.parent ? this.parent.bus : evbus;
    }

    this.on('mount', ()=>{
      this.setUID();
      this.initState();
    });
  },

  /** @return {boolean} */
  isServer() {
    return !process.browser;
  },

  /** @return {boolean} */
  isClient() {
    return !!process.browser;
  },

  /** Unwrap tag content */
  unwrapAsync() {
    this.on('before-ready', () => {
      this.unwrap();
    });
  },

  /** Unwrap tag content */
  unwrap() {
    if (this.root.parentNode) {
      this.root.parentNode.innerHTML = this.root.innerHTML;
    }
  },

  /** Set a unique tag id */
  setUID() {
    if (!this._id) {
      const tagName = this.root.tagName;

      if (this.opts.req) {
        this.opts.req._counters = this.opts.req._counters || {};
      }
      const stack = this.opts.req._counters;
      stack [tagName] = stack [tagName] || 0;
      stack [tagName] ++;
      this._id = tagName + stack [tagName];
    }
    // subscribe tag on updates
    this.bus.on('update:'+this._id, (data, opts) => {
      Object.entries(data).map((entry) => {
        const [key, value] = entry;
        if (typeof this [key] !== 'function') {
          this [key] = value;
        }
      });
      this.update();
    });
  },

  /**
   * Cache a tag context into an JSON object for initialization on client.
   * Later its content gets to the `<meta name="state" />` header.
   * !! Variables and method names starting with '_' are omitted
   * */
  setInitialState() {
    if (this.isServer()) {
      this.opts.req.initialState = this.opts.req.initialState || {};
      this.opts.req.tags.map((tag) => {
        const cookedData = JSON.stringify(tag,
            (key, value) => {
              if (key.startsWith('_')) {
                return undefined;
              }
              if (typeof value === 'function') {
                return undefined;
              }
              if (key === 'bus') {
                return undefined;
              }
              if (key === 'opts') {
                const data = {...tag.opts};
                delete data ['req'];
                return data;
              }
              return value;
            });
        this.opts.req.initialState [tag._id] = JSON.parse(cookedData);
        this.update();
      });
    }
  },

  /**
   * Used only on client to inialize tags contents and
   * state from inital state sent by server.
   * Reads from the `<meta name="state" />` header.
   * @listens this#before-mount
   * */
  initState() {
    if (!this.isServer()) {
      const meta = Array.from(document.getElementsByTagName('meta'))
          .find((e) => e.name === 'state');
      const cache = JSON.parse( meta.getAttribute('content') || '{}');
      const data = cache [this._id];
      this.update(data);
    }
  },

  /**
   *
   * @param {string|Object} tagContext - Uniq tag or an object containing _id
   * @param {Object} data - object with data
   * @return {{ opts: {_id: "uniq-tag-id"}, data:{} }}
   */
  MESSAGE(tagContext, data) {
    if (typeof tagContext === 'string') {
      tagContext = {
        _t: '/m/',
        _id: tagContext,
      };
    }
    if (!tagContext) {
      tagContext = this;
    }
    return {
      opts: {
        _t: '/m/',
        _id: tagContext._id,
        ...tagContext.opts,
      },
      data,
    };
  },

  /**
   * Update a tag from context
   * @param {{opts:{_id: "uniq-tag-id"}, data: {}}} message - an update message
   */
  RECEIVE(message) {
    const {opts, data} = message;
    if (opts && opts._t === '/m/') {
      this.bus.trigger('update:'+opts._id, data, opts);
    }
  },

  /**
   * Update a tag from context
   * @param {{opts:{_id: "uniq-tag-id"}, data: {}}} message - an update message
   * @return {["tag_id", Object]}
   */
  PARSE(message) {
    const {opts, data} = message;
    if (opts && opts._t === '/m/') {
      return [opts._id, data];
    }
  },

};

export default RiotFrontLess;
