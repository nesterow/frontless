import * as riot from 'riot';

/**
 * Provides isomorphic methods for asyncronous rendering.
 * @example
 * this.await('load posts')
 * fetch('/blog/posts').then(() => {
 *  this.done('load posts')
 * })
 * @mixin
 */
export const RiotWaiter = {

  _waitBounce: 0,
  _waitBounceTimeout: 0,
  _isAwaiting: false,
  /** A stack of all async operations invoked in current context and children*/
  _readyPromises: [],

  init() {
    this._readyPromises = this.parent ? this.parent._readyPromises : [];
    setTimeout(()=> this._waitReadyState());
  },

  /**
   * Emits 'ready' event for async render when all
   * children reported to finish performing async operations
   * @emits this#ready
   * @emits this#before-ready
  */
  _waitReadyState() {
    clearTimeout(this._waitBounce);
    this._waitBounce = setTimeout(() => {
      const operations = this._readyPromises.map((e) => e.promise);

      const timeout = setTimeout(() => done(),
          riot.settings.asyncRenderTimeout - 500);

      const done = () => {
        this.trigger('before-ready');
        while (this._readyPromises.pop()) {} ;
        this._isAwaiting = false;
        this.trigger('ready');
        clearTimeout(timeout);
      };

      Promise.all(operations)
          .then(done).catch(done);
    },
    this._waitBounceTimeout);
  },

  /**
   * Indicates start of an async operation.
   * All async operations must be named.
   * @example
   * this.await('load posts')
   * @emits this#awaiting
   * @param {string} name  - name of the async operation
   */
  await(name) {
    if (!this._isAwaiting) {
      this.trigger('awaiting', name);
      this.trigger('awaiting:' + name);
    }

    this._isAwaiting = true;
    let _resolve;
    const promise = {
      name: name + this._riot_id,
      done: false,
      promise: new Promise((resolve) => _resolve = resolve),
    };
    promise.resolve = _resolve;
    setTimeout(() => {
      promise.resolve();
      if (!promise.done) {
        this._isAwaiting = false;
        console.error(` RiotWaiter >>>
          Async operation "${name}" was not finished properly. 
          Perhaps missing 'this.done("${name}")'.
        `);
      }
    }, riot.settings.asyncRenderTimeout - 500);
    this._readyPromises.push(promise);
    this._waitReadyState();
  },

  /**
   * Indicates end of an asyc operation.
   * @example
   * this.done('load posts')
   * @emits this#done
   * @param {string} name - name of the async operation
   */
  done(name) {
    const op = this._readyPromises
        .find((e) => e.name === (name + this._riot_id));
    if (op) {
      op.resolve();
      op.done = true;
    }
    this.trigger('done', name);
    this.trigger('done:' + name);
  },
};

export default RiotWaiter;
