/**
 * Provides general purpose SSR methods
 * @mixin
 */
export const RiotFrontLess = {

  /**
   * @property {string|null} - a unique tag id, the same on client and server
   * */
  _uid: null,

  /** @return {boolean} */
  isServer() {
    return !process.browser;
  },

  /** Set a unique tag id */
  setUID() {
    const tagName = this.root.tagName;

    if (this.opts.req) {
      this.opts.req._counters = this.opts.req._counters || {};
    }

    const stack = this.opts.req._counters;
    stack [tagName] = stack [tagName] || 0;
    stack [tagName] ++;
    this._uid = tagName + stack [tagName];
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
              if (key === 'opts') {
                const data = {...tag.opts};
                delete data ['req'];
                return data;
              }
              return value;
            });
        this.opts.req.initialState [tag._uid] = JSON.parse(cookedData);
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
      const data = cache [this._uid];

      if (data) {
        this.on('before-mount', ()=>{
          for (const k in data) {
            if (data.hasOwnProperty(k)) {
              this [k] = data [k];
            }
          }
        });
      }
    }
  },

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

    this.setUID();
    this.initState();
  },
};

export default RiotFrontLess;
