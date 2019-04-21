(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function(root,factory){if(typeof exports==="object"&&typeof module==="object")module.exports=factory();else if(typeof define==="function"&&define.amd)define("EventBus",[],factory);else if(typeof exports==="object")exports["EventBus"]=factory();else root["EventBus"]=factory()})(this,function(){var EventBusClass={};EventBusClass=function(){this.listeners={}};EventBusClass.prototype={addEventListener:function(type,callback,scope){var args=[];var numOfArgs=arguments.length;for(var i=0;i<numOfArgs;i++){args.push(arguments[i])}args=args.length>3?args.splice(3,args.length-1):[];if(typeof this.listeners[type]!="undefined"){this.listeners[type].push({scope:scope,callback:callback,args:args})}else{this.listeners[type]=[{scope:scope,callback:callback,args:args}]}},removeEventListener:function(type,callback,scope){if(typeof this.listeners[type]!="undefined"){var numOfCallbacks=this.listeners[type].length;var newArray=[];for(var i=0;i<numOfCallbacks;i++){var listener=this.listeners[type][i];if(listener.scope==scope&&listener.callback==callback){}else{newArray.push(listener)}}this.listeners[type]=newArray}},hasEventListener:function(type,callback,scope){if(typeof this.listeners[type]!="undefined"){var numOfCallbacks=this.listeners[type].length;if(callback===undefined&&scope===undefined){return numOfCallbacks>0}for(var i=0;i<numOfCallbacks;i++){var listener=this.listeners[type][i];if((scope?listener.scope==scope:true)&&listener.callback==callback){return true}}}return false},dispatch:function(type,target){var event={type:type,target:target};var args=[];var numOfArgs=arguments.length;for(var i=0;i<numOfArgs;i++){args.push(arguments[i])}args=args.length>2?args.splice(2,args.length-1):[];args=[event].concat(args);if(typeof this.listeners[type]!="undefined"){var listeners=this.listeners[type].slice();var numOfCallbacks=listeners.length;for(var i=0;i<numOfCallbacks;i++){var listener=listeners[i];if(listener&&listener.callback){var concatArgs=args.concat(listener.args);listener.callback.apply(listener.scope,concatArgs)}}}},getEvents:function(){var str="";for(var type in this.listeners){var numOfCallbacks=this.listeners[type].length;for(var i=0;i<numOfCallbacks;i++){var listener=this.listeners[type][i];str+=listener.scope&&listener.scope.className?listener.scope.className:"anonymous";str+=" listen for '"+type+"'\n"}}return str}};var EventBus=new EventBusClass;return EventBus});
},{}],2:[function(require,module,exports){
/* Riot v4.0.0-rc.2, @license MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.riot = {}));
}(this, function (exports) { 'use strict';

  const COMPONENTS_IMPLEMENTATION_MAP = new Map(),
        DOM_COMPONENT_INSTANCE_PROPERTY = Symbol('riot-component'),
        PLUGINS_SET = new Set(),
        IS_DIRECTIVE = 'is',
        ATTRIBUTES_KEY_SYMBOL = Symbol('attributes'),
        TEMPLATE_KEY_SYMBOL = Symbol('template'),
        SLOTS_KEY_SYMBOL = Symbol('slots');

  var globals = /*#__PURE__*/Object.freeze({
    COMPONENTS_IMPLEMENTATION_MAP: COMPONENTS_IMPLEMENTATION_MAP,
    DOM_COMPONENT_INSTANCE_PROPERTY: DOM_COMPONENT_INSTANCE_PROPERTY,
    PLUGINS_SET: PLUGINS_SET,
    IS_DIRECTIVE: IS_DIRECTIVE,
    ATTRIBUTES_KEY_SYMBOL: ATTRIBUTES_KEY_SYMBOL,
    TEMPLATE_KEY_SYMBOL: TEMPLATE_KEY_SYMBOL,
    SLOTS_KEY_SYMBOL: SLOTS_KEY_SYMBOL
  });

  /**
   * Converts any DOM node/s to a loopable array
   * @param   { HTMLElement|NodeList } els - single html element or a node list
   * @returns { Array } always a loopable object
   */
  function domToArray(els) {
    // can this object be already looped?
    if (!Array.isArray(els)) {
      // is it a node list?
      if (/^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(els)) && typeof els.length === 'number') return Array.from(els);else // if it's a single node
        // it will be returned as "array" with one single entry
        return [els];
    } // this object could be looped out of the box


    return els;
  }

  /**
   * Normalize the return values, in case of a single value we avoid to return an array
   * @param   { Array } values - list of values we want to return
   * @returns { Array|string|boolean } either the whole list of values or the single one found
   * @private
   */

  const normalize = values => values.length === 1 ? values[0] : values;
  /**
   * Parse all the nodes received to get/remove/check their attributes
   * @param   { HTMLElement|NodeList|Array } els    - DOM node/s to parse
   * @param   { string|Array }               name   - name or list of attributes
   * @param   { string }                     method - method that will be used to parse the attributes
   * @returns { Array|string } result of the parsing in a list or a single value
   * @private
   */


  function parseNodes(els, name, method) {
    const names = typeof name === 'string' ? [name] : name;
    return normalize(domToArray(els).map(el => {
      return normalize(names.map(n => el[method](n)));
    }));
  }
  /**
   * Set any attribute on a single or a list of DOM nodes
   * @param   { HTMLElement|NodeList|Array } els   - DOM node/s to parse
   * @param   { string|Object }              name  - either the name of the attribute to set
   *                                                 or a list of properties as object key - value
   * @param   { string }                     value - the new value of the attribute (optional)
   * @returns { HTMLElement|NodeList|Array } the original array of elements passed to this function
   *
   * @example
   *
   * import { set } from 'bianco.attr'
   *
   * const img = document.createElement('img')
   *
   * set(img, 'width', 100)
   *
   * // or also
   * set(img, {
   *   width: 300,
   *   height: 300
   * })
   *
   */


  function set(els, name, value) {
    const attrs = typeof name === 'object' ? name : {
      [name]: value
    };
    const props = Object.keys(attrs);
    domToArray(els).forEach(el => {
      props.forEach(prop => el.setAttribute(prop, attrs[prop]));
    });
    return els;
  }
  /**
   * Get any attribute from a single or a list of DOM nodes
   * @param   { HTMLElement|NodeList|Array } els   - DOM node/s to parse
   * @param   { string|Array }               name  - name or list of attributes to get
   * @returns { Array|string } list of the attributes found
   *
   * @example
   *
   * import { get } from 'bianco.attr'
   *
   * const img = document.createElement('img')
   *
   * get(img, 'width') // => '200'
   *
   * // or also
   * get(img, ['width', 'height']) // => ['200', '300']
   *
   * // or also
   * get([img1, img2], ['width', 'height']) // => [['200', '300'], ['500', '200']]
   */

  function get(els, name) {
    return parseNodes(els, name, 'getAttribute');
  }

  /**
   * Quick type checking
   * @param   {*} element - anything
   * @param   {string} type - type definition
   * @returns {boolean} true if the type corresponds
   */
  function checkType(element, type) {
    return typeof element === type;
  }
  /**
   * Check that will be passed if its argument is a function
   * @param   {*} value - value to check
   * @returns {boolean} - true if the value is a function
   */

  function isFunction(value) {
    return checkType(value, 'function');
  }

  /* eslint-disable fp/no-mutating-methods */
  /**
   * Throw an error
   * @param {string} error - error message
   * @returns {undefined} it's a IO void function
   */

  function panic(error) {
    throw new Error(error);
  }
  /**
   * Call the first argument received only if it's a function otherwise return it as it is
   * @param   {*} source - anything
   * @returns {*} anything
   */

  function callOrAssign(source) {
    return isFunction(source) ? source.prototype && source.prototype.constructor ? new source() : source() : source;
  }
  /**
   * Convert a string from camel case to dash-case
   * @param   {string} string - probably a component tag name
   * @returns {string} component name normalized
   */

  function camelToDashCase(string) {
    return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }
  /**
   * Convert a string containing dashes to camel case
   * @param   {string} string - input string
   * @returns {string} my-string -> myString
   */

  function dashToCamelCase(string) {
    return string.replace(/-(\w)/g, (_, c) => c.toUpperCase());
  }
  /**
   * Define default properties if they don't exist on the source object
   * @param   {Object} source - object that will receive the default properties
   * @param   {Object} defaults - object containing additional optional keys
   * @returns {Object} the original object received enhanced
   */

  function defineDefaults(source, defaults) {
    Object.entries(defaults).forEach((_ref) => {
      let key = _ref[0],
          value = _ref[1];
      if (!source[key]) source[key] = value;
    });
    return source;
  } // doese simply nothing

  function noop() {
    return this;
  }
  /**
   * Autobind the methods of a source object to itself
   * @param   {Object} source - probably a riot tag instance
   * @param   {Array<string>} methods - list of the methods to autobind
   * @returns {Object} the original object received
   */

  function autobindMethods(source, methods) {
    methods.forEach(method => {
      source[method] = source[method].bind(source);
    });
    return source;
  }
  /**
   * Helper function to set an immutable property
   * @param   {Object} source - object where the new property will be set
   * @param   {string} key - object key where the new property will be stored
   * @param   {*} value - value of the new property
   * @param   {Object} options - set the propery overriding the default options
   * @returns {Object} - the original object modified
   */

  function defineProperty(source, key, value, options) {
    if (options === void 0) {
      options = {};
    }

    Object.defineProperty(source, key, Object.assign({
      value,
      enumerable: false,
      writable: false,
      configurable: true
    }, options));
    return source;
  }
  /**
   * Normalize a DOM attribute that will be passed to a child component
   * @param   {string} attribute.name - attribute names might be dash case
   * @param   {*} attribute.value - sky is the limit
   * @returns {attribute} attribute object normalized
   */

  function normalizeAttribute(_ref2) {
    let name = _ref2.name,
        value = _ref2.value;
    return {
      name: dashToCamelCase(name),
      value: value
    };
  }
  /**
   * Define multiple properties on a target object
   * @param   {Object} source - object where the new properties will be set
   * @param   {Object} properties - object containing as key pair the key + value properties
   * @param   {Object} options - set the propery overriding the default options
   * @returns {Object} the original object modified
   */

  function defineProperties(source, properties, options) {
    Object.entries(properties).forEach((_ref3) => {
      let key = _ref3[0],
          value = _ref3[1];
      defineProperty(source, key, value, options);
    });
    return source;
  }
  /**
   * Evaluate a list of attribute expressions
   * @param   {Array} attributes - attribute expressions generated by the riot compiler
   * @param   {Object} scope - current scope
   * @returns {Object} key value pairs with the result of the computation
   */

  function evaluateAttributeExpressions(attributes, scope) {
    return attributes.reduce((acc, attribute) => {
      const attr = normalizeAttribute({
        value: attribute.evaluate(scope),
        name: attribute.name
      });
      acc[dashToCamelCase(attr.name)] = attr.value;
      return acc;
    }, {});
  }

  /**
   * Get the document window
   * @returns {Object} window object
   */

  function getWindow() {
    return typeof window === 'undefined' ?
    /* istanbul ignore next */
    undefined : window;
  }
  /**
   * Get all the element attributes as object
   * @param   {HTMLElement} element - DOM node we want to parse
   * @returns {Object} all the attributes found as a key value pairs
   */

  function DOMattributesToObject(element) {
    return Array.from(element.attributes).reduce((acc, attribute) => {
      const attr = normalizeAttribute(attribute);
      acc[attr.name] = attr.value;
      return acc;
    }, {});
  }
  /**
   * Get the tag name of any DOM node
   * @param   {HTMLElement} element - DOM node we want to inspect
   * @returns {string} name to identify this dom node in riot
   */

  function getName(element) {
    return get(element, IS_DIRECTIVE) || element.tagName.toLowerCase();
  }

  /**
   * Remove the child nodes from any DOM node
   * @param   {HTMLElement} node - target node
   * @returns {undefined}
   */
  function cleanNode(node) {
    const children = node.childNodes;
    Array.from(children).forEach(n => node.removeChild(n));
  }

  const EACH = 0;
  const IF = 1;
  const SIMPLE = 2;
  const TAG = 3;
  var bindingTypes = {
    EACH,
    IF,
    SIMPLE,
    TAG
  };
  /* get rid of the @ungap/essential-map polyfill */

  const append = (get, parent, children, start, end, before) => {
    if (end - start < 2) parent.insertBefore(get(children[start], 1), before);else {
      const fragment = parent.ownerDocument.createDocumentFragment();

      while (start < end) fragment.appendChild(get(children[start++], 1));

      parent.insertBefore(fragment, before);
    }
  };

  const eqeq = (a, b) => a == b;

  const identity = O => O;

  const indexOf = (moreNodes, moreStart, moreEnd, lessNodes, lessStart, lessEnd, compare) => {
    const length = lessEnd - lessStart;
    /* istanbul ignore if */

    if (length < 1) return -1;

    while (moreEnd - moreStart >= length) {
      let m = moreStart;
      let l = lessStart;

      while (m < moreEnd && l < lessEnd && compare(moreNodes[m], lessNodes[l])) {
        m++;
        l++;
      }

      if (l === lessEnd) return moreStart;
      moreStart = m + 1;
    }

    return -1;
  };

  const isReversed = (futureNodes, futureEnd, currentNodes, currentStart, currentEnd, compare) => {
    while (currentStart < currentEnd && compare(currentNodes[currentStart], futureNodes[futureEnd - 1])) {
      currentStart++;
      futureEnd--;
    }

    return futureEnd === 0;
  };

  const next = (get, list, i, length, before) => i < length ? get(list[i], 0) : 0 < i ? get(list[i - 1], -0).nextSibling : before;

  const remove = (get, parent, children, start, end) => {
    if (end - start < 2) parent.removeChild(get(children[start], -1));else {
      const range = parent.ownerDocument.createRange();
      range.setStartBefore(get(children[start], -1));
      range.setEndAfter(get(children[end - 1], -1));
      range.deleteContents();
    }
  }; // - - - - - - - - - - - - - - - - - - -
  // diff related constants and utilities
  // - - - - - - - - - - - - - - - - - - -


  const DELETION = -1;
  const INSERTION = 1;
  const SKIP = 0;
  const SKIP_OND = 50;

  const HS = (futureNodes, futureStart, futureEnd, futureChanges, currentNodes, currentStart, currentEnd, currentChanges) => {
    let k = 0;
    /* istanbul ignore next */

    let minLen = futureChanges < currentChanges ? futureChanges : currentChanges;
    const link = Array(minLen++);
    const tresh = Array(minLen);
    tresh[0] = -1;

    for (let i = 1; i < minLen; i++) tresh[i] = currentEnd;

    const keymap = new Map();

    for (let i = currentStart; i < currentEnd; i++) keymap.set(currentNodes[i], i);

    for (let i = futureStart; i < futureEnd; i++) {
      const idxInOld = keymap.get(futureNodes[i]);

      if (idxInOld != null) {
        k = findK(tresh, minLen, idxInOld);
        /* istanbul ignore else */

        if (-1 < k) {
          tresh[k] = idxInOld;
          link[k] = {
            newi: i,
            oldi: idxInOld,
            prev: link[k - 1]
          };
        }
      }
    }

    k = --minLen;
    --currentEnd;

    while (tresh[k] > currentEnd) --k;

    minLen = currentChanges + futureChanges - k;
    const diff = Array(minLen);
    let ptr = link[k];
    --futureEnd;

    while (ptr) {
      const _ptr = ptr,
            newi = _ptr.newi,
            oldi = _ptr.oldi;

      while (futureEnd > newi) {
        diff[--minLen] = INSERTION;
        --futureEnd;
      }

      while (currentEnd > oldi) {
        diff[--minLen] = DELETION;
        --currentEnd;
      }

      diff[--minLen] = SKIP;
      --futureEnd;
      --currentEnd;
      ptr = ptr.prev;
    }

    while (futureEnd >= futureStart) {
      diff[--minLen] = INSERTION;
      --futureEnd;
    }

    while (currentEnd >= currentStart) {
      diff[--minLen] = DELETION;
      --currentEnd;
    }

    return diff;
  }; // this is pretty much the same petit-dom code without the delete map part
  // https://github.com/yelouafi/petit-dom/blob/bd6f5c919b5ae5297be01612c524c40be45f14a7/src/vdom.js#L556-L561


  const OND = (futureNodes, futureStart, rows, currentNodes, currentStart, cols, compare) => {
    const length = rows + cols;
    const v = [];
    let d, k, r, c, pv, cv, pd;

    outer: for (d = 0; d <= length; d++) {
      /* istanbul ignore if */
      if (d > SKIP_OND) return null;
      pd = d - 1;
      /* istanbul ignore next */

      pv = d ? v[d - 1] : [0, 0];
      cv = v[d] = [];

      for (k = -d; k <= d; k += 2) {
        if (k === -d || k !== d && pv[pd + k - 1] < pv[pd + k + 1]) {
          c = pv[pd + k + 1];
        } else {
          c = pv[pd + k - 1] + 1;
        }

        r = c - k;

        while (c < cols && r < rows && compare(currentNodes[currentStart + c], futureNodes[futureStart + r])) {
          c++;
          r++;
        }

        if (c === cols && r === rows) {
          break outer;
        }

        cv[d + k] = c;
      }
    }

    const diff = Array(d / 2 + length / 2);
    let diffIdx = diff.length - 1;

    for (d = v.length - 1; d >= 0; d--) {
      while (c > 0 && r > 0 && compare(currentNodes[currentStart + c - 1], futureNodes[futureStart + r - 1])) {
        // diagonal edge = equality
        diff[diffIdx--] = SKIP;
        c--;
        r--;
      }

      if (!d) break;
      pd = d - 1;
      /* istanbul ignore next */

      pv = d ? v[d - 1] : [0, 0];
      k = c - r;

      if (k === -d || k !== d && pv[pd + k - 1] < pv[pd + k + 1]) {
        // vertical edge = insertion
        r--;
        diff[diffIdx--] = INSERTION;
      } else {
        // horizontal edge = deletion
        c--;
        diff[diffIdx--] = DELETION;
      }
    }

    return diff;
  };

  const applyDiff = (diff, get, parentNode, futureNodes, futureStart, currentNodes, currentStart, currentLength, before) => {
    const live = new Map();
    const length = diff.length;
    let currentIndex = currentStart;
    let i = 0;

    while (i < length) {
      switch (diff[i++]) {
        case SKIP:
          futureStart++;
          currentIndex++;
          break;

        case INSERTION:
          // TODO: bulk appends for sequential nodes
          live.set(futureNodes[futureStart], 1);
          append(get, parentNode, futureNodes, futureStart++, futureStart, currentIndex < currentLength ? get(currentNodes[currentIndex], 0) : before);
          break;

        case DELETION:
          currentIndex++;
          break;
      }
    }

    i = 0;

    while (i < length) {
      switch (diff[i++]) {
        case SKIP:
          currentStart++;
          break;

        case DELETION:
          // TODO: bulk removes for sequential nodes
          if (live.has(currentNodes[currentStart])) currentStart++;else remove(get, parentNode, currentNodes, currentStart++, currentStart);
          break;
      }
    }
  };

  const findK = (ktr, length, j) => {
    let lo = 1;
    let hi = length;

    while (lo < hi) {
      const mid = (lo + hi) / 2 >>> 0;
      if (j < ktr[mid]) hi = mid;else lo = mid + 1;
    }

    return lo;
  };

  const smartDiff = (get, parentNode, futureNodes, futureStart, futureEnd, futureChanges, currentNodes, currentStart, currentEnd, currentChanges, currentLength, compare, before) => {
    applyDiff(OND(futureNodes, futureStart, futureChanges, currentNodes, currentStart, currentChanges, compare) || HS(futureNodes, futureStart, futureEnd, futureChanges, currentNodes, currentStart, currentEnd, currentChanges), get, parentNode, futureNodes, futureStart, currentNodes, currentStart, currentLength, before);
  };
  /*! (c) 2018 Andrea Giammarchi (ISC) */


  const domdiff = (parentNode, // where changes happen
  currentNodes, // Array of current items/nodes
  futureNodes, // Array of future items/nodes
  options // optional object with one of the following properties
  //  before: domNode
  //  compare(generic, generic) => true if same generic
  //  node(generic) => Node
  ) => {
    if (!options) options = {};
    const compare = options.compare || eqeq;
    const get = options.node || identity;
    const before = options.before == null ? null : get(options.before, 0);
    const currentLength = currentNodes.length;
    let currentEnd = currentLength;
    let currentStart = 0;
    let futureEnd = futureNodes.length;
    let futureStart = 0; // common prefix

    while (currentStart < currentEnd && futureStart < futureEnd && compare(currentNodes[currentStart], futureNodes[futureStart])) {
      currentStart++;
      futureStart++;
    } // common suffix


    while (currentStart < currentEnd && futureStart < futureEnd && compare(currentNodes[currentEnd - 1], futureNodes[futureEnd - 1])) {
      currentEnd--;
      futureEnd--;
    }

    const currentSame = currentStart === currentEnd;
    const futureSame = futureStart === futureEnd; // same list

    if (currentSame && futureSame) return futureNodes; // only stuff to add

    if (currentSame && futureStart < futureEnd) {
      append(get, parentNode, futureNodes, futureStart, futureEnd, next(get, currentNodes, currentStart, currentLength, before));
      return futureNodes;
    } // only stuff to remove


    if (futureSame && currentStart < currentEnd) {
      remove(get, parentNode, currentNodes, currentStart, currentEnd);
      return futureNodes;
    }

    const currentChanges = currentEnd - currentStart;
    const futureChanges = futureEnd - futureStart;
    let i = -1; // 2 simple indels: the shortest sequence is a subsequence of the longest

    if (currentChanges < futureChanges) {
      i = indexOf(futureNodes, futureStart, futureEnd, currentNodes, currentStart, currentEnd, compare); // inner diff

      if (-1 < i) {
        append(get, parentNode, futureNodes, futureStart, i, get(currentNodes[currentStart], 0));
        append(get, parentNode, futureNodes, i + currentChanges, futureEnd, next(get, currentNodes, currentEnd, currentLength, before));
        return futureNodes;
      }
    }
    /* istanbul ignore else */
    else if (futureChanges < currentChanges) {
        i = indexOf(currentNodes, currentStart, currentEnd, futureNodes, futureStart, futureEnd, compare); // outer diff

        if (-1 < i) {
          remove(get, parentNode, currentNodes, currentStart, i);
          remove(get, parentNode, currentNodes, i + futureChanges, currentEnd);
          return futureNodes;
        }
      } // common case with one replacement for many nodes
    // or many nodes replaced for a single one

    /* istanbul ignore else */


    if (currentChanges < 2 || futureChanges < 2) {
      append(get, parentNode, futureNodes, futureStart, futureEnd, get(currentNodes[currentStart], 0));
      remove(get, parentNode, currentNodes, currentStart, currentEnd);
      return futureNodes;
    } // the half match diff part has been skipped in petit-dom
    // https://github.com/yelouafi/petit-dom/blob/bd6f5c919b5ae5297be01612c524c40be45f14a7/src/vdom.js#L391-L397
    // accordingly, I think it's safe to skip in here too
    // if one day it'll come out like the speediest thing ever to do
    // then I might add it in here too
    // Extra: before going too fancy, what about reversed lists ?
    //        This should bail out pretty quickly if that's not the case.


    if (currentChanges === futureChanges && isReversed(futureNodes, futureEnd, currentNodes, currentStart, currentEnd, compare)) {
      append(get, parentNode, futureNodes, futureStart, futureEnd, next(get, currentNodes, currentEnd, currentLength, before));
      return futureNodes;
    } // last resort through a smart diff


    smartDiff(get, parentNode, futureNodes, futureStart, futureEnd, futureChanges, currentNodes, currentStart, currentEnd, currentChanges, currentLength, compare, before);
    return futureNodes;
  };

  const EachBinding = Object.seal({
    // dynamic binding properties
    childrenMap: null,
    node: null,
    root: null,
    condition: null,
    evaluate: null,
    template: null,
    tags: [],
    getKey: null,
    indexName: null,
    itemName: null,
    afterPlaceholder: null,
    placeholder: null,

    // API methods
    mount(scope) {
      return this.update(scope);
    },

    update(scope) {
      const placeholder = this.placeholder;
      const collection = this.evaluate(scope);
      const items = collection ? Array.from(collection) : [];
      const parent = placeholder.parentNode; // prepare the diffing

      const _loopItems = loopItems(items, scope, this),
            newChildrenMap = _loopItems.newChildrenMap,
            batches = _loopItems.batches,
            futureNodes = _loopItems.futureNodes;
      /**
       * DOM Updates
       */


      const before = this.tags[this.tags.length - 1];
      domdiff(parent, this.tags, futureNodes, {
        before: before ? before.nextSibling : placeholder.nextSibling
      }); // trigger the mounts and the updates

      batches.forEach(fn => fn()); // update the children map

      this.childrenMap = newChildrenMap;
      this.tags = futureNodes;
      return this;
    },

    unmount() {
      Array.from(this.childrenMap.values()).forEach((_ref) => {
        let tag = _ref.tag,
            context = _ref.context;
        tag.unmount(context, true);
      });
      this.childrenMap = new Map();
      this.tags = [];
      return this;
    }

  });
  /**
   * Check whether a tag must be filtered from a loop
   * @param   {Function} condition - filter function
   * @param   {Object} context - argument passed to the filter function
   * @returns {boolean} true if this item should be skipped
   */

  function mustFilterItem(condition, context) {
    return condition ? Boolean(condition(context)) === false : false;
  }
  /**
   * Get the context of the looped tag
   * @param   {string} options.itemName - key to identify the looped item in the new context
   * @param   {string} options.indexName - key to identify the index of the looped item
   * @param   {number} options.index - current index
   * @param   {*} options.item - collection item looped
   * @param   {*} options.scope - current parent scope
   * @returns {Object} enhanced scope object
   */


  function getContext(_ref2) {
    let itemName = _ref2.itemName,
        indexName = _ref2.indexName,
        index = _ref2.index,
        item = _ref2.item,
        scope = _ref2.scope;
    const context = Object.assign({
      [itemName]: item
    }, scope);

    if (indexName) {
      return Object.assign({
        [indexName]: index
      }, context);
    }

    return context;
  }
  /**
   * Loop the current tag items
   * @param   { Array } items - tag collection
   * @param   { * } scope - tag scope
   * @param   { EeachBinding } binding - each binding object instance
   * @returns { Object } data
   * @returns { Map } data.newChildrenMap - a Map containing the new children tags structure
   * @returns { Array } data.batches - array containing functions the tags lifecycle functions to trigger
   * @returns { Array } data.futureNodes - array containing the nodes we need to diff
   */


  function loopItems(items, scope, binding) {
    const condition = binding.condition,
          template = binding.template,
          childrenMap = binding.childrenMap,
          itemName = binding.itemName,
          getKey = binding.getKey,
          indexName = binding.indexName,
          root = binding.root;
    const filteredItems = new Set();
    const newChildrenMap = new Map();
    const batches = [];
    const futureNodes = [];
    items.forEach((item, i) => {
      // the real item index should be subtracted to the items that were filtered
      const index = i - filteredItems.size;
      const context = getContext({
        itemName,
        indexName,
        index,
        item,
        scope
      });
      const key = getKey ? getKey(context) : index;
      const oldItem = childrenMap.get(key);

      if (mustFilterItem(condition, context)) {
        filteredItems.add(oldItem);
        return;
      }

      const tag = oldItem ? oldItem.tag : template.clone();
      const el = oldItem ? tag.el : root.cloneNode();

      if (!oldItem) {
        batches.push(() => tag.mount(el, context));
      } else {
        batches.push(() => tag.update(context));
      }

      futureNodes.push(el); // update the children map

      newChildrenMap.set(key, {
        tag,
        context,
        index
      });
    });
    return {
      newChildrenMap,
      batches,
      futureNodes
    };
  }

  function create(node, _ref3) {
    let evaluate = _ref3.evaluate,
        condition = _ref3.condition,
        itemName = _ref3.itemName,
        indexName = _ref3.indexName,
        getKey = _ref3.getKey,
        template = _ref3.template;
    const placeholder = document.createTextNode('');
    const parent = node.parentNode;
    const root = node.cloneNode();
    const offset = Array.from(parent.childNodes).indexOf(node);
    parent.insertBefore(placeholder, node);
    parent.removeChild(node);
    return Object.assign({}, EachBinding, {
      childrenMap: new Map(),
      node,
      root,
      offset,
      condition,
      evaluate,
      template: template.createDOM(node),
      getKey,
      indexName,
      itemName,
      placeholder
    });
  }
  /**
   * Binding responsible for the `if` directive
   */


  const IfBinding = Object.seal({
    // dynamic binding properties
    node: null,
    evaluate: null,
    placeholder: null,
    template: '',

    // API methods
    mount(scope) {
      swap(this.placeholder, this.node);
      return this.update(scope);
    },

    update(scope) {
      const value = !!this.evaluate(scope);
      const mustMount = !this.value && value;
      const mustUnmount = this.value && !value;

      switch (true) {
        case mustMount:
          swap(this.node, this.placeholder);

          if (this.template) {
            this.template = this.template.clone();
            this.template.mount(this.node, scope);
          }

          break;

        case mustUnmount:
          this.unmount(scope);
          swap(this.placeholder, this.node);
          break;

        default:
          if (value) this.template.update(scope);
      }

      this.value = value;
      return this;
    },

    unmount(scope) {
      const template = this.template;

      if (template) {
        template.unmount(scope);
      }

      return this;
    }

  });

  function swap(inNode, outNode) {
    const parent = outNode.parentNode;
    parent.insertBefore(inNode, outNode);
    parent.removeChild(outNode);
  }

  function create$1(node, _ref4) {
    let evaluate = _ref4.evaluate,
        template = _ref4.template;
    return Object.assign({}, IfBinding, {
      node,
      evaluate,
      placeholder: document.createTextNode(''),
      template: template.createDOM(node)
    });
  }

  const ATTRIBUTE = 0;
  const EVENT = 1;
  const TEXT = 2;
  const VALUE = 3;
  var expressionTypes = {
    ATTRIBUTE,
    EVENT,
    TEXT,
    VALUE
  };
  const REMOVE_ATTRIBUTE = 'removeAttribute';
  const SET_ATTIBUTE = 'setAttribute';
  /**
   * Add all the attributes provided
   * @param   {HTMLElement} node - target node
   * @param   {Object} attributes - object containing the attributes names and values
   * @returns {undefined} sorry it's a void function :(
   */

  function setAllAttributes(node, attributes) {
    Object.entries(attributes).forEach((_ref5) => {
      let name = _ref5[0],
          value = _ref5[1];
      return attributeExpression(node, {
        name
      }, value);
    });
  }
  /**
   * Remove all the attributes provided
   * @param   {HTMLElement} node - target node
   * @param   {Object} attributes - object containing all the attribute names
   * @returns {undefined} sorry it's a void function :(
   */


  function removeAllAttributes(node, attributes) {
    Object.keys(attributes).forEach(attribute => node.removeAttribute(attribute));
  }
  /**
   * This methods handles the DOM attributes updates
   * @param   {HTMLElement} node - target node
   * @param   {Object} expression - expression object
   * @param   {string} expression.name - attribute name
   * @param   {*} value - new expression value
   * @param   {*} oldValue - the old expression cached value
   * @returns {undefined}
   */


  function attributeExpression(node, _ref6, value, oldValue) {
    let name = _ref6.name;

    // is it a spread operator? {...attributes}
    if (!name) {
      // is the value still truthy?
      if (value) {
        setAllAttributes(node, value);
      } else if (oldValue) {
        // otherwise remove all the old attributes
        removeAllAttributes(node, oldValue);
      }

      return;
    } // handle boolean attributes


    if (typeof value === 'boolean') {
      node[name] = value;
    }

    node[getMethod(value)](name, normalizeValue(name, value));
  }
  /**
   * Get the attribute modifier method
   * @param   {*} value - if truthy we return `setAttribute` othewise `removeAttribute`
   * @returns {string} the node attribute modifier method name
   */


  function getMethod(value) {
    return value && typeof value !== 'object' ? SET_ATTIBUTE : REMOVE_ATTRIBUTE;
  }
  /**
   * Get the value as string
   * @param   {string} name - attribute name
   * @param   {*} value - user input value
   * @returns {string} input value as string
   */


  function normalizeValue(name, value) {
    // be sure that expressions like selected={ true } will be always rendered as selected='selected'
    if (value === true) return name;
    return value;
  }
  /**
   * Set a new event listener
   * @param   {HTMLElement} node - target node
   * @param   {Object} expression - expression object
   * @param   {string} expression.name - event name
   * @param   {*} value - new expression value
   * @returns {undefined}
   */


  function eventExpression(node, _ref7, value) {
    let name = _ref7.name;
    node[name] = value;
  }
  /**
   * This methods handles a simple text expression update
   * @param   {HTMLElement} node - target node
   * @param   {Object} expression - expression object
   * @param   {number} expression.childNodeIndex - index to find the text node to update
   * @param   {*} value - new expression value
   * @returns {undefined}
   */


  function textExpression(node, _ref8, value) {
    let childNodeIndex = _ref8.childNodeIndex;
    const target = node.childNodes[childNodeIndex];
    const val = normalizeValue$1(value); // replace the target if it's a placeholder comment

    if (target.nodeType === Node.COMMENT_NODE) {
      const textNode = document.createTextNode(val);
      node.replaceChild(textNode, target);
    } else {
      target.data = normalizeValue$1(val);
    }
  }
  /**
   * Normalize the user value in order to render a empty string in case of falsy values
   * @param   {*} value - user input value
   * @returns {string} hopefully a string
   */


  function normalizeValue$1(value) {
    return value != null ? value : '';
  }
  /**
   * This methods handles the input fileds value updates
   * @param   {HTMLElement} node - target node
   * @param   {Object} expression - expression object
   * @param   {*} value - new expression value
   * @returns {undefined}
   */


  function valueExpression(node, expression, value) {
    node.value = value;
  }

  var expressions = {
    [ATTRIBUTE]: attributeExpression,
    [EVENT]: eventExpression,
    [TEXT]: textExpression,
    [VALUE]: valueExpression
  };
  const Expression = Object.seal({
    // Static props
    node: null,
    value: null,

    // API methods

    /**
     * Mount the expression evaluating its initial value
     * @param   {*} scope - argument passed to the expression to evaluate its current values
     * @returns {Expression} self
     */
    mount(scope) {
      // hopefully a pure function
      this.value = this.evaluate(scope); // IO() DOM updates

      apply(this, this.value);
      return this;
    },

    /**
     * Update the expression if its value changed
     * @param   {*} scope - argument passed to the expression to evaluate its current values
     * @returns {Expression} self
     */
    update(scope) {
      // pure function
      const value = this.evaluate(scope);

      if (this.value !== value) {
        // IO() DOM updates
        apply(this, value);
        this.value = value;
      }

      return this;
    },

    /**
     * Expression teardown method
     * @returns {Expression} self
     */
    unmount() {
      return this;
    }

  });
  /**
   * IO() function to handle the DOM updates
   * @param {Expression} expression - expression object
   * @param {*} value - current expression value
   * @returns {undefined}
   */

  function apply(expression, value) {
    return expressions[expression.type](expression.node, expression, value, expression.value);
  }

  function create$2(node, data) {
    return Object.assign({}, Expression, data, {
      node
    });
  }
  /**
   * Create a flat object having as keys a list of methods that if dispatched will propagate
   * on the whole collection
   * @param   {Array} collection - collection to iterate
   * @param   {Array<string>} methods - methods to execute on each item of the collection
   * @param   {*} context - context returned by the new methods created
   * @returns {Object} a new object to simplify the the nested methods dispatching
   */


  function flattenCollectionMethods(collection, methods, context) {
    return methods.reduce((acc, method) => {
      return Object.assign({}, acc, {
        [method]: scope => {
          return collection.map(item => item[method](scope)) && context;
        }
      });
    }, {});
  }

  function create$3(node, _ref9) {
    let expressions = _ref9.expressions;
    return Object.assign({}, flattenCollectionMethods(expressions.map(expression => create$2(node, expression)), ['mount', 'update', 'unmount']));
  }
  /**
   * Create a new tag object if it was registered before, otherwise fallback to the simple
   * template chunk
   * @param   {Function} component - component factory function
   * @param   {Array<Object>} slots - array containing the slots markup
   * @param   {Array} attributes - dynamic attributes that will be received by the tag element
   * @returns {TagImplementation|TemplateChunk} a tag implementation or a template chunk as fallback
   */


  function getTag(component, slots, attributes) {
    if (slots === void 0) {
      slots = [];
    }

    if (attributes === void 0) {
      attributes = [];
    }

    // if this tag was registered before we will return its implementation
    if (component) {
      return component({
        slots,
        attributes
      });
    } // otherwise we return a template chunk


    return create$6(slotsToMarkup(slots), [...slotBindings(slots), {
      // the attributes should be registered as binding
      // if we fallback to a normal template chunk
      expressions: attributes.map(attr => {
        return Object.assign({
          type: ATTRIBUTE
        }, attr);
      })
    }]);
  }
  /**
   * Merge all the slots bindings into a single array
   * @param   {Array<Object>} slots - slots collection
   * @returns {Array<Bindings>} flatten bindings array
   */


  function slotBindings(slots) {
    return slots.reduce((acc, _ref10) => {
      let bindings = _ref10.bindings;
      return acc.concat(bindings);
    }, []);
  }
  /**
   * Merge all the slots together in a single markup string
   * @param   {Array<Object>} slots - slots collection
   * @returns {string} markup of all the slots in a single string
   */


  function slotsToMarkup(slots) {
    return slots.reduce((acc, slot) => {
      return acc + slot.html;
    }, '');
  }

  const TagBinding = Object.seal({
    // dynamic binding properties
    node: null,
    evaluate: null,
    name: null,
    slots: null,
    tag: null,
    attributes: null,
    getComponent: null,

    mount(scope) {
      return this.update(scope);
    },

    update(scope) {
      const name = this.evaluate(scope); // simple update

      if (name === this.name) {
        this.tag.update(scope);
      } else {
        // unmount the old tag if it exists
        this.unmount(); // mount the new tag

        this.name = name;
        this.tag = getTag(this.getComponent(name), this.slots, this.attributes);
        this.tag.mount(this.node, scope);
      }

      return this;
    },

    unmount() {
      if (this.tag) {
        // keep the root tag
        this.tag.unmount(true);
      }

      return this;
    }

  });

  function create$4(node, _ref11) {
    let evaluate = _ref11.evaluate,
        getComponent = _ref11.getComponent,
        slots = _ref11.slots,
        attributes = _ref11.attributes;
    return Object.assign({}, TagBinding, {
      node,
      evaluate,
      slots,
      attributes,
      getComponent
    });
  }

  var bindings = {
    [IF]: create$1,
    [SIMPLE]: create$3,
    [EACH]: create,
    [TAG]: create$4
  };
  /**
   * Bind a new expression object to a DOM node
   * @param   {HTMLElement} root - DOM node where to bind the expression
   * @param   {Object} binding - binding data
   * @returns {Expression} Expression object
   */

  function create$5(root, binding) {
    const selector = binding.selector,
          type = binding.type,
          redundantAttribute = binding.redundantAttribute,
          expressions = binding.expressions; // find the node to apply the bindings

    const node = selector ? root.querySelector(selector) : root; // remove eventually additional attributes created only to select this node

    if (redundantAttribute) node.removeAttribute(redundantAttribute); // init the binding

    return (bindings[type] || bindings[SIMPLE])(node, Object.assign({}, binding, {
      expressions: expressions || []
    }));
  }
  /**
   * Check if an element is part of an svg
   * @param   {HTMLElement}  el - element to check
   * @returns {boolean} true if we are in an svg context
   */


  function isSvg(el) {
    const owner = el.ownerSVGElement;
    return !!owner || owner === null;
  } // in this case a simple innerHTML is enough


  function createHTMLTree(html) {
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content;
  } // for svg nodes we need a bit more work


  function creteSVGTree(html, container) {
    // create the SVGNode
    const svgNode = container.ownerDocument.importNode(new window.DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${html}</svg>`, 'application/xml').documentElement, true);
    return svgNode;
  }
  /**
   * Create the DOM that will be injected
   * @param {Object} root - DOM node to find out the context where the fragment will be created
   * @param   {string} html - DOM to create as string
   * @returns {HTMLDocumentFragment|HTMLElement} a new html fragment
   */


  function createDOMTree(root, html) {
    if (isSvg(root)) return creteSVGTree(html, root);
    return createHTMLTree(html);
  }
  /**
   * Move all the child nodes from a source tag to another
   * @param   {HTMLElement} source - source node
   * @param   {HTMLElement} target - target node
   * @returns {undefined} it's a void method ¯\_(ツ)_/¯
   */
  // Ignore this helper because it's needed only for svg tags

  /* istanbul ignore next */


  function moveChildren(source, target) {
    if (source.firstChild) {
      target.appendChild(source.firstChild);
      moveChildren(source, target);
    }
  }

  const SVG_RE = /svg/i;
  /**
   * Inject the DOM tree into a target node
   * @param   {HTMLElement} el - target element
   * @param   {HTMLFragment|SVGElement} dom - dom tree to inject
   * @returns {undefined}
   */

  function injectDOM(el, dom) {
    if (SVG_RE.test(el.tagName)) {
      moveChildren(dom, el);
    } else {
      el.appendChild(dom);
    }
  }
  /**
   * Create the Template DOM skeleton
   * @param   {HTMLElement} el - root node where the DOM will be injected
   * @param   {string} html - markup that will be injected into the root node
   * @returns {HTMLFragment} fragment that will be injected into the root node
   */


  function createTemplateDOM(el, html) {
    return html && (typeof html === 'string' ? createDOMTree(el, html) : html);
  }
  /**
   * Template Chunk model
   * @type {Object}
   */


  const TemplateChunk = Object.freeze({
    // Static props
    bindings: null,
    bindingsData: null,
    html: null,
    dom: null,
    el: null,

    /**
     * Create the template DOM structure that will be cloned on each mount
     * @param   {HTMLElement} el - the root node
     * @returns {TemplateChunk} self
     */
    createDOM(el) {
      // make sure that the DOM gets created before cloning the template
      this.dom = this.dom || createTemplateDOM(el, this.html);
      return this;
    },

    // API methods

    /**
     * Attach the template to a DOM node
     * @param   {HTMLElement} el - target DOM node
     * @param   {*} scope - template data
     * @returns {TemplateChunk} self
     */
    mount(el, scope) {
      if (!el) throw new Error('Please provide DOM node to mount properly your template');
      if (this.el) this.unmount(scope);
      this.el = el; // create the DOM if it wasn't created before

      this.createDOM(el);
      if (this.dom) injectDOM(el, this.dom.cloneNode(true)); // create the bindings

      this.bindings = this.bindingsData.map(binding => create$5(this.el, binding));
      this.bindings.forEach(b => b.mount(scope));
      return this;
    },

    /**
     * Update the template with fresh data
     * @param   {*} scope - template data
     * @returns {TemplateChunk} self
     */
    update(scope) {
      this.bindings.forEach(b => b.update(scope));
      return this;
    },

    /**
     * Remove the template from the node where it was initially mounted
     * @param   {*} scope - template data
     * @param   {boolean} mustRemoveRoot - if true remove the root element
     * @returns {TemplateChunk} self
     */
    unmount(scope, mustRemoveRoot) {
      if (this.el) {
        this.bindings.forEach(b => b.unmount(scope));
        cleanNode(this.el);

        if (mustRemoveRoot && this.el.parentNode) {
          this.el.parentNode.removeChild(this.el);
        }

        this.el = null;
      }

      return this;
    },

    /**
     * Clone the template chunk
     * @returns {TemplateChunk} a clone of this object resetting the this.el property
     */
    clone() {
      return Object.assign({}, this, {
        el: null
      });
    }

  });
  /**
   * Create a template chunk wiring also the bindings
   * @param   {string|HTMLElement} html - template string
   * @param   {Array} bindings - bindings collection
   * @returns {TemplateChunk} a new TemplateChunk copy
   */

  function create$6(html, bindings) {
    if (bindings === void 0) {
      bindings = [];
    }

    return Object.assign({}, TemplateChunk, {
      html,
      bindingsData: bindings
    });
  }

  /**
   * Simple helper to find DOM nodes returning them as array like loopable object
   * @param   { string|DOMNodeList } selector - either the query or the DOM nodes to arraify
   * @param   { HTMLElement }        ctx      - context defining where the query will search for the DOM nodes
   * @returns { Array } DOM nodes found as array
   */

  function $(selector, ctx) {
    return domToArray(typeof selector === 'string' ? (ctx || document).querySelectorAll(selector) : selector);
  }

  /**
   * Binding responsible for the slots
   */

  const Slot = Object.seal({
    // dynamic binding properties
    node: null,
    name: null,
    template: null,

    // API methods
    mount(scope) {
      if (this.template) {
        this.template.mount(this.node, scope);
        moveSlotInnerContent(this.node);
      } else {
        this.node.parentNode.removeChild(this.node);
      }

      return this;
    },

    update(scope) {
      if (this.template) {
        this.template.update(scope);
      }

      return this;
    },

    unmount(scope) {
      if (this.template) {
        this.template.unmount(scope);
      }

      return this;
    }

  });
  /**
   * Move the inner content of the slots outside of them
   * @param   {HTMLNode} slot - slot node
   * @returns {undefined} it's a void function
   */

  function moveSlotInnerContent(slot) {
    if (slot.firstChild) {
      slot.parentNode.insertBefore(slot.firstChild, slot);
      moveSlotInnerContent(slot);
    }

    if (slot.parentNode) {
      slot.parentNode.removeChild(slot);
    }
  }
  /**
   * Create a single slot binding
   * @param   {HTMLElement} root - component root
   * @param   {HTMLElement} node - slot node
   * @param   {string} options.name - slot id
   * @param   {Array} options.slots - component slots
   * @returns {Object} Slot binding object
   */


  function createSlot(root, node, _ref) {
    let name = _ref.name,
        slots = _ref.slots;
    const templateData = slots.find((_ref2) => {
      let id = _ref2.id;
      return id === name;
    });
    return Object.assign({}, Slot, {
      node,
      name,
      template: templateData && create$6(templateData.html, templateData.bindings).createDOM(root)
    });
  }
  /**
   * Create the object that will manage the slots
   * @param   {HTMLElement} root - component root element
   * @param   {Array} slots - slots objects containing html and bindings
   * @return  {Object} tag like interface that will manage all the slots
   */


  function createSlots(root, slots) {
    const slotNodes = $('slot', root);
    const slotsBindings = slotNodes.map(node => {
      const name = get(node, 'name') || 'default';
      return createSlot(root, node, {
        name,
        slots
      });
    });
    return {
      mount(scope) {
        slotsBindings.forEach(s => s.mount(scope));
        return this;
      },

      update(scope) {
        slotsBindings.forEach(s => s.update(scope));
        return this;
      },

      unmount(scope) {
        slotsBindings.forEach(s => s.unmount(scope));
        return this;
      }

    };
  }

  const WIN = getWindow();
  const CSS_BY_NAME = new Map(); // skip the following code on the server

  const styleNode = WIN && (() => {
    // create a new style element with the correct type
    const newNode = document.createElement('style');
    set(newNode, 'type', 'text/css');
    document.head.appendChild(newNode);
    return newNode;
  })();
  /**
   * Object that will be used to inject and manage the css of every tag instance
   */


  var cssManager = {
    /**
     * Save a tag style to be later injected into DOM
     * @param { string } name - if it's passed we will map the css to a tagname
     * @param { string } css - css string
     * @returns {Object} self
     */
    add(name, css) {
      if (!CSS_BY_NAME.has(name)) {
        CSS_BY_NAME.set(name, css);
      }

      this.inject();
      return this;
    },

    /**
     * Inject all previously saved tag styles into DOM
     * innerHTML seems slow: http://jsperf.com/riot-insert-style
     * @returns {Object} self
     */
    inject() {
      // a node environment can't rely on css

      /* istanbul ignore next */
      if (!styleNode) return this;
      styleNode.innerHTML = [...CSS_BY_NAME.values()].join('\n');
      return this;
    },

    /**
     * Remove a tag style from the DOM
     * @param {string} name a registered tagname
     * @returns {Object} self
     */
    remove(name) {
      // a node environment can't rely on css

      /* istanbul ignore next */
      if (!styleNode) return this;

      if (CSS_BY_NAME.has(name)) {
        CSS_BY_NAME.delete(name);
        this.inject();
      }

      return this;
    }

  };

  /**
   * Function to curry any javascript method
   * @param   {Function}  fn - the target function we want to curry
   * @param   {...[args]} acc - initial arguments
   * @returns {Function|*} it will return a function until the target function
   *                       will receive all of its arguments
   */
  function curry(fn) {
    for (var _len = arguments.length, acc = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      acc[_key - 1] = arguments[_key];
    }

    return function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      args = [...acc, ...args];
      return args.length < fn.length ? curry(fn, ...args) : fn(...args);
    };
  }

  const COMPONENT_CORE_HELPERS = Object.freeze({
    // component helpers
    $(selector) {
      return $(selector, this.root)[0];
    },

    $$(selector) {
      return $(selector, this.root);
    }

  });
  const COMPONENT_LIFECYCLE_METHODS = Object.freeze({
    shouldUpdate: noop,
    onBeforeMount: noop,
    onMounted: noop,
    onBeforeUpdate: noop,
    onUpdated: noop,
    onBeforeUnmount: noop,
    onUnmounted: noop
  });
  const MOCKED_TEMPLATE_INTERFACE = {
    update: noop,
    mount: noop,
    unmount: noop,
    clone: noop,
    createDOM: noop
    /**
     * Create the component interface needed for the @riotjs/dom-bindings tag bindings
     * @param   {string} options.css - component css
     * @param   {Function} options.template - functon that will return the dom-bindings template function
     * @param   {Object} options.exports - component interface
     * @param   {string} options.name - component name
     * @returns {Object} component like interface
     */

  };
  function createComponent(_ref) {
    let css = _ref.css,
        template = _ref.template,
        exports = _ref.exports,
        name = _ref.name;
    return (_ref2) => {
      let slots = _ref2.slots,
          attributes = _ref2.attributes,
          props = _ref2.props;
      const component = defineComponent({
        css,
        template,
        exports,
        name
      })({
        slots,
        attributes,
        props
      }); // notice that for the components create via tag binding
      // we need to invert the mount (state/parentScope) arguments
      // the template bindings will only forward the parentScope updates
      // and never deal with the component state

      return {
        mount(element, parentScope, state) {
          return component.mount(element, state, parentScope);
        },

        update(parentScope, state) {
          return component.update(state, parentScope);
        },

        unmount(preserveRoot) {
          return component.unmount(preserveRoot);
        }

      };
    };
  }
  /**
   * Component definition function
   * @param   {Object} implementation - the componen implementation will be generated via compiler
   * @param   {Object} component - the component initial properties
   * @returns {Object} a new component implementation object
   */

  function defineComponent(_ref3) {
    let css = _ref3.css,
        template = _ref3.template,
        exports = _ref3.exports,
        name = _ref3.name;
    const componentAPI = callOrAssign(exports) || {};
    const components = createSubcomponents(componentAPI.components); // add the component css into the DOM

    if (css && name) cssManager.add(name, css);
    return curry(enhanceComponentAPI)(defineProperties( // set the component defaults without overriding the original component API
    defineDefaults(componentAPI, Object.assign({}, COMPONENT_LIFECYCLE_METHODS, {
      state: {}
    })), Object.assign({
      // defined during the component creation
      slots: null,
      root: null
    }, COMPONENT_CORE_HELPERS, {
      name,
      css,
      template: template ? template(create$6, expressionTypes, bindingTypes, name => {
        return components[name] || COMPONENTS_IMPLEMENTATION_MAP.get(name);
      }) : MOCKED_TEMPLATE_INTERFACE
    })));
  }
  /**
   * Evaluate the component properties either from its real attributes or from its attribute expressions
   * @param   {HTMLElement} element - component root
   * @param   {Array}  attributeExpressions - attribute expressions generated by the riot compiler
   * @param   {Object} scope - current scope
   * @param   {Object} currentProps - current component properties
   * @returns {Object} attributes key value pairs
   */

  function evaluateProps(element, attributeExpressions, scope, currentProps) {
    if (attributeExpressions === void 0) {
      attributeExpressions = [];
    }

    if (currentProps === void 0) {
      currentProps = {};
    }

    if (attributeExpressions.length) {
      return scope ? evaluateAttributeExpressions(attributeExpressions, scope) : currentProps;
    }

    return DOMattributesToObject(element);
  }
  /**
   * Create the bindings to update the component attributes
   * @param   {Array} attributes - list of attribute bindings
   * @returns {TemplateChunk} - template bindings object
   */


  function createAttributeBindings(attributes) {
    return create$6(null, [{
      expressions: (attributes || []).map(attr => {
        return Object.assign({
          type: expressionTypes.ATTRIBUTE
        }, attr);
      })
    }]);
  }
  /**
   * Create the subcomponents that can be included inside a tag in runtime
   * @param   {Object} components - components imported in runtime
   * @returns {Object} all the components transformed into Riot.Component factory functions
   */


  function createSubcomponents(components) {
    if (components === void 0) {
      components = {};
    }

    return Object.entries(callOrAssign(components)).reduce((acc, _ref4) => {
      let key = _ref4[0],
          value = _ref4[1];
      acc[camelToDashCase(key)] = createComponent(value);
      return acc;
    }, {});
  }
  /**
   * Run the component instance through all the plugins set by the user
   * @param   {Object} component - component instance
   * @returns {Object} the component enhanced by the plugins
   */


  function runPlugins(component) {
    return [...PLUGINS_SET].reduce((c, fn) => fn(c) || c, component);
  }
  /**
   * Compute the component current state merging it with its previous state
   * @param   {Object} oldState - previous state object
   * @param   {Object} newState - new state givent to the `update` call
   * @returns {Object} new object state
   */


  function computeState(oldState, newState) {
    return Object.assign({}, oldState, callOrAssign(newState));
  }
  /**
   * Add eventually the "is" attribute to link this DOM node to its css
   * @param {HTMLElement} element - target root node
   * @param {string} name - name of the component mounted
   * @returns {undefined} it's a void function
   */


  function addCssHook(element, name) {
    if (getName(element) !== name) {
      set(element, 'is', name);
    }
  }
  /**
   * Component creation factory function that will enhance the user provided API
   * @param   {Object} component - a component implementation previously defined
   * @param   {Array} options.slots - component slots generated via riot compiler
   * @param   {Array} options.attributes - attribute expressions generated via riot compiler
   * @returns {Riot.Component} a riot component instance
   */


  function enhanceComponentAPI(component, _ref5) {
    let slots = _ref5.slots,
        attributes = _ref5.attributes,
        props = _ref5.props;
    const attributeBindings = createAttributeBindings(attributes);
    const initialProps = callOrAssign(props);
    return autobindMethods(runPlugins(defineProperties(Object.create(component), {
      mount(element, state, parentScope) {
        if (state === void 0) {
          state = {};
        }

        this.props = Object.freeze(Object.assign({}, initialProps, evaluateProps(element, attributes, parentScope)));
        this.state = computeState(this.state, state);
        this[TEMPLATE_KEY_SYMBOL] = this.template.createDOM(element).clone();
        this[ATTRIBUTES_KEY_SYMBOL] = attributeBindings.createDOM(element).clone(); // link this object to the DOM node

        element[DOM_COMPONENT_INSTANCE_PROPERTY] = this; // add eventually the 'is' attribute

        component.name && addCssHook(element, component.name); // define the root element

        defineProperty(this, 'root', element); // before mount lifecycle event

        this.onBeforeMount(this.props, this.state); // handlte the template and its attributes

        this[ATTRIBUTES_KEY_SYMBOL].mount(element, parentScope);
        this[TEMPLATE_KEY_SYMBOL].mount(element, this); // create the slots and mount them

        this[SLOTS_KEY_SYMBOL] = createSlots(element, slots || []).mount(parentScope);
        this.onMounted(this.props, this.state);
        return this;
      },

      update(state, parentScope) {
        if (state === void 0) {
          state = {};
        }

        const newProps = evaluateProps(this.root, attributes, parentScope, this.props);
        if (this.shouldUpdate(newProps, this.props) === false) return;
        this.props = Object.freeze(Object.assign({}, initialProps, newProps));
        this.state = computeState(this.state, state);
        this.onBeforeUpdate(this.props, this.state);

        if (parentScope) {
          this[ATTRIBUTES_KEY_SYMBOL].update(parentScope);
          this[SLOTS_KEY_SYMBOL].update(parentScope);
        }

        this[TEMPLATE_KEY_SYMBOL].update(this);
        this.onUpdated(this.props, this.state);
        return this;
      },

      unmount(preserveRoot) {
        this.onBeforeUnmount(this.props, this.state);
        this[ATTRIBUTES_KEY_SYMBOL].unmount();
        this[SLOTS_KEY_SYMBOL].unmount();
        this[TEMPLATE_KEY_SYMBOL].unmount(this, !preserveRoot);
        this.onUnmounted(this.props, this.state);
        return this;
      }

    })), Object.keys(component).filter(prop => isFunction(component[prop])));
  }
  /**
   * Component initialization function starting from a DOM node
   * @param   {HTMLElement} element - element to upgrade
   * @param   {Object} initialProps - initial component properties
   * @param   {string} componentName - component id
   * @returns {Object} a new component instance bound to a DOM node
   */

  function mountComponent(element, initialProps, componentName) {
    const name = componentName || getName(element);
    if (!COMPONENTS_IMPLEMENTATION_MAP.has(name)) panic(`The component named "${name}" was never registered`);
    const component = COMPONENTS_IMPLEMENTATION_MAP.get(name)({
      props: initialProps
    });
    return component.mount(element);
  }

  /**
   * Similar to compose but performs from left-to-right function composition.<br/>
   * {@link https://30secondsofcode.org/function#composeright see also}
   * @param   {...[function]} fns) - list of unary function
   * @returns {*} result of the computation
   */
  /**
   * Performs right-to-left function composition.<br/>
   * Use Array.prototype.reduce() to perform right-to-left function composition.<br/>
   * The last (rightmost) function can accept one or more arguments; the remaining functions must be unary.<br/>
   * {@link https://30secondsofcode.org/function#compose original source code}
   * @param   {...[function]} fns) - list of unary function
   * @returns {*} result of the computation
   */

  function compose() {
    for (var _len2 = arguments.length, fns = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      fns[_key2] = arguments[_key2];
    }

    return fns.reduce((f, g) => function () {
      return f(g(...arguments));
    });
  }

  const DOM_COMPONENT_INSTANCE_PROPERTY$1 = DOM_COMPONENT_INSTANCE_PROPERTY,
        COMPONENTS_IMPLEMENTATION_MAP$1 = COMPONENTS_IMPLEMENTATION_MAP,
        PLUGINS_SET$1 = PLUGINS_SET;
  /**
   * Riot public api
   */

  /**
   * Register a custom tag by name
   * @param   {string} name - component name
   * @param   {Object} implementation - tag implementation
   * @returns {Map} map containing all the components implementations
   */

  function register(name, _ref) {
    let css = _ref.css,
        template = _ref.template,
        exports = _ref.exports;
    if (COMPONENTS_IMPLEMENTATION_MAP$1.has(name)) panic(`The component "${name}" was already registered`);
    COMPONENTS_IMPLEMENTATION_MAP$1.set(name, createComponent({
      name,
      css,
      template,
      exports
    }));
    return COMPONENTS_IMPLEMENTATION_MAP$1;
  }
  /**
   * Unregister a riot web component
   * @param   {string} name - component name
   * @returns {Map} map containing all the components implementations
   */

  function unregister(name) {
    if (!COMPONENTS_IMPLEMENTATION_MAP$1.has(name)) panic(`The component "${name}" was never registered`);
    COMPONENTS_IMPLEMENTATION_MAP$1.delete(name);
    cssManager.remove(name);
    return COMPONENTS_IMPLEMENTATION_MAP$1;
  }
  /**
   * Mounting function that will work only for the components that were globally registered
   * @param   {string|HTMLElement} selector - query for the selection or a DOM element
   * @param   {Object} initialProps - the initial component properties
   * @param   {string} name - optional component name
   * @returns {Array} list of nodes upgraded
   */

  function mount(selector, initialProps, name) {
    return $(selector).map(element => mountComponent(element, initialProps, name));
  }
  /**
   * Sweet unmounting helper function for the DOM node mounted manually by the user
   * @param   {string|HTMLElement} selector - query for the selection or a DOM element
   * @returns {Array} list of nodes unmounted
   */

  function unmount(selector) {
    return $(selector).map(element => {
      if (element[DOM_COMPONENT_INSTANCE_PROPERTY$1]) {
        element[DOM_COMPONENT_INSTANCE_PROPERTY$1].unmount();
      }

      return element;
    });
  }
  /**
   * Define a riot plugin
   * @param   {Function} plugin - function that will receive all the components created
   * @returns {Set} the set containing all the plugins installed
   */

  function install(plugin) {
    if (!isFunction(plugin)) panic('Plugins must be of type function');
    if (PLUGINS_SET$1.has(plugin)) panic('This plugin was already install');
    PLUGINS_SET$1.add(plugin);
    return PLUGINS_SET$1;
  }
  /**
   * Uninstall a riot plugin
   * @param   {Function} plugin - plugin previously installed
   * @returns {Set} the set containing all the plugins installed
   */

  function uninstall(plugin) {
    if (!PLUGINS_SET$1.has(plugin)) panic('This plugin was never installed');
    PLUGINS_SET$1.delete(plugin);
    return PLUGINS_SET$1;
  }
  /**
   * Helpter method to create component without relying on the registered ones
   * @param   {Object} implementation - component implementation
   * @returns {Function} function that will allow you to mount a riot component on a DOM node
   */

  function component(implementation) {
    return (el, props) => compose(c => c.mount(el), c => c({
      props
    }), createComponent)(implementation);
  }
  /** @type {string} current riot version */

  const version = 'v4.0.0-rc.2'; // expose some internal stuff that might be used from external tools

  const __ = {
    cssManager,
    defineComponent,
    globals
  };

  exports.__ = __;
  exports.component = component;
  exports.install = install;
  exports.mount = mount;
  exports.register = register;
  exports.uninstall = uninstall;
  exports.unmount = unmount;
  exports.unregister = unregister;
  exports.version = version;

  Object.defineProperty(exports, '__esModule', { value: true });

}));

},{}],3:[function(require,module,exports){
/*
Turbolinks 5.2.0
Copyright © 2018 Basecamp, LLC
 */
(function(){var t=this;(function(){(function(){this.Turbolinks={supported:function(){return null!=window.history.pushState&&null!=window.requestAnimationFrame&&null!=window.addEventListener}(),visit:function(t,r){return e.controller.visit(t,r)},clearCache:function(){return e.controller.clearCache()},setProgressBarDelay:function(t){return e.controller.setProgressBarDelay(t)}}}).call(this)}).call(t);var e=t.Turbolinks;(function(){(function(){var t,r,n,o=[].slice;e.copyObject=function(t){var e,r,n;r={};for(e in t)n=t[e],r[e]=n;return r},e.closest=function(e,r){return t.call(e,r)},t=function(){var t,e;return t=document.documentElement,null!=(e=t.closest)?e:function(t){var e;for(e=this;e;){if(e.nodeType===Node.ELEMENT_NODE&&r.call(e,t))return e;e=e.parentNode}}}(),e.defer=function(t){return setTimeout(t,1)},e.throttle=function(t){var e;return e=null,function(){var r;return r=1<=arguments.length?o.call(arguments,0):[],null!=e?e:e=requestAnimationFrame(function(n){return function(){return e=null,t.apply(n,r)}}(this))}},e.dispatch=function(t,e){var r,o,i,s,a,u;return a=null!=e?e:{},u=a.target,r=a.cancelable,o=a.data,i=document.createEvent("Events"),i.initEvent(t,!0,r===!0),i.data=null!=o?o:{},i.cancelable&&!n&&(s=i.preventDefault,i.preventDefault=function(){return this.defaultPrevented||Object.defineProperty(this,"defaultPrevented",{get:function(){return!0}}),s.call(this)}),(null!=u?u:document).dispatchEvent(i),i},n=function(){var t;return t=document.createEvent("Events"),t.initEvent("test",!0,!0),t.preventDefault(),t.defaultPrevented}(),e.match=function(t,e){return r.call(t,e)},r=function(){var t,e,r,n;return t=document.documentElement,null!=(e=null!=(r=null!=(n=t.matchesSelector)?n:t.webkitMatchesSelector)?r:t.msMatchesSelector)?e:t.mozMatchesSelector}(),e.uuid=function(){var t,e,r;for(r="",t=e=1;36>=e;t=++e)r+=9===t||14===t||19===t||24===t?"-":15===t?"4":20===t?(Math.floor(4*Math.random())+8).toString(16):Math.floor(15*Math.random()).toString(16);return r}}).call(this),function(){e.Location=function(){function t(t){var e,r;null==t&&(t=""),r=document.createElement("a"),r.href=t.toString(),this.absoluteURL=r.href,e=r.hash.length,2>e?this.requestURL=this.absoluteURL:(this.requestURL=this.absoluteURL.slice(0,-e),this.anchor=r.hash.slice(1))}var e,r,n,o;return t.wrap=function(t){return t instanceof this?t:new this(t)},t.prototype.getOrigin=function(){return this.absoluteURL.split("/",3).join("/")},t.prototype.getPath=function(){var t,e;return null!=(t=null!=(e=this.requestURL.match(/\/\/[^\/]*(\/[^?;]*)/))?e[1]:void 0)?t:"/"},t.prototype.getPathComponents=function(){return this.getPath().split("/").slice(1)},t.prototype.getLastPathComponent=function(){return this.getPathComponents().slice(-1)[0]},t.prototype.getExtension=function(){var t,e;return null!=(t=null!=(e=this.getLastPathComponent().match(/\.[^.]*$/))?e[0]:void 0)?t:""},t.prototype.isHTML=function(){return this.getExtension().match(/^(?:|\.(?:htm|html|xhtml))$/)},t.prototype.isPrefixedBy=function(t){var e;return e=r(t),this.isEqualTo(t)||o(this.absoluteURL,e)},t.prototype.isEqualTo=function(t){return this.absoluteURL===(null!=t?t.absoluteURL:void 0)},t.prototype.toCacheKey=function(){return this.requestURL},t.prototype.toJSON=function(){return this.absoluteURL},t.prototype.toString=function(){return this.absoluteURL},t.prototype.valueOf=function(){return this.absoluteURL},r=function(t){return e(t.getOrigin()+t.getPath())},e=function(t){return n(t,"/")?t:t+"/"},o=function(t,e){return t.slice(0,e.length)===e},n=function(t,e){return t.slice(-e.length)===e},t}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.HttpRequest=function(){function r(r,n,o){this.delegate=r,this.requestCanceled=t(this.requestCanceled,this),this.requestTimedOut=t(this.requestTimedOut,this),this.requestFailed=t(this.requestFailed,this),this.requestLoaded=t(this.requestLoaded,this),this.requestProgressed=t(this.requestProgressed,this),this.url=e.Location.wrap(n).requestURL,this.referrer=e.Location.wrap(o).absoluteURL,this.createXHR()}return r.NETWORK_FAILURE=0,r.TIMEOUT_FAILURE=-1,r.timeout=60,r.prototype.send=function(){var t;return this.xhr&&!this.sent?(this.notifyApplicationBeforeRequestStart(),this.setProgress(0),this.xhr.send(),this.sent=!0,"function"==typeof(t=this.delegate).requestStarted?t.requestStarted():void 0):void 0},r.prototype.cancel=function(){return this.xhr&&this.sent?this.xhr.abort():void 0},r.prototype.requestProgressed=function(t){return t.lengthComputable?this.setProgress(t.loaded/t.total):void 0},r.prototype.requestLoaded=function(){return this.endRequest(function(t){return function(){var e;return 200<=(e=t.xhr.status)&&300>e?t.delegate.requestCompletedWithResponse(t.xhr.responseText,t.xhr.getResponseHeader("Turbolinks-Location")):(t.failed=!0,t.delegate.requestFailedWithStatusCode(t.xhr.status,t.xhr.responseText))}}(this))},r.prototype.requestFailed=function(){return this.endRequest(function(t){return function(){return t.failed=!0,t.delegate.requestFailedWithStatusCode(t.constructor.NETWORK_FAILURE)}}(this))},r.prototype.requestTimedOut=function(){return this.endRequest(function(t){return function(){return t.failed=!0,t.delegate.requestFailedWithStatusCode(t.constructor.TIMEOUT_FAILURE)}}(this))},r.prototype.requestCanceled=function(){return this.endRequest()},r.prototype.notifyApplicationBeforeRequestStart=function(){return e.dispatch("turbolinks:request-start",{data:{url:this.url,xhr:this.xhr}})},r.prototype.notifyApplicationAfterRequestEnd=function(){return e.dispatch("turbolinks:request-end",{data:{url:this.url,xhr:this.xhr}})},r.prototype.createXHR=function(){return this.xhr=new XMLHttpRequest,this.xhr.open("GET",this.url,!0),this.xhr.timeout=1e3*this.constructor.timeout,this.xhr.setRequestHeader("Accept","text/html, application/xhtml+xml"),this.xhr.setRequestHeader("Turbolinks-Referrer",this.referrer),this.xhr.onprogress=this.requestProgressed,this.xhr.onload=this.requestLoaded,this.xhr.onerror=this.requestFailed,this.xhr.ontimeout=this.requestTimedOut,this.xhr.onabort=this.requestCanceled},r.prototype.endRequest=function(t){return this.xhr?(this.notifyApplicationAfterRequestEnd(),null!=t&&t.call(this),this.destroy()):void 0},r.prototype.setProgress=function(t){var e;return this.progress=t,"function"==typeof(e=this.delegate).requestProgressed?e.requestProgressed(this.progress):void 0},r.prototype.destroy=function(){var t;return this.setProgress(1),"function"==typeof(t=this.delegate).requestFinished&&t.requestFinished(),this.delegate=null,this.xhr=null},r}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.ProgressBar=function(){function e(){this.trickle=t(this.trickle,this),this.stylesheetElement=this.createStylesheetElement(),this.progressElement=this.createProgressElement()}var r;return r=300,e.defaultCSS=".turbolinks-progress-bar {\n  position: fixed;\n  display: block;\n  top: 0;\n  left: 0;\n  height: 3px;\n  background: #0076ff;\n  z-index: 9999;\n  transition: width "+r+"ms ease-out, opacity "+r/2+"ms "+r/2+"ms ease-in;\n  transform: translate3d(0, 0, 0);\n}",e.prototype.show=function(){return this.visible?void 0:(this.visible=!0,this.installStylesheetElement(),this.installProgressElement(),this.startTrickling())},e.prototype.hide=function(){return this.visible&&!this.hiding?(this.hiding=!0,this.fadeProgressElement(function(t){return function(){return t.uninstallProgressElement(),t.stopTrickling(),t.visible=!1,t.hiding=!1}}(this))):void 0},e.prototype.setValue=function(t){return this.value=t,this.refresh()},e.prototype.installStylesheetElement=function(){return document.head.insertBefore(this.stylesheetElement,document.head.firstChild)},e.prototype.installProgressElement=function(){return this.progressElement.style.width=0,this.progressElement.style.opacity=1,document.documentElement.insertBefore(this.progressElement,document.body),this.refresh()},e.prototype.fadeProgressElement=function(t){return this.progressElement.style.opacity=0,setTimeout(t,1.5*r)},e.prototype.uninstallProgressElement=function(){return this.progressElement.parentNode?document.documentElement.removeChild(this.progressElement):void 0},e.prototype.startTrickling=function(){return null!=this.trickleInterval?this.trickleInterval:this.trickleInterval=setInterval(this.trickle,r)},e.prototype.stopTrickling=function(){return clearInterval(this.trickleInterval),this.trickleInterval=null},e.prototype.trickle=function(){return this.setValue(this.value+Math.random()/100)},e.prototype.refresh=function(){return requestAnimationFrame(function(t){return function(){return t.progressElement.style.width=10+90*t.value+"%"}}(this))},e.prototype.createStylesheetElement=function(){var t;return t=document.createElement("style"),t.type="text/css",t.textContent=this.constructor.defaultCSS,t},e.prototype.createProgressElement=function(){var t;return t=document.createElement("div"),t.className="turbolinks-progress-bar",t},e}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.BrowserAdapter=function(){function r(r){this.controller=r,this.showProgressBar=t(this.showProgressBar,this),this.progressBar=new e.ProgressBar}var n,o,i;return i=e.HttpRequest,n=i.NETWORK_FAILURE,o=i.TIMEOUT_FAILURE,r.prototype.visitProposedToLocationWithAction=function(t,e){return this.controller.startVisitToLocationWithAction(t,e)},r.prototype.visitStarted=function(t){return t.issueRequest(),t.changeHistory(),t.loadCachedSnapshot()},r.prototype.visitRequestStarted=function(t){return this.progressBar.setValue(0),t.hasCachedSnapshot()||"restore"!==t.action?this.showProgressBarAfterDelay():this.showProgressBar()},r.prototype.visitRequestProgressed=function(t){return this.progressBar.setValue(t.progress)},r.prototype.visitRequestCompleted=function(t){return t.loadResponse()},r.prototype.visitRequestFailedWithStatusCode=function(t,e){switch(e){case n:case o:return this.reload();default:return t.loadResponse()}},r.prototype.visitRequestFinished=function(t){return this.hideProgressBar()},r.prototype.visitCompleted=function(t){return t.followRedirect()},r.prototype.pageInvalidated=function(){return this.reload()},r.prototype.showProgressBarAfterDelay=function(){return this.progressBarTimeout=setTimeout(this.showProgressBar,this.controller.progressBarDelay)},r.prototype.showProgressBar=function(){return this.progressBar.show()},r.prototype.hideProgressBar=function(){return this.progressBar.hide(),clearTimeout(this.progressBarTimeout)},r.prototype.reload=function(){return window.location.reload()},r}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.History=function(){function r(e){this.delegate=e,this.onPageLoad=t(this.onPageLoad,this),this.onPopState=t(this.onPopState,this)}return r.prototype.start=function(){return this.started?void 0:(addEventListener("popstate",this.onPopState,!1),addEventListener("load",this.onPageLoad,!1),this.started=!0)},r.prototype.stop=function(){return this.started?(removeEventListener("popstate",this.onPopState,!1),removeEventListener("load",this.onPageLoad,!1),this.started=!1):void 0},r.prototype.push=function(t,r){return t=e.Location.wrap(t),this.update("push",t,r)},r.prototype.replace=function(t,r){return t=e.Location.wrap(t),this.update("replace",t,r)},r.prototype.onPopState=function(t){var r,n,o,i;return this.shouldHandlePopState()&&(i=null!=(n=t.state)?n.turbolinks:void 0)?(r=e.Location.wrap(window.location),o=i.restorationIdentifier,this.delegate.historyPoppedToLocationWithRestorationIdentifier(r,o)):void 0},r.prototype.onPageLoad=function(t){return e.defer(function(t){return function(){return t.pageLoaded=!0}}(this))},r.prototype.shouldHandlePopState=function(){return this.pageIsLoaded()},r.prototype.pageIsLoaded=function(){return this.pageLoaded||"complete"===document.readyState},r.prototype.update=function(t,e,r){var n;return n={turbolinks:{restorationIdentifier:r}},history[t+"State"](n,null,e)},r}()}.call(this),function(){e.HeadDetails=function(){function t(t){var e,r,n,s,a,u;for(this.elements={},n=0,a=t.length;a>n;n++)u=t[n],u.nodeType===Node.ELEMENT_NODE&&(s=u.outerHTML,r=null!=(e=this.elements)[s]?e[s]:e[s]={type:i(u),tracked:o(u),elements:[]},r.elements.push(u))}var e,r,n,o,i;return t.fromHeadElement=function(t){var e;return new this(null!=(e=null!=t?t.childNodes:void 0)?e:[])},t.prototype.hasElementWithKey=function(t){return t in this.elements},t.prototype.getTrackedElementSignature=function(){var t,e;return function(){var r,n;r=this.elements,n=[];for(t in r)e=r[t].tracked,e&&n.push(t);return n}.call(this).join("")},t.prototype.getScriptElementsNotInDetails=function(t){return this.getElementsMatchingTypeNotInDetails("script",t)},t.prototype.getStylesheetElementsNotInDetails=function(t){return this.getElementsMatchingTypeNotInDetails("stylesheet",t)},t.prototype.getElementsMatchingTypeNotInDetails=function(t,e){var r,n,o,i,s,a;o=this.elements,s=[];for(n in o)i=o[n],a=i.type,r=i.elements,a!==t||e.hasElementWithKey(n)||s.push(r[0]);return s},t.prototype.getProvisionalElements=function(){var t,e,r,n,o,i,s;r=[],n=this.elements;for(e in n)o=n[e],s=o.type,i=o.tracked,t=o.elements,null!=s||i?t.length>1&&r.push.apply(r,t.slice(1)):r.push.apply(r,t);return r},t.prototype.getMetaValue=function(t){var e;return null!=(e=this.findMetaElementByName(t))?e.getAttribute("content"):void 0},t.prototype.findMetaElementByName=function(t){var r,n,o,i;r=void 0,i=this.elements;for(o in i)n=i[o].elements,e(n[0],t)&&(r=n[0]);return r},i=function(t){return r(t)?"script":n(t)?"stylesheet":void 0},o=function(t){return"reload"===t.getAttribute("data-turbolinks-track")},r=function(t){var e;return e=t.tagName.toLowerCase(),"script"===e},n=function(t){var e;return e=t.tagName.toLowerCase(),"style"===e||"link"===e&&"stylesheet"===t.getAttribute("rel")},e=function(t,e){var r;return r=t.tagName.toLowerCase(),"meta"===r&&t.getAttribute("name")===e},t}()}.call(this),function(){e.Snapshot=function(){function t(t,e){this.headDetails=t,this.bodyElement=e}return t.wrap=function(t){return t instanceof this?t:"string"==typeof t?this.fromHTMLString(t):this.fromHTMLElement(t)},t.fromHTMLString=function(t){var e;return e=document.createElement("html"),e.innerHTML=t,this.fromHTMLElement(e)},t.fromHTMLElement=function(t){var r,n,o,i;return o=t.querySelector("head"),r=null!=(i=t.querySelector("body"))?i:document.createElement("body"),n=e.HeadDetails.fromHeadElement(o),new this(n,r)},t.prototype.clone=function(){return new this.constructor(this.headDetails,this.bodyElement.cloneNode(!0))},t.prototype.getRootLocation=function(){var t,r;return r=null!=(t=this.getSetting("root"))?t:"/",new e.Location(r)},t.prototype.getCacheControlValue=function(){return this.getSetting("cache-control")},t.prototype.getElementForAnchor=function(t){try{return this.bodyElement.querySelector("[id='"+t+"'], a[name='"+t+"']")}catch(e){}},t.prototype.getPermanentElements=function(){return this.bodyElement.querySelectorAll("[id][data-turbolinks-permanent]")},t.prototype.getPermanentElementById=function(t){return this.bodyElement.querySelector("#"+t+"[data-turbolinks-permanent]")},t.prototype.getPermanentElementsPresentInSnapshot=function(t){var e,r,n,o,i;for(o=this.getPermanentElements(),i=[],r=0,n=o.length;n>r;r++)e=o[r],t.getPermanentElementById(e.id)&&i.push(e);return i},t.prototype.findFirstAutofocusableElement=function(){return this.bodyElement.querySelector("[autofocus]")},t.prototype.hasAnchor=function(t){return null!=this.getElementForAnchor(t)},t.prototype.isPreviewable=function(){return"no-preview"!==this.getCacheControlValue()},t.prototype.isCacheable=function(){return"no-cache"!==this.getCacheControlValue()},t.prototype.isVisitable=function(){return"reload"!==this.getSetting("visit-control")},t.prototype.getSetting=function(t){return this.headDetails.getMetaValue("turbolinks-"+t)},t}()}.call(this),function(){var t=[].slice;e.Renderer=function(){function e(){}var r;return e.render=function(){var e,r,n,o;return n=arguments[0],r=arguments[1],e=3<=arguments.length?t.call(arguments,2):[],o=function(t,e,r){r.prototype=t.prototype;var n=new r,o=t.apply(n,e);return Object(o)===o?o:n}(this,e,function(){}),o.delegate=n,o.render(r),o},e.prototype.renderView=function(t){return this.delegate.viewWillRender(this.newBody),t(),this.delegate.viewRendered(this.newBody)},e.prototype.invalidateView=function(){return this.delegate.viewInvalidated()},e.prototype.createScriptElement=function(t){var e;return"false"===t.getAttribute("data-turbolinks-eval")?t:(e=document.createElement("script"),e.textContent=t.textContent,e.async=!1,r(e,t),e)},r=function(t,e){var r,n,o,i,s,a,u;for(i=e.attributes,a=[],r=0,n=i.length;n>r;r++)s=i[r],o=s.name,u=s.value,a.push(t.setAttribute(o,u));return a},e}()}.call(this),function(){var t,r,n=function(t,e){function r(){this.constructor=t}for(var n in e)o.call(e,n)&&(t[n]=e[n]);return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t},o={}.hasOwnProperty;e.SnapshotRenderer=function(e){function o(t,e,r){this.currentSnapshot=t,this.newSnapshot=e,this.isPreview=r,this.currentHeadDetails=this.currentSnapshot.headDetails,this.newHeadDetails=this.newSnapshot.headDetails,this.currentBody=this.currentSnapshot.bodyElement,this.newBody=this.newSnapshot.bodyElement}return n(o,e),o.prototype.render=function(t){return this.shouldRender()?(this.mergeHead(),this.renderView(function(e){return function(){return e.replaceBody(),e.isPreview||e.focusFirstAutofocusableElement(),t()}}(this))):this.invalidateView()},o.prototype.mergeHead=function(){return this.copyNewHeadStylesheetElements(),this.copyNewHeadScriptElements(),this.removeCurrentHeadProvisionalElements(),this.copyNewHeadProvisionalElements()},o.prototype.replaceBody=function(){var t;return t=this.relocateCurrentBodyPermanentElements(),this.activateNewBodyScriptElements(),this.assignNewBody(),this.replacePlaceholderElementsWithClonedPermanentElements(t)},o.prototype.shouldRender=function(){return this.newSnapshot.isVisitable()&&this.trackedElementsAreIdentical()},o.prototype.trackedElementsAreIdentical=function(){return this.currentHeadDetails.getTrackedElementSignature()===this.newHeadDetails.getTrackedElementSignature()},o.prototype.copyNewHeadStylesheetElements=function(){var t,e,r,n,o;for(n=this.getNewHeadStylesheetElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.appendChild(t));return o},o.prototype.copyNewHeadScriptElements=function(){var t,e,r,n,o;for(n=this.getNewHeadScriptElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.appendChild(this.createScriptElement(t)));return o},o.prototype.removeCurrentHeadProvisionalElements=function(){var t,e,r,n,o;for(n=this.getCurrentHeadProvisionalElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.removeChild(t));return o},o.prototype.copyNewHeadProvisionalElements=function(){var t,e,r,n,o;for(n=this.getNewHeadProvisionalElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.appendChild(t));return o},o.prototype.relocateCurrentBodyPermanentElements=function(){var e,n,o,i,s,a,u;for(a=this.getCurrentBodyPermanentElements(),u=[],e=0,n=a.length;n>e;e++)i=a[e],s=t(i),o=this.newSnapshot.getPermanentElementById(i.id),r(i,s.element),r(o,i),u.push(s);return u},o.prototype.replacePlaceholderElementsWithClonedPermanentElements=function(t){var e,n,o,i,s,a,u;for(u=[],o=0,i=t.length;i>o;o++)a=t[o],n=a.element,s=a.permanentElement,e=s.cloneNode(!0),u.push(r(n,e));return u},o.prototype.activateNewBodyScriptElements=function(){var t,e,n,o,i,s;for(i=this.getNewBodyScriptElements(),s=[],e=0,o=i.length;o>e;e++)n=i[e],t=this.createScriptElement(n),s.push(r(n,t));return s},o.prototype.assignNewBody=function(){return document.body=this.newBody},o.prototype.focusFirstAutofocusableElement=function(){var t;return null!=(t=this.newSnapshot.findFirstAutofocusableElement())?t.focus():void 0},o.prototype.getNewHeadStylesheetElements=function(){return this.newHeadDetails.getStylesheetElementsNotInDetails(this.currentHeadDetails)},o.prototype.getNewHeadScriptElements=function(){return this.newHeadDetails.getScriptElementsNotInDetails(this.currentHeadDetails)},o.prototype.getCurrentHeadProvisionalElements=function(){return this.currentHeadDetails.getProvisionalElements()},o.prototype.getNewHeadProvisionalElements=function(){return this.newHeadDetails.getProvisionalElements()},o.prototype.getCurrentBodyPermanentElements=function(){return this.currentSnapshot.getPermanentElementsPresentInSnapshot(this.newSnapshot)},o.prototype.getNewBodyScriptElements=function(){return this.newBody.querySelectorAll("script")},o}(e.Renderer),t=function(t){var e;return e=document.createElement("meta"),e.setAttribute("name","turbolinks-permanent-placeholder"),e.setAttribute("content",t.id),{element:e,permanentElement:t}},r=function(t,e){var r;return(r=t.parentNode)?r.replaceChild(e,t):void 0}}.call(this),function(){var t=function(t,e){function n(){this.constructor=t}for(var o in e)r.call(e,o)&&(t[o]=e[o]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},r={}.hasOwnProperty;e.ErrorRenderer=function(e){function r(t){var e;e=document.createElement("html"),e.innerHTML=t,this.newHead=e.querySelector("head"),this.newBody=e.querySelector("body")}return t(r,e),r.prototype.render=function(t){return this.renderView(function(e){return function(){return e.replaceHeadAndBody(),e.activateBodyScriptElements(),t()}}(this))},r.prototype.replaceHeadAndBody=function(){var t,e;return e=document.head,t=document.body,e.parentNode.replaceChild(this.newHead,e),t.parentNode.replaceChild(this.newBody,t)},r.prototype.activateBodyScriptElements=function(){var t,e,r,n,o,i;for(n=this.getScriptElements(),i=[],e=0,r=n.length;r>e;e++)o=n[e],t=this.createScriptElement(o),i.push(o.parentNode.replaceChild(t,o));return i},r.prototype.getScriptElements=function(){return document.documentElement.querySelectorAll("script")},r}(e.Renderer)}.call(this),function(){e.View=function(){function t(t){this.delegate=t,this.htmlElement=document.documentElement}return t.prototype.getRootLocation=function(){return this.getSnapshot().getRootLocation()},t.prototype.getElementForAnchor=function(t){return this.getSnapshot().getElementForAnchor(t)},t.prototype.getSnapshot=function(){return e.Snapshot.fromHTMLElement(this.htmlElement)},t.prototype.render=function(t,e){var r,n,o;return o=t.snapshot,r=t.error,n=t.isPreview,this.markAsPreview(n),null!=o?this.renderSnapshot(o,n,e):this.renderError(r,e)},t.prototype.markAsPreview=function(t){return t?this.htmlElement.setAttribute("data-turbolinks-preview",""):this.htmlElement.removeAttribute("data-turbolinks-preview")},t.prototype.renderSnapshot=function(t,r,n){return e.SnapshotRenderer.render(this.delegate,n,this.getSnapshot(),e.Snapshot.wrap(t),r)},t.prototype.renderError=function(t,r){return e.ErrorRenderer.render(this.delegate,r,t)},t}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.ScrollManager=function(){function r(r){this.delegate=r,this.onScroll=t(this.onScroll,this),this.onScroll=e.throttle(this.onScroll)}return r.prototype.start=function(){return this.started?void 0:(addEventListener("scroll",this.onScroll,!1),this.onScroll(),this.started=!0)},r.prototype.stop=function(){return this.started?(removeEventListener("scroll",this.onScroll,!1),this.started=!1):void 0},r.prototype.scrollToElement=function(t){return t.scrollIntoView()},r.prototype.scrollToPosition=function(t){var e,r;return e=t.x,r=t.y,window.scrollTo(e,r)},r.prototype.onScroll=function(t){return this.updatePosition({x:window.pageXOffset,y:window.pageYOffset})},r.prototype.updatePosition=function(t){var e;return this.position=t,null!=(e=this.delegate)?e.scrollPositionChanged(this.position):void 0},r}()}.call(this),function(){e.SnapshotCache=function(){function t(t){this.size=t,this.keys=[],this.snapshots={}}var r;return t.prototype.has=function(t){var e;return e=r(t),e in this.snapshots},t.prototype.get=function(t){var e;if(this.has(t))return e=this.read(t),this.touch(t),e},t.prototype.put=function(t,e){return this.write(t,e),this.touch(t),e},t.prototype.read=function(t){var e;return e=r(t),this.snapshots[e]},t.prototype.write=function(t,e){var n;return n=r(t),this.snapshots[n]=e},t.prototype.touch=function(t){var e,n;return n=r(t),e=this.keys.indexOf(n),e>-1&&this.keys.splice(e,1),this.keys.unshift(n),this.trim()},t.prototype.trim=function(){var t,e,r,n,o;for(n=this.keys.splice(this.size),o=[],t=0,r=n.length;r>t;t++)e=n[t],o.push(delete this.snapshots[e]);return o},r=function(t){return e.Location.wrap(t).toCacheKey()},t}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.Visit=function(){function r(r,n,o){this.controller=r,this.action=o,this.performScroll=t(this.performScroll,this),this.identifier=e.uuid(),this.location=e.Location.wrap(n),this.adapter=this.controller.adapter,this.state="initialized",this.timingMetrics={}}var n;return r.prototype.start=function(){return"initialized"===this.state?(this.recordTimingMetric("visitStart"),this.state="started",this.adapter.visitStarted(this)):void 0},r.prototype.cancel=function(){var t;return"started"===this.state?(null!=(t=this.request)&&t.cancel(),this.cancelRender(),this.state="canceled"):void 0},r.prototype.complete=function(){var t;return"started"===this.state?(this.recordTimingMetric("visitEnd"),this.state="completed","function"==typeof(t=this.adapter).visitCompleted&&t.visitCompleted(this),this.controller.visitCompleted(this)):void 0},r.prototype.fail=function(){var t;return"started"===this.state?(this.state="failed","function"==typeof(t=this.adapter).visitFailed?t.visitFailed(this):void 0):void 0},r.prototype.changeHistory=function(){var t,e;return this.historyChanged?void 0:(t=this.location.isEqualTo(this.referrer)?"replace":this.action,e=n(t),this.controller[e](this.location,this.restorationIdentifier),this.historyChanged=!0)},r.prototype.issueRequest=function(){return this.shouldIssueRequest()&&null==this.request?(this.progress=0,this.request=new e.HttpRequest(this,this.location,this.referrer),this.request.send()):void 0},r.prototype.getCachedSnapshot=function(){var t;return!(t=this.controller.getCachedSnapshotForLocation(this.location))||null!=this.location.anchor&&!t.hasAnchor(this.location.anchor)||"restore"!==this.action&&!t.isPreviewable()?void 0:t},r.prototype.hasCachedSnapshot=function(){return null!=this.getCachedSnapshot()},r.prototype.loadCachedSnapshot=function(){var t,e;return(e=this.getCachedSnapshot())?(t=this.shouldIssueRequest(),this.render(function(){var r;return this.cacheSnapshot(),this.controller.render({snapshot:e,isPreview:t},this.performScroll),"function"==typeof(r=this.adapter).visitRendered&&r.visitRendered(this),t?void 0:this.complete()})):void 0},r.prototype.loadResponse=function(){return null!=this.response?this.render(function(){var t,e;return this.cacheSnapshot(),this.request.failed?(this.controller.render({error:this.response},this.performScroll),"function"==typeof(t=this.adapter).visitRendered&&t.visitRendered(this),this.fail()):(this.controller.render({snapshot:this.response},this.performScroll),"function"==typeof(e=this.adapter).visitRendered&&e.visitRendered(this),this.complete())}):void 0},r.prototype.followRedirect=function(){return this.redirectedToLocation&&!this.followedRedirect?(this.location=this.redirectedToLocation,this.controller.replaceHistoryWithLocationAndRestorationIdentifier(this.redirectedToLocation,this.restorationIdentifier),this.followedRedirect=!0):void 0},r.prototype.requestStarted=function(){var t;return this.recordTimingMetric("requestStart"),"function"==typeof(t=this.adapter).visitRequestStarted?t.visitRequestStarted(this):void 0},r.prototype.requestProgressed=function(t){var e;return this.progress=t,"function"==typeof(e=this.adapter).visitRequestProgressed?e.visitRequestProgressed(this):void 0},r.prototype.requestCompletedWithResponse=function(t,r){return this.response=t,null!=r&&(this.redirectedToLocation=e.Location.wrap(r)),this.adapter.visitRequestCompleted(this)},r.prototype.requestFailedWithStatusCode=function(t,e){return this.response=e,this.adapter.visitRequestFailedWithStatusCode(this,t)},r.prototype.requestFinished=function(){var t;return this.recordTimingMetric("requestEnd"),"function"==typeof(t=this.adapter).visitRequestFinished?t.visitRequestFinished(this):void 0},r.prototype.performScroll=function(){return this.scrolled?void 0:("restore"===this.action?this.scrollToRestoredPosition()||this.scrollToTop():this.scrollToAnchor()||this.scrollToTop(),this.scrolled=!0)},r.prototype.scrollToRestoredPosition=function(){var t,e;return t=null!=(e=this.restorationData)?e.scrollPosition:void 0,null!=t?(this.controller.scrollToPosition(t),!0):void 0},r.prototype.scrollToAnchor=function(){return null!=this.location.anchor?(this.controller.scrollToAnchor(this.location.anchor),!0):void 0},r.prototype.scrollToTop=function(){return this.controller.scrollToPosition({x:0,y:0})},r.prototype.recordTimingMetric=function(t){var e;return null!=(e=this.timingMetrics)[t]?e[t]:e[t]=(new Date).getTime()},r.prototype.getTimingMetrics=function(){return e.copyObject(this.timingMetrics)},n=function(t){switch(t){case"replace":return"replaceHistoryWithLocationAndRestorationIdentifier";case"advance":case"restore":return"pushHistoryWithLocationAndRestorationIdentifier"}},r.prototype.shouldIssueRequest=function(){return"restore"===this.action?!this.hasCachedSnapshot():!0},r.prototype.cacheSnapshot=function(){return this.snapshotCached?void 0:(this.controller.cacheSnapshot(),this.snapshotCached=!0)},r.prototype.render=function(t){return this.cancelRender(),this.frame=requestAnimationFrame(function(e){return function(){return e.frame=null,t.call(e)}}(this))},r.prototype.cancelRender=function(){return this.frame?cancelAnimationFrame(this.frame):void 0},r}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.Controller=function(){function r(){this.clickBubbled=t(this.clickBubbled,this),this.clickCaptured=t(this.clickCaptured,this),this.pageLoaded=t(this.pageLoaded,this),this.history=new e.History(this),this.view=new e.View(this),this.scrollManager=new e.ScrollManager(this),this.restorationData={},this.clearCache(),this.setProgressBarDelay(500)}return r.prototype.start=function(){return e.supported&&!this.started?(addEventListener("click",this.clickCaptured,!0),addEventListener("DOMContentLoaded",this.pageLoaded,!1),this.scrollManager.start(),this.startHistory(),this.started=!0,this.enabled=!0):void 0},r.prototype.disable=function(){return this.enabled=!1},r.prototype.stop=function(){return this.started?(removeEventListener("click",this.clickCaptured,!0),removeEventListener("DOMContentLoaded",this.pageLoaded,!1),this.scrollManager.stop(),this.stopHistory(),this.started=!1):void 0},r.prototype.clearCache=function(){return this.cache=new e.SnapshotCache(10)},r.prototype.visit=function(t,r){var n,o;return null==r&&(r={}),t=e.Location.wrap(t),this.applicationAllowsVisitingLocation(t)?this.locationIsVisitable(t)?(n=null!=(o=r.action)?o:"advance",this.adapter.visitProposedToLocationWithAction(t,n)):window.location=t:void 0},r.prototype.startVisitToLocationWithAction=function(t,r,n){var o;return e.supported?(o=this.getRestorationDataForIdentifier(n),this.startVisit(t,r,{restorationData:o})):window.location=t},r.prototype.setProgressBarDelay=function(t){return this.progressBarDelay=t},r.prototype.startHistory=function(){return this.location=e.Location.wrap(window.location),this.restorationIdentifier=e.uuid(),this.history.start(),this.history.replace(this.location,this.restorationIdentifier)},r.prototype.stopHistory=function(){return this.history.stop()},r.prototype.pushHistoryWithLocationAndRestorationIdentifier=function(t,r){return this.restorationIdentifier=r,this.location=e.Location.wrap(t),this.history.push(this.location,this.restorationIdentifier)},r.prototype.replaceHistoryWithLocationAndRestorationIdentifier=function(t,r){return this.restorationIdentifier=r,this.location=e.Location.wrap(t),this.history.replace(this.location,this.restorationIdentifier)},r.prototype.historyPoppedToLocationWithRestorationIdentifier=function(t,r){var n;return this.restorationIdentifier=r,this.enabled?(n=this.getRestorationDataForIdentifier(this.restorationIdentifier),this.startVisit(t,"restore",{restorationIdentifier:this.restorationIdentifier,restorationData:n,historyChanged:!0}),this.location=e.Location.wrap(t)):this.adapter.pageInvalidated()},r.prototype.getCachedSnapshotForLocation=function(t){var e;return null!=(e=this.cache.get(t))?e.clone():void 0},r.prototype.shouldCacheSnapshot=function(){return this.view.getSnapshot().isCacheable();
},r.prototype.cacheSnapshot=function(){var t,r;return this.shouldCacheSnapshot()?(this.notifyApplicationBeforeCachingSnapshot(),r=this.view.getSnapshot(),t=this.lastRenderedLocation,e.defer(function(e){return function(){return e.cache.put(t,r.clone())}}(this))):void 0},r.prototype.scrollToAnchor=function(t){var e;return(e=this.view.getElementForAnchor(t))?this.scrollToElement(e):this.scrollToPosition({x:0,y:0})},r.prototype.scrollToElement=function(t){return this.scrollManager.scrollToElement(t)},r.prototype.scrollToPosition=function(t){return this.scrollManager.scrollToPosition(t)},r.prototype.scrollPositionChanged=function(t){var e;return e=this.getCurrentRestorationData(),e.scrollPosition=t},r.prototype.render=function(t,e){return this.view.render(t,e)},r.prototype.viewInvalidated=function(){return this.adapter.pageInvalidated()},r.prototype.viewWillRender=function(t){return this.notifyApplicationBeforeRender(t)},r.prototype.viewRendered=function(){return this.lastRenderedLocation=this.currentVisit.location,this.notifyApplicationAfterRender()},r.prototype.pageLoaded=function(){return this.lastRenderedLocation=this.location,this.notifyApplicationAfterPageLoad()},r.prototype.clickCaptured=function(){return removeEventListener("click",this.clickBubbled,!1),addEventListener("click",this.clickBubbled,!1)},r.prototype.clickBubbled=function(t){var e,r,n;return this.enabled&&this.clickEventIsSignificant(t)&&(r=this.getVisitableLinkForNode(t.target))&&(n=this.getVisitableLocationForLink(r))&&this.applicationAllowsFollowingLinkToLocation(r,n)?(t.preventDefault(),e=this.getActionForLink(r),this.visit(n,{action:e})):void 0},r.prototype.applicationAllowsFollowingLinkToLocation=function(t,e){var r;return r=this.notifyApplicationAfterClickingLinkToLocation(t,e),!r.defaultPrevented},r.prototype.applicationAllowsVisitingLocation=function(t){var e;return e=this.notifyApplicationBeforeVisitingLocation(t),!e.defaultPrevented},r.prototype.notifyApplicationAfterClickingLinkToLocation=function(t,r){return e.dispatch("turbolinks:click",{target:t,data:{url:r.absoluteURL},cancelable:!0})},r.prototype.notifyApplicationBeforeVisitingLocation=function(t){return e.dispatch("turbolinks:before-visit",{data:{url:t.absoluteURL},cancelable:!0})},r.prototype.notifyApplicationAfterVisitingLocation=function(t){return e.dispatch("turbolinks:visit",{data:{url:t.absoluteURL}})},r.prototype.notifyApplicationBeforeCachingSnapshot=function(){return e.dispatch("turbolinks:before-cache")},r.prototype.notifyApplicationBeforeRender=function(t){return e.dispatch("turbolinks:before-render",{data:{newBody:t}})},r.prototype.notifyApplicationAfterRender=function(){return e.dispatch("turbolinks:render")},r.prototype.notifyApplicationAfterPageLoad=function(t){return null==t&&(t={}),e.dispatch("turbolinks:load",{data:{url:this.location.absoluteURL,timing:t}})},r.prototype.startVisit=function(t,e,r){var n;return null!=(n=this.currentVisit)&&n.cancel(),this.currentVisit=this.createVisit(t,e,r),this.currentVisit.start(),this.notifyApplicationAfterVisitingLocation(t)},r.prototype.createVisit=function(t,r,n){var o,i,s,a,u;return i=null!=n?n:{},a=i.restorationIdentifier,s=i.restorationData,o=i.historyChanged,u=new e.Visit(this,t,r),u.restorationIdentifier=null!=a?a:e.uuid(),u.restorationData=e.copyObject(s),u.historyChanged=o,u.referrer=this.location,u},r.prototype.visitCompleted=function(t){return this.notifyApplicationAfterPageLoad(t.getTimingMetrics())},r.prototype.clickEventIsSignificant=function(t){return!(t.defaultPrevented||t.target.isContentEditable||t.which>1||t.altKey||t.ctrlKey||t.metaKey||t.shiftKey)},r.prototype.getVisitableLinkForNode=function(t){return this.nodeIsVisitable(t)?e.closest(t,"a[href]:not([target]):not([download])"):void 0},r.prototype.getVisitableLocationForLink=function(t){var r;return r=new e.Location(t.getAttribute("href")),this.locationIsVisitable(r)?r:void 0},r.prototype.getActionForLink=function(t){var e;return null!=(e=t.getAttribute("data-turbolinks-action"))?e:"advance"},r.prototype.nodeIsVisitable=function(t){var r;return(r=e.closest(t,"[data-turbolinks]"))?"false"!==r.getAttribute("data-turbolinks"):!0},r.prototype.locationIsVisitable=function(t){return t.isPrefixedBy(this.view.getRootLocation())&&t.isHTML()},r.prototype.getCurrentRestorationData=function(){return this.getRestorationDataForIdentifier(this.restorationIdentifier)},r.prototype.getRestorationDataForIdentifier=function(t){var e;return null!=(e=this.restorationData)[t]?e[t]:e[t]={}},r}()}.call(this),function(){!function(){var t,e;if((t=e=document.currentScript)&&!e.hasAttribute("data-turbolinks-suppress-warning"))for(;t=t.parentNode;)if(t===document.body)return console.warn("You are loading Turbolinks from a <script> element inside the <body> element. This is probably not what you meant to do!\n\nLoad your application\u2019s JavaScript bundle inside the <head> element instead. <script> elements in <body> are evaluated with each page change.\n\nFor more information, see: https://github.com/turbolinks/turbolinks#working-with-script-elements\n\n\u2014\u2014\nSuppress this warning by adding a `data-turbolinks-suppress-warning` attribute to: %s",e.outerHTML)}()}.call(this),function(){var t,r,n;e.start=function(){return r()?(null==e.controller&&(e.controller=t()),e.controller.start()):void 0},r=function(){return null==window.Turbolinks&&(window.Turbolinks=e),n()},t=function(){var t;return t=new e.Controller,t.adapter=new e.BrowserAdapter(t),t},n=function(){return window.Turbolinks===e},n()&&e.start()}.call(this)}).call(this),"object"==typeof module&&module.exports?module.exports=e:"function"==typeof define&&define.amd&&define(e)}).call(this);
},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  'css': null,
  'exports': null,
  'template': function (template, expressionTypes, bindingTypes, getComponent) {
    return template('\n  404\n', []);
  },
  'name': 'page-404'
};
exports.default = _default;
},{}],5:[function(require,module,exports){
const EventBus = require('eventbusjs')
const Turbolinks = require('turbolinks')
Turbolinks.start();




const riot = require('riot')
riot.install(function(component){
  
  component.onServerState = function (data) {
    component.update(data);
  }.bind(component);

  const onMounted = component.onMounted || function () {};
  const eventName = (component.id || component.name) + ':update'

  component.onMounted = function (props, state) {
    EventBus.removeEventListener(eventName, component.onServerState, component)
    EventBus.addEventListener(eventName, component.onServerState, component)
    return onMounted(props, state)
  }.bind(component);

})

const tags = [{name:'errors/404',module:require('./errors/404.riot')},{name:'index',module:require('./index.riot')},{name:'test',module:require('./test.riot')}]

document.addEventListener('turbolinks:load', ()=>{
  const STATE = JSON.parse(
    document.querySelector('meta[name="state"]').getAttribute('content')
  )
  tags.forEach((tag) => {
    const component = tag.module.default;
    if (component.exports) {
      component.exports.state = STATE[component.exports.id || component.name] || component.exports.state;
    }
    if (!riot.__.globals.COMPONENTS_IMPLEMENTATION_MAP.has(component.name)) {
      const rendered = document.querySelector('section[is]') 
      riot.register(component.name, component)
    }
  })

  const root = document.querySelector('section[is]')
  root.innerHTML = '';
  riot.mount(root)
});


},{"./errors/404.riot":4,"./index.riot":6,"./test.riot":7,"eventbusjs":1,"riot":2,"turbolinks":3}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _test = _interopRequireDefault(require("./test.riot"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  'css': null,
  'exports': {
    components: {
      Test: _test.default
    },

    onMounted(state, props) {
      console.log('index');
    }

  },
  'template': function (template, expressionTypes, bindingTypes, getComponent) {
    return template('<!----><test expr1></test><div><a href="/errors/404">asdasd</a></div>', [{
      'expressions': [{
        'type': expressionTypes.TEXT,
        'childNodeIndex': 0,
        'evaluate': function (scope) {
          return ['\n  ololo ', scope.state.text, '\n  '].join('');
        }
      }]
    }, {
      'type': bindingTypes.TAG,
      'getComponent': getComponent,
      'evaluate': function (scope) {
        return 'test';
      },
      'slots': [{
        'id': 'default',
        'html': '\n      sss\n  ',
        'bindings': []
      }],
      'attributes': [],
      'redundantAttribute': 'expr1',
      'selector': '[expr1]'
    }]);
  },
  'name': 'index-page'
};
exports.default = _default;
},{"./test.riot":7}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  'css': null,
  'exports': {
    onBeforeMount() {
      console.log('test 1');
    },

    fetch() {
      this.state = {
        text: 'test'
      };
    },

    onClick(ev) {
      alert(1);
      this.state = {
        text: 'test'
      };
      console.log(this);
      this.update();
    }

  },
  'template': function (template, expressionTypes, bindingTypes, getComponent) {
    return template('<!----><button expr0>\n    click\n  </button>', [{
      'expressions': [{
        'type': expressionTypes.TEXT,
        'childNodeIndex': 0,
        'evaluate': function (scope) {
          return ['\n  test ', scope.state.text, '\n  '].join('');
        }
      }]
    }, {
      'redundantAttribute': 'expr0',
      'selector': '[expr0]',
      'expressions': [{
        'type': expressionTypes.EVENT,
        'name': 'onclick',
        'evaluate': function (scope) {
          return scope.onClick;
        }
      }]
    }]);
  },
  'name': 'test'
};
exports.default = _default;
},{}]},{},[5]);
