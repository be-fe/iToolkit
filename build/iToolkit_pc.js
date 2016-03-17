/* Riot v2.2.1, @license MIT, (c) 2015 Muut Inc. + contributors */

;(function(window) {
  'use strict'
  var riot = { version: 'v2.2.1', settings: {} }

  // This globals 'const' helps code size reduction

  // for typeof == '' comparisons
  var T_STRING = 'string'
  var T_OBJECT = 'object'

  // for IE8 and rest of the world
  var isArray = Array.isArray || (function () {
    var _ts = Object.prototype.toString
    return function (v) { return _ts.call(v) === '[object Array]' }
  })()

  // Version# for IE 8-11, 0 for others
  var ieVersion = (function (win) {
    return (win && win.document || {}).documentMode | 0
  })(window)

riot.observable = function(el) {

  el = el || {}

  var callbacks = {},
      _id = 0

  el.on = function(events, fn) {
    if (isFunction(fn)) {
      fn._id = typeof fn._id == 'undefined' ? _id++ : fn._id

      events.replace(/\S+/g, function(name, pos) {
        (callbacks[name] = callbacks[name] || []).push(fn)
        fn.typed = pos > 0
      })
    }
    return el
  }

  el.off = function(events, fn) {
    if (events == '*') callbacks = {}
    else {
      events.replace(/\S+/g, function(name) {
        if (fn) {
          var arr = callbacks[name]
          for (var i = 0, cb; (cb = arr && arr[i]); ++i) {
            if (cb._id == fn._id) { arr.splice(i, 1); i-- }
          }
        } else {
          callbacks[name] = []
        }
      })
    }
    return el
  }

  // only single event supported
  el.one = function(name, fn) {
    function on() {
      el.off(name, on)
      fn.apply(el, arguments)
    }
    return el.on(name, on)
  }

  el.trigger = function(name) {
    var args = [].slice.call(arguments, 1),
        fns = callbacks[name] || []

    for (var i = 0, fn; (fn = fns[i]); ++i) {
      if (!fn.busy) {
        fn.busy = 1
        fn.apply(el, fn.typed ? [name].concat(args) : args)
        if (fns[i] !== fn) { i-- }
        fn.busy = 0
      }
    }

    if (callbacks.all && name != 'all') {
      el.trigger.apply(el, ['all', name].concat(args))
    }

    return el
  }

  return el

}
riot.mixin = (function() {
  var mixins = {}

  return function(name, mixin) {
    if (!mixin) return mixins[name]
    mixins[name] = mixin
  }

})()

;(function(riot, evt, window) {

  // browsers only
  if (!window) return

  var loc = window.location,
      fns = riot.observable(),
      win = window,
      started = false,
      current

  function hash() {
    return loc.href.split('#')[1] || ''
  }

  function parser(path) {
    return path.split('/')
  }

  function emit(path) {
    if (path.type) path = hash()

    if (path != current) {
      fns.trigger.apply(null, ['H'].concat(parser(path)))
      current = path
    }
  }

  var r = riot.route = function(arg) {
    // string
    if (arg[0]) {
      loc.hash = arg
      emit(arg)

    // function
    } else {
      fns.on('H', arg)
    }
  }

  r.exec = function(fn) {
    fn.apply(null, parser(hash()))
  }

  r.parser = function(fn) {
    parser = fn
  }

  r.stop = function () {
    if (!started) return
    win.removeEventListener ? win.removeEventListener(evt, emit, false) : win.detachEvent('on' + evt, emit)
    fns.off('*')
    started = false
  }

  r.start = function () {
    if (started) return
    win.addEventListener ? win.addEventListener(evt, emit, false) : win.attachEvent('on' + evt, emit)
    started = true
  }

  // autostart the router
  r.start()

})(riot, 'hashchange', window)
/*

//// How it works?


Three ways:

1. Expressions: tmpl('{ value }', data).
   Returns the result of evaluated expression as a raw object.

2. Templates: tmpl('Hi { name } { surname }', data).
   Returns a string with evaluated expressions.

3. Filters: tmpl('{ show: !done, highlight: active }', data).
   Returns a space separated list of trueish keys (mainly
   used for setting html classes), e.g. "show highlight".


// Template examples

tmpl('{ title || "Untitled" }', data)
tmpl('Results are { results ? "ready" : "loading" }', data)
tmpl('Today is { new Date() }', data)
tmpl('{ message.length > 140 && "Message is too long" }', data)
tmpl('This item got { Math.round(rating) } stars', data)
tmpl('<h1>{ title }</h1>{ body }', data)


// Falsy expressions in templates

In templates (as opposed to single expressions) all falsy values
except zero (undefined/null/false) will default to empty string:

tmpl('{ undefined } - { false } - { null } - { 0 }', {})
// will return: " - - - 0"

*/


var brackets = (function(orig) {

  var cachedBrackets,
      r,
      b,
      re = /[{}]/g

  return function(x) {

    // make sure we use the current setting
    var s = riot.settings.brackets || orig

    // recreate cached vars if needed
    if (cachedBrackets !== s) {
      cachedBrackets = s
      b = s.split(' ')
      r = b.map(function (e) { return e.replace(/(?=.)/g, '\\') })
    }

    // if regexp given, rewrite it with current brackets (only if differ from default)
    return x instanceof RegExp ? (
        s === orig ? x :
        new RegExp(x.source.replace(re, function(b) { return r[~~(b === '}')] }), x.global ? 'g' : '')
      ) :
      // else, get specific bracket
      b[x]
  }
})('{ }')


var tmpl = (function() {

  var cache = {},
      reVars = /(['"\/]).*?[^\\]\1|\.\w*|\w*:|\b(?:(?:new|typeof|in|instanceof) |(?:this|true|false|null|undefined)\b|function *\()|([a-z_$]\w*)/gi
              // [ 1               ][ 2  ][ 3 ][ 4                                                                                  ][ 5       ]
              // find variable names:
              // 1. skip quoted strings and regexps: "a b", 'a b', 'a \'b\'', /a b/
              // 2. skip object properties: .name
              // 3. skip object literals: name:
              // 4. skip javascript keywords
              // 5. match var name

  // build a template (or get it from cache), render with data
  return function(str, data) {
    return str && (cache[str] = cache[str] || tmpl(str))(data)
  }


  // create a template instance

  function tmpl(s, p) {

    // default template string to {}
    s = (s || (brackets(0) + brackets(1)))

      // temporarily convert \{ and \} to a non-character
      .replace(brackets(/\\{/g), '\uFFF0')
      .replace(brackets(/\\}/g), '\uFFF1')

    // split string to expression and non-expresion parts
    p = split(s, extract(s, brackets(/{/), brackets(/}/)))

    return new Function('d', 'return ' + (

      // is it a single expression or a template? i.e. {x} or <b>{x}</b>
      !p[0] && !p[2] && !p[3]

        // if expression, evaluate it
        ? expr(p[1])

        // if template, evaluate all expressions in it
        : '[' + p.map(function(s, i) {

            // is it an expression or a string (every second part is an expression)
          return i % 2

              // evaluate the expressions
              ? expr(s, true)

              // process string parts of the template:
              : '"' + s

                  // preserve new lines
                  .replace(/\n/g, '\\n')

                  // escape quotes
                  .replace(/"/g, '\\"')

                + '"'

        }).join(',') + '].join("")'
      )

      // bring escaped { and } back
      .replace(/\uFFF0/g, brackets(0))
      .replace(/\uFFF1/g, brackets(1))

    + ';')

  }


  // parse { ... } expression

  function expr(s, n) {
    s = s

      // convert new lines to spaces
      .replace(/\n/g, ' ')

      // trim whitespace, brackets, strip comments
      .replace(brackets(/^[{ ]+|[ }]+$|\/\*.+?\*\//g), '')

    // is it an object literal? i.e. { key : value }
    return /^\s*[\w- "']+ *:/.test(s)

      // if object literal, return trueish keys
      // e.g.: { show: isOpen(), done: item.done } -> "show done"
      ? '[' +

          // extract key:val pairs, ignoring any nested objects
          extract(s,

              // name part: name:, "name":, 'name':, name :
              /["' ]*[\w- ]+["' ]*:/,

              // expression part: everything upto a comma followed by a name (see above) or end of line
              /,(?=["' ]*[\w- ]+["' ]*:)|}|$/
              ).map(function(pair) {

                // get key, val parts
                return pair.replace(/^[ "']*(.+?)[ "']*: *(.+?),? *$/, function(_, k, v) {

                  // wrap all conditional parts to ignore errors
                  return v.replace(/[^&|=!><]+/g, wrap) + '?"' + k + '":"",'

                })

              }).join('')

        + '].join(" ").trim()'

      // if js expression, evaluate as javascript
      : wrap(s, n)

  }


  // execute js w/o breaking on errors or undefined vars

  function wrap(s, nonull) {
    s = s.trim()
    return !s ? '' : '(function(v){try{v='

        // prefix vars (name => data.name)
        + (s.replace(reVars, function(s, _, v) { return v ? '(d.'+v+'===undefined?'+(typeof window == 'undefined' ? 'global.' : 'window.')+v+':d.'+v+')' : s })

          // break the expression if its empty (resulting in undefined value)
          || 'x')
      + '}catch(e){'
      + '}finally{return '

        // default to empty string for falsy values except zero
        + (nonull === true ? '!v&&v!==0?"":v' : 'v')

      + '}}).call(d)'
  }


  // split string by an array of substrings

  function split(str, substrings) {
    var parts = []
    substrings.map(function(sub, i) {

      // push matched expression and part before it
      i = str.indexOf(sub)
      parts.push(str.slice(0, i), sub)
      str = str.slice(i + sub.length)
    })

    // push the remaining part
    return parts.concat(str)
  }


  // match strings between opening and closing regexp, skipping any inner/nested matches

  function extract(str, open, close) {

    var start,
        level = 0,
        matches = [],
        re = new RegExp('('+open.source+')|('+close.source+')', 'g')

    str.replace(re, function(_, open, close, pos) {

      // if outer inner bracket, mark position
      if (!level && open) start = pos

      // in(de)crease bracket level
      level += open ? 1 : -1

      // if outer closing bracket, grab the match
      if (!level && close != null) matches.push(str.slice(start, pos+close.length))

    })

    return matches
  }

})()

// { key, i in items} -> { key, i, items }
function loopKeys(expr) {
  var b0 = brackets(0),
      els = expr.slice(b0.length).match(/\s*(\S+?)\s*(?:,\s*(\S)+)?\s+in\s+(.+)/)
  return els ? { key: els[1], pos: els[2], val: b0 + els[3] } : { val: expr }
}

function mkitem(expr, key, val) {
  var item = {}
  item[expr.key] = key
  if (expr.pos) item[expr.pos] = val
  return item
}


/* Beware: heavy stuff */
function _each(dom, parent, expr) {

  remAttr(dom, 'each')

  var template = dom.outerHTML,
      root = dom.parentNode,
      placeholder = document.createComment('riot placeholder'),
      tags = [],
      child = getTag(dom),
      checksum

  // console.log(expr);
  root.insertBefore(placeholder, dom)

  expr = loopKeys(expr)

  // clean template code
  parent
    .one('premount', function () {
      if (root.stub) root = parent.root
      // remove the original DOM node
      dom.parentNode.removeChild(dom)
    })
    .on('update', function () {
      var items = tmpl(expr.val, parent),
          test

      // object loop. any changes cause full redraw
      if (!isArray(items)) {
        test = checksum
        checksum = items ? JSON.stringify(items) : ''
        if (checksum === test) return

        items = !items ? [] :
          Object.keys(items).map(function (key) {
            return mkitem(expr, key, items[key])
          })
      }
      // console.log(items);
      var frag = document.createDocumentFragment(),
          i = tags.length,
          j = items.length

      // unmount leftover items
      while (i > j) tags[--i].unmount()
      tags.length = j

      test = !checksum && !!expr.key
      for (i = 0; i < j; ++i) {
        var _item = test ? mkitem(expr, items[i], i) : items[i]

        if (!tags[i]) {
          // mount new
          (tags[i] = new Tag({ tmpl: template }, {
              parent: parent,
              isLoop: true,
              root: root,
              item: _item
            })
          ).mount()

          frag.appendChild(tags[i].root)
        }
        
        tags[i]._item = _item
        tags[i].update(_item)
      }

      root.insertBefore(frag, placeholder)

      if (child) parent.tags[getTagName(dom)] = tags

    }).one('updated', function() {
      var keys = Object.keys(parent)// only set new values
      walk(root, function(node) {
        // only set element node and not isLoop
        if (node.nodeType == 1 && !node.isLoop && !node._looped) {
          node._visited = false // reset _visited for loop node
          node._looped = true // avoid set multiple each
          setNamed(node, parent, keys)
        }
      })
    })

}


function parseNamedElements(root, parent, childTags) {

  walk(root, function(dom) {
    if (dom.nodeType == 1) {
      dom.isLoop = (dom.parentNode && dom.parentNode.isLoop || dom.getAttribute('each')) ? 1 : 0

      // custom child tag
      var child = getTag(dom)

      if (child && !dom.isLoop) {
        var tag = new Tag(child, { root: dom, parent: parent }, dom.innerHTML),
            tagName = getTagName(dom),
            ptag = parent,
            cachedTag

        while (!getTag(ptag.root)) {
          if (!ptag.parent) break
          ptag = ptag.parent
        }

        // fix for the parent attribute in the looped elements
        tag.parent = ptag

        cachedTag = ptag.tags[tagName]

        // if there are multiple children tags having the same name
        if (cachedTag) {
          // if the parent tags property is not yet an array
          // create it adding the first cached tag
          if (!isArray(cachedTag))
            ptag.tags[tagName] = [cachedTag]
          // add the new nested tag to the array
          ptag.tags[tagName].push(tag)
        } else {
          ptag.tags[tagName] = tag
        }

        // empty the child node once we got its template
        // to avoid that its children get compiled multiple times
        dom.innerHTML = ''
        childTags.push(tag)
      }

      if (!dom.isLoop)
        setNamed(dom, parent, [])
    }

  })

}

function parseExpressions(root, tag, expressions) {

  function addExpr(dom, val, extra) {
    if (val.indexOf(brackets(0)) >= 0) {
      var expr = { dom: dom, expr: val }
      expressions.push(extend(expr, extra))
    }
  }

  walk(root, function(dom) {
    var type = dom.nodeType

    // text node
    if (type == 3 && dom.parentNode.tagName != 'STYLE') addExpr(dom, dom.nodeValue)
    if (type != 1) return

    /* element */

    // loop
    var attr = dom.getAttribute('each')

    if (attr && attr.match(/\{[\s\S]+\}/)) { _each(dom, tag, attr); return false }

    // attribute expressions
    each(dom.attributes, function(attr) {
      var name = attr.name,
        bool = name.split('__')[1]

      addExpr(dom, attr.value, { attr: bool || name, bool: bool })
      if (bool) { remAttr(dom, name); return false }

    })

    // skip custom tags
    if (getTag(dom)) return false

  })

}
function Tag(impl, conf, innerHTML) {

  var self = riot.observable(this),
      opts = inherit(conf.opts) || {},
      dom = mkdom(impl.tmpl),
      parent = conf.parent,
      isLoop = conf.isLoop,
      item = conf.item,
      expressions = [],
      childTags = [],
      root = conf.root,
      fn = impl.fn,
      tagName = root.tagName.toLowerCase(),
      attr = {},
      loopDom,
      TAG_ATTRIBUTES = /([\w\-]+)\s?=\s?['"]([^'"]+)["']/gim


  if (fn && root._tag) {
    root._tag.unmount(true)
  }

  // not yet mounted
  this.isMounted = false

  if (impl.attrs) {
    var attrs = impl.attrs.match(TAG_ATTRIBUTES)

    each(attrs, function(a) {
      var kv = a.split(/\s?=\s?/)
      root.setAttribute(kv[0], kv[1].replace(/['"]/g, ''))
    })

  }

  // keep a reference to the tag just created
  // so we will be able to mount this tag multiple times
  root._tag = this

  // create a unique id to this tag
  // it could be handy to use it also to improve the virtual dom rendering speed
  this._id = fastAbs(~~(new Date().getTime() * Math.random()))

  extend(this, { parent: parent, root: root, opts: opts, tags: {} }, item)

  // grab attributes
  each(root.attributes, function(el) {
    var val = el.value
    // remember attributes with expressions only
    if (brackets(/\{.*\}/).test(val)) attr[el.name] = val
  })

  if (dom.innerHTML && !/select|select|optgroup|tbody|tr/.test(tagName)) {
    // replace all the yield tags with the tag inner html
    if (root.tagName !== 'TABLE-VIEW') {
      // console.log(dom.innerHTML);
      // console.log(innerHTML);
    }
    dom.innerHTML = replaceYield(dom.innerHTML, innerHTML)
    
  }

  // options
  function updateOpts() {
    // update opts from current DOM attributes
    each(root.attributes, function(el) {
      opts[el.name] = tmpl(el.value, parent || self)
    })
    // recover those with expressions
    each(Object.keys(attr), function(name) {
      opts[name] = tmpl(attr[name], parent || self)
    })
  }

  this.update = function(data) {
    extend(self, data)
    updateOpts()
    self.trigger('update', data)
    update(expressions, self, data)
    self.trigger('updated')
  }

  this.mixin = function() {
    each(arguments, function(mix) {
      mix = typeof mix == 'string' ? riot.mixin(mix) : mix
      each(Object.keys(mix), function(key) {
        // bind methods to self
        if (key != 'init')
          self[key] = typeof mix[key] == 'function' ? mix[key].bind(self) : mix[key]
      })
      // init method will be called automatically
      if (mix.init) mix.init.bind(self)()
    })
  }

  this.mount = function() {

    updateOpts()

    // initialiation
    fn && fn.call(self, opts)

    toggle(true)


    // parse layout after init. fn may calculate args for nested custom tags
    parseExpressions(dom, self, expressions)

    if (!self.parent) self.update()

    // internal use only, fixes #403
    self.trigger('premount')
    if (isLoop) {
      // update the root attribute for the looped elements
      self.root = root = loopDom = dom.firstChild
    } else {
      while (dom.firstChild) root.appendChild(dom.firstChild)
      if (root.stub) self.root = root = parent.root
    }
    // if it's not a child tag we can trigger its mount event
    if (!self.parent || self.parent.isMounted) {
      self.isMounted = true
      self.trigger('mount')
    }
    // otherwise we need to wait that the parent event gets triggered
    else self.parent.one('mount', function() {
      // avoid to trigger the `mount` event for the tags
      // not visible included in an if statement
      if (!isInStub(self.root)) {
        self.parent.isMounted = self.isMounted = true
        self.trigger('mount')
      }
    })
  }


  this.unmount = function(keepRootTag) {
    var el = loopDom || root,
        p = el.parentNode

    if (p) {

      if (parent) {
        // remove this tag from the parent tags object
        // if there are multiple nested tags with same name..
        // remove this element form the array
        if (isArray(parent.tags[tagName])) {
          each(parent.tags[tagName], function(tag, i) {
            if (tag._id == self._id)
              parent.tags[tagName].splice(i, 1)
          })
        } else
          // otherwise just delete the tag instance
          parent.tags[tagName] = undefined
      } else {
        while (el.firstChild) el.removeChild(el.firstChild)
      }

      if (!keepRootTag)
        p.removeChild(el)

    }


    self.trigger('unmount')
    toggle()
    self.off('*')
    // somehow ie8 does not like `delete root._tag`
    root._tag = null

  }

  function toggle(isMount) {

    // mount/unmount children
    each(childTags, function(child) { child[isMount ? 'mount' : 'unmount']() })

    // listen/unlisten parent (events flow one way from parent to children)
    if (parent) {
      var evt = isMount ? 'on' : 'off'

      // the loop tags will be always in sync with the parent automatically
      if (isLoop)
        parent[evt]('unmount', self.unmount)
      else
        parent[evt]('update', self.update)[evt]('unmount', self.unmount)
    }
  }

  // named elements available for fn
  parseNamedElements(dom, this, childTags)


}

function setEventHandler(name, handler, dom, tag, item) {

  dom[name] = function(e) {

    // cross browser event fix
    e = e || window.event

    if (!e.which) e.which = e.charCode || e.keyCode
    if (!e.target) e.target = e.srcElement

    // ignore error on some browsers
    try {
      e.currentTarget = dom
    } catch (ignored) { '' }

    e.item = tag._item ? tag._item : item

    // prevent default behaviour (by default)
    if (handler.call(tag, e) !== true && !/radio|check/.test(dom.type)) {
      e.preventDefault && e.preventDefault()
      e.returnValue = false
    }

    if (!e.preventUpdate) {
      var el = item ? tag.parent : tag
      el.update()
    }

  }

}

// used by if- attribute
function insertTo(root, node, before) {
  if (root) {
    root.insertBefore(before, node)
    root.removeChild(node)
  }
}

// item = currently looped item
function update(expressions, tag, item) {

  each(expressions, function(expr, i) {

    var dom = expr.dom,
        attrName = expr.attr,
        value = tmpl(expr.expr, tag),
        parent = expr.dom.parentNode

    if (value == null) value = ''

    // leave out riot- prefixes from strings inside textarea
    if (parent && parent.tagName == 'TEXTAREA') value = value.replace(/riot-/g, '')

    // no change
    if (expr.value === value) return
    expr.value = value

    // text node
    if (!attrName) return dom.nodeValue = value.toString()

    // remove original attribute
    remAttr(dom, attrName)

    // event handler
    if (typeof value == 'function') {
      setEventHandler(attrName, value, dom, tag, item)

    // if- conditional
    } else if (attrName == 'if') {
      var stub = expr.stub

      // add to DOM
      if (value) {
        if (stub) {
          insertTo(stub.parentNode, stub, dom)
          dom.inStub = false
          // avoid to trigger the mount event if the tags is not visible yet
          // maybe we can optimize this avoiding to mount the tag at all
          if (!isInStub(dom)) {
            walk(dom, function(el) {
              if (el._tag && !el._tag.isMounted) el._tag.isMounted = !!el._tag.trigger('mount')
            })
          }
        }
      // remove from DOM
      } else {
        stub = expr.stub = stub || document.createTextNode('')
        insertTo(dom.parentNode, dom, stub)
        dom.inStub = true
      }
    // show / hide
    } else if (/^(show|hide)$/.test(attrName)) {
      if (attrName == 'hide') value = !value
      dom.style.display = value ? '' : 'none'

    // field value
    } else if (attrName == 'value') {
      dom.value = value

    // <img src="{ expr }">
    } else if (attrName.slice(0, 5) == 'riot-' && attrName != 'riot-tag') {
      attrName = attrName.slice(5)
      value ? dom.setAttribute(attrName, value) : remAttr(dom, attrName)

    } else {
      if (expr.bool) {
        dom[attrName] = value
        if (!value) return
        value = attrName
      }

      if (typeof value != 'object') dom.setAttribute(attrName, value)

    }

  })

}

function each(els, fn) {
  for (var i = 0, len = (els || []).length, el; i < len; i++) {
    el = els[i]
    // return false -> remove current item during loop
    if (el != null && fn(el, i) === false) i--
  }
  return els
}

function isFunction(v) {
  return typeof v === 'function' || false   // avoid IE problems
}

function remAttr(dom, name) {
  dom.removeAttribute(name)
}

function fastAbs(nr) {
  return (nr ^ (nr >> 31)) - (nr >> 31)
}

function getTagName(dom) {
  var child = getTag(dom),
    namedTag = dom.getAttribute('name'),
    tagName = namedTag && namedTag.indexOf(brackets(0)) < 0 ? namedTag : child.name

  return tagName
}

function extend(src) {
  var obj, args = arguments
  for (var i = 1; i < args.length; ++i) {
    if ((obj = args[i])) {
      for (var key in obj) {      // eslint-disable-line guard-for-in
        src[key] = obj[key]
      }
    }
  }
  return src
}

function mkdom(template) {
  var checkie = ieVersion && ieVersion < 10,
      matches = /^\s*<([\w-]+)/.exec(template),
      tagName = matches ? matches[1].toLowerCase() : '',
      rootTag = (tagName === 'th' || tagName === 'td') ? 'tr' :
                (tagName === 'tr' ? 'tbody' : 'div'),
      el = mkEl(rootTag)

  el.stub = true

  if (checkie) {
    if (tagName === 'optgroup')
      optgroupInnerHTML(el, template)
    else if (tagName === 'option')
      optionInnerHTML(el, template)
    else if (rootTag !== 'div')
      tbodyInnerHTML(el, template, tagName)
    else
      checkie = 0
  }
  if (!checkie) el.innerHTML = template

  return el
}

function walk(dom, fn) {
  if (dom) {
    if (fn(dom) === false) walk(dom.nextSibling, fn)
    else {
      dom = dom.firstChild

      while (dom) {
        walk(dom, fn)
        dom = dom.nextSibling
      }
    }
  }
}

function isInStub(dom) {
  while (dom) {
    if (dom.inStub) return true
    dom = dom.parentNode
  }
  return false
}

function mkEl(name) {
  return document.createElement(name)
}

function replaceYield (tmpl, innerHTML) {
  return tmpl.replace(/<(yield)\/?>(<\/\1>)?/gim, innerHTML || '')
}

function $$(selector, ctx) {
  return (ctx || document).querySelectorAll(selector)
}

function inherit(parent) {
  function Child() {}
  Child.prototype = parent
  return new Child()
}

function setNamed(dom, parent, keys) {
  each(dom.attributes, function(attr) {
    if (dom._visited) return
    if (attr.name === 'id' || attr.name === 'name') {
      dom._visited = true
      var p, v = attr.value
      if (~keys.indexOf(v)) return

      p = parent[v]
      if (!p)
        parent[v] = dom
      else
        isArray(p) ? p.push(dom) : (parent[v] = [p, dom])
    }
  })
}
/**
 *
 * Hacks needed for the old internet explorer versions [lower than IE10]
 *
 */

function tbodyInnerHTML(el, html, tagName) {
  var div = mkEl('div'),
      loops = /td|th/.test(tagName) ? 3 : 2,
      child

  div.innerHTML = '<table>' + html + '</table>'
  child = div.firstChild

  while (loops--) {
    child = child.firstChild
  }

  el.appendChild(child)

}

function optionInnerHTML(el, html) {
  var opt = mkEl('option'),
      valRegx = /value=[\"'](.+?)[\"']/,
      selRegx = /selected=[\"'](.+?)[\"']/,
      eachRegx = /each=[\"'](.+?)[\"']/,
      ifRegx = /if=[\"'](.+?)[\"']/,
      innerRegx = />([^<]*)</,
      valuesMatch = html.match(valRegx),
      selectedMatch = html.match(selRegx),
      innerValue = html.match(innerRegx),
      eachMatch = html.match(eachRegx),
      ifMatch = html.match(ifRegx)

  if (innerValue) {
    opt.innerHTML = innerValue[1]
  } else {
    opt.innerHTML = html
  }

  if (valuesMatch) {
    opt.value = valuesMatch[1]
  }

  if (selectedMatch) {
    opt.setAttribute('riot-selected', selectedMatch[1])
  }

  if (eachMatch) {
    opt.setAttribute('each', eachMatch[1])
  }

  if (ifMatch) {
    opt.setAttribute('if', ifMatch[1])
  }

  el.appendChild(opt)
}

function optgroupInnerHTML(el, html) {
  var opt = mkEl('optgroup'),
      labelRegx = /label=[\"'](.+?)[\"']/,
      elementRegx = /^<([^>]*)>/,
      tagRegx = /^<([^ \>]*)/,
      labelMatch = html.match(labelRegx),
      elementMatch = html.match(elementRegx),
      tagMatch = html.match(tagRegx),
      innerContent = html

  if (elementMatch) {
    var options = html.slice(elementMatch[1].length+2, -tagMatch[1].length-3).trim()
    innerContent = options
  }

  if (labelMatch) {
    opt.setAttribute('riot-label', labelMatch[1])
  }

  if (innerContent) {
    var innerOpt = mkEl('div')

    optionInnerHTML(innerOpt, innerContent)

    opt.appendChild(innerOpt.firstChild)
  }

  el.appendChild(opt)
}

/*
 Virtual dom is an array of custom tags on the document.
 Updates and unmounts propagate downwards from parent to children.
*/

var virtualDom = [],
    tagImpl = {},
    styleNode

var RIOT_TAG = 'riot-tag'

function getTag(dom) {
  return tagImpl[dom.getAttribute(RIOT_TAG) || dom.tagName.toLowerCase()]
}

function injectStyle(css) {

  styleNode = styleNode || mkEl('style')

  if (!document.head) return

  if (styleNode.styleSheet)
    styleNode.styleSheet.cssText += css
  else
    styleNode.innerHTML += css

  if (!styleNode._rendered)
    if (styleNode.styleSheet) {
      document.body.appendChild(styleNode)
    } else {
      var rs = $$('style[type=riot]')[0]
      if (rs) {
        rs.parentNode.insertBefore(styleNode, rs)
        rs.parentNode.removeChild(rs)
      } else {
        document.head.appendChild(styleNode)
      }
    }

  styleNode._rendered = true

}

function mountTo(root, tagName, opts) {
  var tag = tagImpl[tagName],
      // cache the inner HTML to fix #855
      innerHTML = root._innerHTML = root._innerHTML || root.innerHTML
  // clear the inner html
  root.innerHTML = ''
    //console.log(innerHTML);
  if (tag && root) tag = new Tag(tag, { root: root, opts: opts }, innerHTML)

  if (tag && tag.mount) {
    tag.mount()
    virtualDom.push(tag)
    return tag.on('unmount', function() {
      virtualDom.splice(virtualDom.indexOf(tag), 1)
    })
  }

}

riot.tag = function(name, html, css, attrs, fn) {
  if (isFunction(attrs)) {
    fn = attrs
    if (/^[\w\-]+\s?=/.test(css)) {
      attrs = css
      css = ''
    } else attrs = ''
  }
  if (css) {
    if (isFunction(css)) fn = css
    else injectStyle(css)
  }
  tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn }
  return name
}

riot.mount = function(selector, tagName, opts) {
  var els,
      allTags,
      tags = []

  // helper functions

  function addRiotTags(arr) {
    var list = ''
    each(arr, function (e) {
      list += ', *[riot-tag="'+ e.trim() + '"]'
    })
    return list
  }

  function selectAllTags() {
    var keys = Object.keys(tagImpl)
    return keys + addRiotTags(keys)
  }

  function pushTags(root) {
    if (root.tagName) {
      if (tagName && !root.getAttribute(RIOT_TAG))
        root.setAttribute(RIOT_TAG, tagName)

      var tag = mountTo(root,
        tagName || root.getAttribute(RIOT_TAG) || root.tagName.toLowerCase(), opts)

      if (tag) tags.push(tag)
    }
    else if (root.length) {
      each(root, pushTags)   // assume nodeList
    }
  }

  // ----- mount code -----

  if (typeof tagName === T_OBJECT) {
    opts = tagName
    tagName = 0
  }

  // crawl the DOM to find the tag
  if (typeof selector === T_STRING) {
    if (selector === '*') {
      // select all the tags registered
      // and also the tags found with the riot-tag attribute set
      selector = allTags = selectAllTags()
    } else {
      // or just the ones named like the selector
      selector += addRiotTags(selector.split(','))
    }
    els = $$(selector)
  }
  else
    // probably you have passed already a tag or a NodeList
    els = selector

  // select all the registered and mount them inside their root elements
  if (tagName === '*') {
    // get all custom tags
    tagName = allTags || selectAllTags()
    // if the root els it's just a single tag
    if (els.tagName) {
      els = $$(tagName, els)
    } else {
      // select all the children for all the different root elements
      var nodeList = []
      each(els, function (_el) {
        nodeList.push($$(tagName, _el))
      })
      els = nodeList
    }
    // get rid of the tagName
    tagName = 0
  }
  if (els.tagName)
    pushTags(els)
  else
    each(els, pushTags)

  return tags
}

// update everything
riot.update = function() {
  return each(virtualDom, function(tag) {
    tag.update()
  })
}

// @deprecated
riot.mountTo = riot.mount


  // share methods for other riot parts, e.g. compiler
  riot.util = { brackets: brackets, tmpl: tmpl }

  // support CommonJS, AMD & browser
  if (typeof exports === 'object')
    module.exports = riot
  else if (typeof define === 'function' && define.amd)
    define(function() { return riot })
  else
    window.riot = riot

})(typeof window != 'undefined' ? window : undefined);
/*
 * Utils 函数
 */
var utils = {
    httpGet: function(url, params, callback, complete) {
        var xmlhttp = new XMLHttpRequest();
        var url = utils.concatParams(url, params);
        xmlhttp.open("GET", url, true);
        xmlhttp.send(null);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4) {
                if (complete && typeof complete === 'function') {
                    complete();
                }
                if (xmlhttp.status === 200) {
                    var body = xmlhttp.responseText;
                    try {
                        if (typeof body === 'string') {
                            var data = JSON.parse(body);
                        }
                        else {
                            var data = body;
                        }
                    }
                    catch(e) {
                        alert('解析错误');
                    }
                    callback(data);
                }
            }
        }
    },

    httpPost: function(url, params, callback, complete) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Content-type", "application/json");
        xmlhttp.send(params);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4) { 
                if (complete && typeof complete === 'function') {
                    complete();
                }
                if (xmlhttp.status === 200) {
                    try {
                        var data = JSON.parse(xmlhttp.responseText)
                    }
                    catch(e) {
                        console.log('解析错误');
                    }
                    callback(data);
                }
                else {
                    console.log('网络错误');
                }
            } 
        };
    },

    jsonp: function (url, params, callback) {
        var now = Date.now();
        var script = document.createElement('script');
        var head = document.getElementsByTagName('head')[0];
        var url = utils.concatParams(url, params);
        if (!params.callback) {
            if (url.match(/\?/)) {
                var src = url + '&callback=jsonpCallback' + now;
            }
            else {
                var src = url + '?callback=jsonpCallback' + now;
            }
            var funcName = 'jsonpCallback' + now;
        }
        else {
            var src = url;
            var funcName = params.callback;
        }
        script.src = src;
        head.appendChild(script);
        window[funcName] = function(data) {
            if (typeof data === 'string') {
                try {
                    data = JSON.parse(data);
                }
                catch(e) {}
            }
            callback(data);
        }
        script.onerror = function() {
            console.log('jsonp error');
        };
        script.onload = function() {
            head.removeChild(script);
        }
    },

    htmlEncode: function(value){
        var div = document.createElement('div');
        div.innerHTML = value; 
        return div.innerText;
    },

    concatParams: function(url, params) {
        if (url.match(/\?/)) {
            var str = '&'
        }
        else {
            var str = '?'
        }
        for(i in params) {
            str = str + i + '=' + params[i] + '&';
        }
        str = str.replace(/&$/, '');
        return url + str;
    },

    setCookie: function(key, value, expires, path) {
        var exp = new Date();
        var path = path || '/';
        exp.setTime(exp.getTime() + expires);
        document.cookie = key + "=" + escape (value) + ";path=" + path + ";expires=" + exp.toGMTString();
    },

    transBytes: function(bytes) {
        var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return 'n/a';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        if (i == 0) return bytes + sizes[i]; 
        return (bytes / Math.pow(1024, i)).toFixed(1) + sizes[i];
    },

    transTimes: function(timeStamp) {
        var timeStamp = parseInt(timeStamp, 10);
        var time = new Date(timeStamp * 1000)
        var now = new Date().getTime()/1000;
        var dv = now - timeStamp;
        if ( dv < 86400) {
            return time.getHours() + ':' + time.getMinutes();
        }
        else if ( dv > 86400 && dv < 172800) {
            return '昨天';
        }
        else if ( dv > 172800) {
            var Y = (time.getFullYear() + '-').substring(2);
            var M = (time.getMonth()+1 < 10 ? '0' + (time.getMonth()+1) : time.getMonth()+1) + '-';
            var D = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
            return Y + M + D;
        }
    },

    hasClass: function (obj, cls) {
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    },

    addClass: function (obj, cls) {
        obj.className.trim();
        if (!this.hasClass(obj, cls)) obj.className += " " + cls;
    },

    removeClass: function (obj, cls) {
        if (utils.hasClass(obj, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ');
        }
    },

    toggleClass: function(obj, cls) {
        if (utils.hasClass(obj, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ');
        } 
        else {
            obj.className += " " + cls;
        }
    },

    insertAfter: function(newElement, targetElement){
        var parent = targetElement.parentNode;
        if (parent.lastChild == targetElement) {
            parent.appendChild(newElement);
        }
        else {
            parent.insertBefore(newElement, targetElement.nextSibling);
        }
    },

    insertAfterText: function(newElement, targetElement) {
        var parent = targetElement.parentNode;
        if (parent.lastChild == targetElement) {
            parent.appendChild(newElement);
        }
        else {
            var next = targetElement.nextSibling;
            if (next.nodeType === 3) {
                next = next.nextSibling;
            }
            parent.insertBefore(newElement, next);
        }
    },

    isType: function (type) {
        return function (obj) {
            return toString.call(obj) === '[object ' + type + ']';
        }
    },

    makeArray: function () {
        return Array.prototype.concat(obj);
    },

    extend: function(src, obj) {
        for (var key in obj) {
            if (!src[key]) {
                src[key] = obj[key];
            }
        }
    }
};

utils.extend(utils, {
    isArray: utils.isType('Array'),
    isObject: utils.isType('Object'),
    isFunction: utils.isType('Function'),
    isElement: function (obj) {
        return toString.call(obj).indexOf('Element') !== -1;
    },
});

utils.extend(utils, {
    jsLoader: (function () {
        var HEAD_NODE = document.head || document.getElementsByTagName('head')[0];
        var cache = {};
        var _cid = 0;
        var tasks = [];
        var isArray = utils.isArray;
        var isFunction = utils.isFunction;
        var makeArray = utils.makeArray;
        var DONE = 'done';
        var INPROCESS = 'inprocess';
        var REJECTED = 'rejected';
        var PENDING = 'pending';
        var processCache = {};

        /**
         * 产生客户端id
         * @return {Number} [description]
         */
        function cid() {
            return _cid++;
        }

        function isCSS(css) {
            return css.match(/\.css\??/);
        }

        /**
         * Script对象，储存需要加载的脚本的基本信息
         * @param {String} uri 地址
         */
        function Script(uri) {
            this.uri = uri;
            this.cid = cid();
            this.status = PENDING;
        }

        /**
         * 从缓存中获取需要的Script对象
         * @param  {String} uri [description]
         * @return {Object}     需要的Script对象
         */
        Script.get = function (uri) {
            // 如果不存在于缓存中，创建一个新的Script对象
            return cache[uri] || (cache[uri] = new Script(uri));
        };

        /**
         * 当加载完成或失败时调用的处理函数
         * @param  {Object} js Script对象
         * @return {[type]}    [description]
         */
        Script.resolve = function (js) {
            var self = this;
            self.status++;
            if (js && js.status === REJECTED) {
                var error = Error('Source: ' + js.uri + ' load failed');
                reject(error);
            }
            if (self.status === self.task.length) {
                setTimeout(function () {
                    self.callback && self.callback();
                    self = null;
                    resolve(tasks.shift());
                }, 7);
            }
        };

        /**
         * jsLoader
         * @param  {[type]}   js       function or string or array
         * @param  {Function} callback 加载完成后的回调
         * @return {Function}          
         */
        function jsLoader(js, callback) {
            jsLoader.then(js, callback).start();
            return jsLoader;
        }

        /**
         * then方法用于向任务列表增加任务
         * @param  {[type]}   js       function or string or array
         * @param  {Function} callback [description]
         * @return {Function}          [description]
         */
        jsLoader.then = function (js, callback) {
            if (!js) {
                return jsLoader;
            }
            if (!isArray(js)) {
                js = makeArray(js);
            }
            var resolver = {
                task: [],
                callback: callback,
                status: 0
            };
            for (var i = 0; i < js.length; i++) {
                resolver.task.push(getCache(js[i]));
            }
            tasks.push(resolver);
            // jsLoader.resolve();
            return jsLoader;
        };

        /**
         * [reject description]
         * @param  {Object} e Object Error
         * @return {[type]}   [description]
         */
        function reject(e) {
            throw e;
        }

        /**
         * 执行任务序列中的任务
         * @param  {Object} resolver [description]
         * @return {[type]}          [description]
         */
        function resolve(resolver) {
            if (!resolver) {
                if (!tasks.length) {
                    return;
                }
            }
            for (var i = 0; i < resolver.task.length; i++) {
                var js = resolver.task[i];
                request(js, resolver);
            }
        }

        /**
         * 开始
         * @return {[type]} [description]
         */
        jsLoader.start = function () {
            resolve(tasks.shift());
            return jsLoader;
        }

        function loadStyles(script, resolver) {
            var node = document.createElement('link');
            node.type = 'text/css';
            node.rel = 'stylesheet';
            node.href = script.uri;
            HEAD_NODE.appendChild(node);
            node = null;
            script.status = DONE;
            Script.resolve.call(resolver);
        }

        /**
         * [request description]
         * @param  {[type]} js       [description]
         * @param  {[type]} resolver [description]
         * @return {[type]}          [description]
         */
        function request(js, resolver) {
            if (isFunction(js.uri)) {
                try {
                    js.uri();
                    js.status = DONE;
                    Script.resolve.call(resolver);
                }
                catch (e) {
                    js.status = REJECTED;
                    Script.resolve.call(resolver);
                }
                return;
            }
            if (js.status === DONE) {
                Script.resolve.call(resolver);
                return;
            }
            if (isCSS(js.uri)) {
                loadStyles(js, resolver);
                return;
            }
            if (js.status === INPROCESS) {
                // 在loading过程中，标记遇到的resolver
                js.changeStatus = true;
                processCache[js.cid] = processCache[js.cid] || [];
                processCache[js.cid].push({js:js, resolver:resolver});
                return;
            }
            js.status = INPROCESS;
            var node = document.createElement('script');
            node.async = true;
            node.src = js.uri;
            node.onload = node.onerror = onloadResolve;
            HEAD_NODE.appendChild(node);

            function onloadResolve(evt) {
                if (evt.type === 'error') {
                    js.status = REJECTED;
                }
                if (evt.type === 'load') {
                    js.status = DONE;
                }
                Script.resolve.call(resolver, js);
                if (js.changeStatus) {
                    // 如果加载完成，处理处在waiting状态下的任务
                    js.changeStatus = false;
                    for (var i = 0; i < processCache[js.cid].length; i++) {
                        var tmp = processCache[js.cid][i];
                        Script.resolve.call(tmp.resolver, tmp.js);
                    }
                    processCache[js.cid] = null;
                }
                node.onload = node.onerror = null;
                HEAD_NODE.removeChild(node);
                node = null;
            }
        }

        /**
         * 获取可能存在别名的Script对象
         * @param  {String} uri [description]
         * @return {Object}     Script Object
         */
        function getCache(uri) {
            var src = getAlias(uri);
            return  src ? Script.get(src) : Script.get(uri);
        }

        /**
         * 获取真实地址
         * @param  {String} str [description]
         * @return {[type]}     [description]
         */
        function getAlias(str) {
            return jsLoader.alias[str];
        }

        jsLoader.alias = {};

        return jsLoader;

    })()
});

/*
 * 全局事件监控
 */
var EventCtrl = EC = riot.observable();

/*
 * 外部方法传入
 */
var iToolkit = {};
iToolkit.methodRegister = function (name, fn) {
    for (var i in iToolkit) {
        if (name === i) {
            return;
        }
    }
    iToolkit[name] = fn;
};
iToolkit.tableExtend = {};

riot.tag('date-picker', '<yield>', function(opts) {
    var self = this;
    var EL = self.root;
    var config = self.opts.opts || self.opts;

    var js = document.scripts;

    var path = '';

    var jsPath = '';

    if (!config.path) {
        for (var i = 0; i < js.length; i++) {
            if (!js[i].src) {
                continue;
            }
            if (/iToolkit_pc.min.js|iToolkit_pc.js/.test(js[i].src)) {
                jsPath = js[i].src.replace(/iToolkit_pc.min.js|iToolkit_pc.js/, '');
                break;
            }
        }
        path = jsPath + 'plugins/laydate/';
    }
    else {
        path = config.path;
    }

    var theme = config.theme ? config.theme : 'default';

    utils.jsLoader([
        path + 'laydate.min.js',
        path + '/need/' + 'laydate.css',
        path + '/skins/' + theme + '/laydate.css'
    ], function () {
        for (var i = 0; i < EL.children.length; i++) {
            var child = EL.children[i];
            if (child.attributes['pTrigger']) {
                self.pTrigger = child;
            }
            if (child.attributes['media']) {
                self.media = child;
            }
        }
        self.resolve();
        self.update();
    });

    this.resolve = function() {
        if (self.pTrigger || self.media) {
            if (self.pTrigger === self.media) {
                config.elem = config.pTrigger = self.media;
            }
            if (typeof self.pTrigger === 'undefined') {
                config.elem = self.media;
            }
            if (
                self.pTrigger
                && self.media
                && (self.pTrigger !== self.media)
            ) {
                config.pTrigger = self.pTrigger;
                config.elem = self.media;
            }
            if (self.pTrigger && !self.media) {
                config.elem = self.pTrigger;
                config.justChoose = true;
            }
        }
        else {
            throw 'media and pTrigger property was not found in the element';
        }

        if (config.pTrigger) {
            config.pTrigger.onclick = function (e) {
                laydate(config);
            }
            return;
        }
        laydate(config);
    }.bind(this);
    
});

riot.tag('dropdown', '<yield> <div class="r-dropdown">{ title }</div> <ul class="r-downdown-menu"> <li class="r-dropdown-list" each="{ data }"><a href="{ link|\'javascript:void(0)\' }">{ name }</a></li> </ul>', function(opts) {
	var self = this;
    var EL = self.root;
    var config = self.opts.opts || self.opts;
	
});
riot.tag('editable-link', '<a href="javascript:void(0);" if="{ !editable }" onclick="{ open }">{ value }</a> <super-form if="{ editable }" action="{ action }" opts="{ formOpts }"> <input type="text" value="{ parent.value }" name="{ parent.name }" class="editable-link-input"> <input type="submit" value="提交"> <button onclick="{ parent.close }">取消</button> </super-form>', function(opts) {

    var self = this;
    self.editlink = false;
    var EL = self.root;
    var config = self.opts.opts || self.opts;

    self.on('mount', function() {
        self.action = EL.getAttribute('action');
        self.value = EL.getAttribute('text');
        self.name = EL.getAttribute('name');
        self.update();
    })

    this.open = function(e) {
        self.editable = true;
        self.update();
    }.bind(this);

    this.close = function(e) {
        self.editable = false;
        self.update();
    }.bind(this);

    self.formOpts = {
        errCallback: function() {
            config.errCallback();
            EL.querySelector('.editable-link-input').value = self.value;
            self.editable = false;
            self.update();
        },
        callback: function(value) {
            config.callback();
            self.value = EL.querySelector('.editable-link-input').value;
            self.editable = false;
            self.update();
        }
    }

});
riot.tag('goto-top', '<div class="itoolkit-goto-top" show="{ showGotoTop }" onclick="{ gotoTop }"> <yield> <span class="itoolkit-goto-top-icon" show="{ showDefault }"><span class="icon-arrowUp"></span></span> </div>', 'goto-top .itoolkit-goto-top{ display: block; position: fixed; bottom: 50px; right: 40px; height: 60px; width: 60px; z-index: 10000; text-align: center; opicity: 0.5; cursor: pointer; } goto-top .itoolkit-goto-top .itoolkit-goto-top-icon{ font-size: 3em; margin: auto; float: none; }', function(opts) {

    var self = this;
    self.config = self.opts.opts || self.opts;
    var avalibleHeight = window.screen.availHeight;
    var EL = self.root;
    
    self.on('mount', function() {
        self.root.querySelector('.itoolkit-goto-top').style.bottom = self.config.bottom;
        self.root.querySelector('.itoolkit-goto-top').style.right = self.config.right;
        if (EL.querySelector('.itoolkit-goto-top').firstElementChild.className === 'itoolkit-goto-top-icon') {
            self.showDefault = true;
        }
        window.addEventListener('scroll', self.controlGotoTop);
    })
    
    self.controlGotoTop = function() {
        var body = document.body;
        if (body.scrollTop > avalibleHeight && !self.showGotoTop) {
            self.showGotoTop = true;
            self.update();
        }
        else if (body.scrollTop < avalibleHeight && self.showGotoTop) {
            self.showGotoTop = false;
            self.update();
        }
    }

    this.gotoTop = function(e) {
        var length = document.body.scrollTop / 100 * 16;
        var timer = setInterval(function() {
            document.body.scrollTop = document.body.scrollTop - length;
            if (document.body.scrollTop < 10) {
                clearInterval(timer);
            }
        }, 16);
    }.bind(this);
    

});
riot.tag('loading', '<div class="{itoolkit-loading: true, default: default}" > <yield> </div>', 'loading .itoolkit-loading { text-align: center; }', function(opts) {

    var self = this;
    var config = self.opts.opts || self.opts;
    self.default = true;
    
    self.on('mount', function() {
        var parentDom = self.root.parentNode;
        var parentPosition = window.getComputedStyle(parentDom, null).position;
        if (parentPosition === 'static') {
            parentDom.style.position = 'relative';
        }

        self.childDom = self.root.getElementsByClassName('itoolkit-loading')[0];

        if (self.childDom.innerHTML.trim()) {
            self.default = false;
            self.update();
        }

        var cellHeight = parseInt(window.getComputedStyle(self.childDom, null).height.replace('px', ''), 10);
        self.root.style.marginTop = '-' + cellHeight/2 + 'px';
        
    })

    self.root.show = function(){
        if (self.childDom) {
            self.childDom.style.display = 'block';
        }
    }

    self.root.hide = function(){
        if (self.childDom) {
            self.childDom.style.display = 'none';
        }
    }
    

});
riot.tag('modal', '<div class="itoolkit-modal-dialog" riot-style="width:{width}; height:{height}"> <div class="itoolkit-modal-title"> <span>{ title }</span> <div class="itoolkit-modal-close-wrap" onclick="{ close }"> <div class="itoolkit-modal-close"></div> </div> </div> <div class="itoolkit-modal-container"> <yield> </div> </div>', function(opts) {

    var self = this;
    var config = self.opts.opts || self.opts;
    var EL = self.root;
    for (i in config) {
        self[i] = config[i];
    }
    self.width = config.width || 600;
    self.height = config.height || 'auto';

    self.on('mount', function() {
        var container = self.root.querySelector('.itoolkit-modal-container');
        var head = self.root.querySelector('.itoolkit-modal-title');
        var headHeight = parseInt(window.getComputedStyle(head, null).height.replace('px', ''));
        if (config.height) {
            container.style.height = (self.height - headHeight - 2) + 'px';
        }

    })

    this.close = function(e) {
        self.root.style.display = 'none';
        self.onClose && self.onClose();
    }.bind(this);

    if (document.querySelector("[modal-open-target='" + self.root.id + "']")) {
        document.querySelector("[modal-open-target='" + self.root.id + "']").onclick = function() {
            self.root.style.display = 'block';
            self.onOpen && self.onOpen();
        }
    }

    self.root.open = function() {
        self.root.style.display = 'block';
        self.onOpen && self.onOpen();
    }

    self.root.close = function() {
        self.root.style.display = 'none';
        self.onClose && self.onClose();
    }

    self.root.loadData = function(newData, colName){
        colName = colName || 'data';
        self[colName] = newData;
        self.update();
    }




});
riot.tag('paginate', '<div onselectstart="return false" ondragstart="return false"> <div class="paginate"> <li onclick="{ goFirst }">«</li> <li onclick="{ goPrev }">‹</li> </div> <ul class="paginate"> <li each="{ pages }" onclick="{ parent.changePage }" class="{ active: parent.currentPage == page }">{ page }</li> </ul> <div class="paginate"> <li onclick="{ goNext }">›</li> <li onclick="{ goLast }">»</li> </div> <div class="paginate"> <form onsubmit="{ redirect }" style="position:relative;"> <span> <select-list list="{ pagesizeOpts }" title="选择分页数量"></select-list> </span> <span class="redirect" if="{ redirect }">跳转到<input class="jumpPage" name="page" riot-type={"number"} style="width: 40px;">页 </span> <div class="paginate-tips" riot-style="top: { tipsTop }; left: { tipsLeft }; display: { showTip }"> 请输入1～{ pageCount }之间的数字 </div> <span class="page-sum" if="{ showPageCount }"> 共<em>{ pageCount }</em>页 </span> <span class="item-sum" if="{ showItemCount }"> <em>{ count }</em>条 </span> <input type="submit" style="display: none;"> </form> </div> </div>', '.paginate .paginate-tips{ position: absolute; padding: 5px; border: 1px solid #ddd; background-color: #fff; -webkit-box-shadow: 0 0 10px #ccc; box-shadow: 0 0 10px #ccc; } .paginate .paginate-tips:before { content: ""; position: absolute; width: 0; height: 0; top: -16px; left: 10px; border: 8px solid transparent; border-bottom-color: #ddd; } .paginate .paginate-tips:after { content: ""; position: absolute; width: 0; height: 0; top: -15px; left: 10px; border: 8px solid transparent; border-bottom-color: #fff; }', function(opts) {
    var self = this;
    var EL = self.root;
    var config = self.opts.opts || self.opts;
    self.showTip = 'none';
    self.count = config.count || 0;
    self.pagesize = config.pagesize || 20;
    self.pageCount = config.pageCount || Math.ceil(self.count/self.pagesize) || 1;
    self.currentPage = config.currentPage || 1;
    self.url = config.url || '';
    self.showNumber = config.showNumber || 5;

    self.setPagesize = function () {
        var ret = [];
        var selected = Math.ceil(self.pagesize / 10);
        for (var i = 1; i < 11; i++) {
            ret.push({
                value: i * 10,
                text: '每页' + (i * 10) + '条',
                selected: i === selected ? 'selected' : '',
            });
        }
        return ret;
    };

    self.pagesizeOpts = self.setPagesize();

    self.redirect = config.redirect || true;
    self.showPageCount = config.showPageCount || true;
    self.showItemCount = config.showItemCount || true;
    self.needInit = config.needInit || false;

    self.updateCurrentPage = function () {
        if (self.currentPage > Math.ceil(self.showNumber/2) && self.pageCount > self.showNumber) {
            self.pages = [];
            if (self.pageCount - self.currentPage > 2) {
                var origin = self.currentPage - Math.ceil(self.showNumber/2);
                var last = self.currentPage + Math.floor(self.showNumber/2);
            }
            else {
                var last = self.pageCount;
                var origin = self.pageCount - self.showNumber;
            }
            for (i = origin; i < last; i++) {
                self.pages.push({page: i + 1});
                self.update();
            }
        }
        else if (self.currentPage < (Math.ceil(self.showNumber/2) + 1) && self.pageCount > self.showNumber){
            self.pages = [];
            for (i = 0; i < self.showNumber; i++) {
                self.pages.push({page: i + 1});
            }
            self.pages.push({page: '...'});
        }
    };
    EL.addCount = function (num) {
        var count = self.count + num;
        var oldPageCount = self.pageCount;
        count < 0
        ? self.count = 0
        : self.count = count;

        self.pageCount = Math.ceil(self.count/self.pagesize) || 1;
        self.currentPage = (
            self.currentPage > self.pageCount
            ? self.pageCount
            : self.currentPage
        );

        if (self.pageCount <= self.showNumber) {
            self.pages = [];
            for (var i = 0; i < self.pageCount; i++) {
                self.pages.push({page: i + 1});
            }
        }

        if (

            self.needInit

            || (self.pageCount < oldPageCount && self.currentPage <= self.pageCount)
        ) {
            config.callback(self.currentPage);
        }

        self.pageChange(self.currentPage)
        self.update();
    };

    self.pages = [];
    
    if (self.pageCount < (self.showNumber + 1)) {
        for (i = 0; i < self.pageCount; i++) {
            self.pages.push({page: i + 1});
        }
    } 
    else {
        for (i = 0; i < self.showNumber; i++) {
            self.pages.push({page: i + 1});
        }
        self.pages.push({page: '...'});
    }

    if (self.needInit) {
        config.callback(self.currentPage);
    }
    self.updateCurrentPage();
    self.update();

    this.goFirst = function(e) {
        self.pageChange(1);
    }.bind(this);

    this.goPrev = function(e) {
        if (self.currentPage > 1) {
            self.pageChange(self.currentPage - 1);
        }
    }.bind(this);

    this.goNext = function(e) {
        if (self.currentPage < self.pageCount) {
            self.pageChange(self.currentPage + 1);
        }
    }.bind(this);
    
    this.goLast = function(e) {
        self.pageChange(self.pageCount);
    }.bind(this);

    this.redirect = function(e) {
        var index = parseInt(self.page.value, 10);
        if (
            index &&
            index < (self.pageCount + 1) &&
            index > 0
        ) {
            self.pageChange(parseInt(index, 10));
        }
        else {
            self.tipsLeft = self.page.offsetLeft;
            self.tipsTop = self.page.offsetTop + self.page.offsetHeight + 8;
            self.showTip = 'block';
            setTimeout(function () {
                self.showTip = 'none';
                self.update();
            }, 1500)
            self.update();
        }
    }.bind(this);

    this.changePage = function(e) {
        var page = e.item.page
        if (typeof(page) === 'string') {
            return false;
        }
        else {
            self.pageChange(page);
        }
    }.bind(this);

    self.pageChange = function(page) {
        if (self.currentPage != page) {
            self.currentPage = page;
            config.callback(page);
        }
        self.updateCurrentPage();
    };

    self.on('selected', function (v) {
        config.onPagesizeSelected && config.onPagesizeSelected(v.value);
    });

    
});

riot.tag('select-list', '<div onclick="{ toggle }"> <div class="select-list-title-text">{ selectedItem.text }</div> <div class="select-list-title-triangle"></div> </div> <div class="select-list-options { open : openning }" riot-style="top: { top }"> <div each="{ list }" class="select-list-option { selected: parent.selectedItem.value === value }" onclick="{ parent.select }">{ text }</div> </div>', 'select-list { display: inline-block; position: relative; cursor: pointer; } .select-list-title-text { border: 1px solid #ddd; width: 94px; padding: 6px 12px; color: #337ab7; } .select-list-options { display: none; position: absolute; max-height: 96px; overflow-x: none; overflow-y: auto; border: 1px solid #ddd; } .select-list-option { width: 92px; padding: 6px 12px; background-color: #fff; } .select-list-option.selected { background-color: #ccc; color: #fff; } .select-list-options.open { display: block; }', function(opts) {
    var self = this;
    self.openning = false;
    self.list = self.opts.list;

    self.getSelected = function() {
        for (var i = 0; i < self.list.length; i++) {
            if (self.list[i].selected) {
                return self.list[i];
            }
        }
    }

    self.selectedItem = self.getSelected();

    
    self.toggle = function (e) {
        window.event ? window.event.cancelBubble = true : e.stopPropagation();
        if (!self.openning) {
          self.openning = true;
        } else {
          self.openning = false;
        }
        self.update();

        if (self.openning) {
            var listBox = self.root.querySelector('.select-list-options');
            var listBoxHeight = listBox.clientHeight;
            var isOverflow = listBoxHeight + e.pageY > document.body.clientHeight;
            if (isOverflow) {
                self.top = (-listBoxHeight - 1) + 'px';
            }
            else {
                self.top = self.root.clientHeight - 1 + 'px';
            }
            self.update();
        }
    };

    self.select = function (e) {
        window.event ? window.event.cancelBubble = true : e.stopPropagation();
        var prevSelectedItem = self.selectedItem;
        self.selectedItem = e.item;
        self.openning = false;
        if (prevSelectedItem !== self.selectedItem) {
            self.parent.trigger('selected', self.selectedItem);
        }
        self.update();
    };

    self.closeSelectList = function (e) {
        self.openning = false;
        self.update();
    };

    self.on('mount', function () {
        document.addEventListener('click', self.closeSelectList, false);
    });
    self.on('unmount', function () {
        document.removeEventListener('click', self.closeSelectList, false);
    });
    
});
riot.tag('select-box', '<div class="r-select" onclick="{ clicked }">{ placeholder }</div> <ul class="r-select-body" hide="{ hide }"> <li each="{ data }" index="{ index }" value="{ value }" class="r-select-item { selected }" onclick="{ parent.clickItem }">{ innerText }</li> </ul> <div style="display:none" class="inputHide"></div>', function(opts) {
    var self = this;
    var EL = self.root;
    self.config = self.opts.opts || self.opts;

    self.data = [];

    self.placeholder = self.config.placeholder;

    self.callback = self.config.callback;

    self.name = self.config.name;

    self.value = [];

    self.prevNode = null;

    EL.getValue = function () {
        return self.value;
    };

    self.hide = true;

    this.clicked = function(e) {
        self.hide = false;
        self.update();
    }.bind(this);

    this.updateValue = function(item) {
        for (var i = 0; i < self.data.length; i++) {
            if (self.data[i].selected) {
                self.value.push(self.data[i].value);
                self.placeholder.push(self.data[i].innerText);
            }
        }
        if (self.value.length == self.size) {
            self.hide = true;
        }
        self.placeholder = self.placeholder.join(',');
        self.prevNode = item;
        self.callback && self.callback(self);
        self.update();
    }.bind(this);
 
    this.clickItem = function(e) {
        var item = e.target || e.srcElement;
        var index = +item.getAttribute('index');
        self.value.length = 0;
        self.placeholder = [];
        if (self.mutiple) {
            self.data[index].selected = self.data[index].selected ? '' : 'selected';
            self.updateValue(null);
            return;
        }
        if (self.prevNode) {
            self.data[+self.prevNode.getAttribute('index')].selected = '';
        }
        self.data[index].selected = 'selected';
        self.updateValue(item);
    }.bind(this);

    self.one('mount', function () {
        for (var i = 0; i < self.config.data.length; i++) {
            var child = self.config.data[i];
            child.selected = '',
            child.index = i;
            self.data.push(child);
        }
        self.mutiple = self.config.mutiple || false;
        self.size = self.mutiple ? (self.config.size ? self.config.size : self.data.length) : 1;
        self.update();
    });
    
});
riot.tag('side-list', '<ul > <li each="{ data }"> <img riot-src="{ logoUrl }" if="{ isLogo }"> <span>{ name }</span> </li> </ul>', function(opts) {

});
riot.tag('slide', '', function(opts) {


});
riot.tag('super-div', '<yield>', 'super-div{ display: block; }', function(opts) {
    
    var self = this;
    var config = self.opts.opts || self.opts;
    var EL = self.root;

    for (i in config) {
        self[i] = config[i];
    }
    
    
    self.getData = function(params) {
        var params = params || {};
        if (EL.getAttribute('data-get')) {
            var method = 'httpGet';
        }
        else if (EL.getAttribute('data-jsonp')) {
            var method = 'jsonp';
        }
        
        utils[method](self.superDivUrl, params, function(data) {
            for (i in data) {
                self.data = {};
                self.data[i] = data[i];
            }
            self.update();
        });
    }

    self.on('mount', function() {
        EL.style.display = 'block';
        self.superDivUrl = EL.getAttribute('data-get') || EL.getAttribute('data-jsonp');
        if (self.superDivUrl) {
            self.getData(config.params);
        }
    })
    
    
    self.loadData = EL.loadData = function(newData, colName){
        colName = colName || 'data';
        self[colName] = newData
        self.update();
    }

    self.reload = EL.reload = function() {
        if (self.superDivUrl) {
            self.getData(config.params);
        }
        else {
            self.update();
        }
    }


});
riot.tag('super-form', '<form onsubmit="{ submit }" > <yield> </form>', function(opts) {
    var self = this;
    var EL = self.root;
    var config = self.opts.opts || self.opts;
    var keyWords = [
        'insertTip',
        'ajaxSubmit',
        'submit',
        'removeTips',
        'insertTip',
        'removeTip',
        'loadData',
        'getData',
        'setData'
    ];   //保留字，不被覆盖

    var checkList = [
        'allowEmpty',
        'allowempty',
        'max',
        'min',
        'valid',
        'customValid',
        'customvalid',
        'vr'
    ];

    var NUMBER_REGEXP = {
        NON_NEGATIVE_INT: /^0$|^-[1-9]\d*$/,                            //非负整数（正整数 + 0） 
        POSITIVE_INT: /^[1-9]\d*$/,                                     //正整数 
        NON_POSITIVE_INT: /^[1-9]\d*$|^0$/,                             //非正整数（负整数 + 0） 
        NEGATIVE_INT: /^-[1-9]\d*$/,                                    //负整数 
        INT: /^-?[1-9]\d*$|^0$/,                                        //整数 
        NON_NEGATIVE_FLOAT: /^(\d)(\.\d+)?$|^([1-9]\d*)(\.\d+)?$|^0$/,  //非负浮点数（正浮点数 + 0） 
        POSITIVE_FLOAT: /^(\d)(\.\d+)?$|^([1-9]\d*)(\.\d+)?$/,          //正浮点数 
        NON_POSITIVE_FLOAT: /^(-\d)(\.\d+)?$|^(-[1-9]\d*)(\.\d+)?$|^0$/,//非正浮点数（负浮点数 + 0） 
        NEGATIVE_FLOAT: /^(-\d)(\.\d+)?$|^(-[1-9]\d*)(\.\d+)?$/,        //负浮点数 
        FLOAT: /^(-?\d)(\.\d+)?$|^(-?[1-9]\d*)(\.\d+)?$|^0$/            //浮点数
    };

    self.presentWarning = '必填';
    self.emailWarning = '邮箱格式错误';
    self.mobileWarning = '手机格式错误';
    self.urlWarning = '网址格式错误';
    self.successTips = config.successTipsText || '通过';
    self.regWarning = '字段不符合验证规则';
    self.numWarning = '数字格式错误';

    self.passClass = config.passClass || 'valid-pass';
    self.failedClass = config.failedClass || 'valid-failed';

    
    self.comparator = function (type) {
        return {
            handler: function (validation, attrs) {
                switch (type) {
                    case 'number':
                        return self.numComparator(validation, attrs);
                    case 'string':
                    default:
                        return self.strCompatator(validation, attrs);
                }
            }
        };
    };

    
    self.strCompatator = function(validation, attrs) {
        var min = parseInt(attrs.min, 10);
        var max = parseInt(attrs.max, 10);
        var nMin = isNaN(min);
        var nMax = isNaN(max);
        var len = attrs.value.length;
        if (!nMin && !nMax) {
            if (len > max || len < min) {
                validation.msg.push(self.bpWarning(min, max));
            }
        }
        else {
            if (!nMin && len < min) {
                validation.msg.push(self.minWarning(min));
            }
            if (!nMax && len > max) {
                validation.msg.push(self.maxWarning(max));
            }
        }
        return validation;
    };

    
    self.numComparator = function(validation, attrs) {
        var min = parseInt(attrs.min, 10);
        var max = parseInt(attrs.max, 10);
        var nMin = isNaN(min);
        var nMax = isNaN(max);
        var value = +attrs.value;
        if (!nMin && !nMax) {
            if (value > max || value < min) {
                validation.msg.push(self.numBpWarning(min, max));
            }
        }
        else {
            if (!nMin && value < min) {
                validation.msg.push(self.minNumWarning(min));
            }
            if (!nMax && value > max) {
                validation.msg.push(self.maxNumWarning(max));
            }
        }
        return validation;
    };

    self.one('mount', function() {
        EL.style.display = 'block';
        if (config.realTime && config.valid) {
            var elems = self.root.getElementsByTagName('form')[0].elements;
            for (var i = 0, len = elems.length; i < len; i ++) {
                var type = elems[i].type;
                if (type !== 'submit' || type !== 'button') {
                    elems[i].addEventListener('input', valueOnChange, false);
                    elems[i].addEventListener('change', valueOnChange, false);
                }
            }
        }
    });

    
    function valueOnChange(e) {
        doCheck([], this);
    }

    function isType(obj) {
        return Object.prototype.toString.call(obj).match(/\ (.*)\]/)[1];
    }

    function dif(obj) {
        var constructor = isType(obj);
        if (constructor === 'Null'
            || constructor === 'Undefined'
            || constructor === 'Function'
        ) {
            return obj;
        }
        return new window[constructor](obj);
    }

    EL.loadData = function(newData, colName){
        if (utils.isObject(newData)) {
            for(var i in newData) {
                newData[i] = dif(newData[i]);
            }
        }
        else {
            newData = dif(newData);
        }
        colName = colName || 'data';
        self[colName] = newData;
        self.update();
    };

    EL.setData = function(newData, name){
        self.data[name] = dif(newData);
        self.update();
    };

    self.checkExistKey = function(obj, key, value) {
        if (obj.hasOwnProperty(key)) {
            if (utils.isArray(obj[key])) {
                obj[key].push(value);
            }
            else {
                var arr = [];
                arr.push(obj[key]);
                arr.push(value)
                obj[key] = arr;
            }                  
        }
        else {
            obj[key] = value;
        }
    }

    self.getData = EL.getData = function(){
        var elems = self.root.getElementsByTagName('form')[0].elements;
        var params = {};
        for (var i = 0; i < elems.length; i++) {
            if (elems[i].name) {
                var value;
                if (elems[i].tagName === "SELECT") {
                    var options = elems[i].options;
                    for (var j = 0; j < options.length; j++) {
                        if (options[j].selected) {
                           value = options[j].value;
                           self.checkExistKey(params, elems[i].name, encodeURIComponent(value));
                        }
                    }
                } 
                else if (elems[i].type === "checkbox" || elems[i].type === "radio"){
                    if (elems[i].checked) {
                        value = elems[i].value;
                        self.checkExistKey(params, elems[i].name, encodeURIComponent(value));
                    }
                }
                else {
                    value = elems[i].value;
                    self.checkExistKey(params, elems[i].name, encodeURIComponent(value));
                }
            }
        }
        return params;
    }
    
    

    for (i in config) {
        if (keyWords.indexOf(i) < 0) {
            self[i] = config[i];
        }
    }
    self.data = config.data;

    self.submitingText = config.submitingText || '提交中...';
    if (config.valid === undefined) {
        config.valid = true;
    }
    
    self.maxWarning = config.maxWarning || function(n) {
        return '不得超过' + n + '个字符';
    }
    self.minWarning = config.minWarning || function(n) {
        return '不得小于' + n + '个字符';
    }

    self.bpWarning = config.bpWarning || function (min, max) {
        return '只允许' + min + '-' + max + '个字符';
    }

    self.minNumWarning = config.minNumWarning || function (n) {
        return '不得小于' + n;
    }
    self.maxNumWarning = config.maxNumWarning || function (n) {
        return '不得大于' + n;
    }
    self.numBpWarning = config.numBpWarning || function (min, max) {
        return '输入数字应在' + min + '-' + max + '之间';
    }

    
    self.removeTips = EL.removeTips = function() {
        var root = self.root;
        var elems = root.getElementsByTagName('form')[0].elements;
        var tips = root.getElementsByClassName('tip-container');
        if (tips && tips.length) {
            del();
        }

        function del() {
            for (i = 0; i < tips.length; i++) {
                tips[i].parentNode.removeChild(tips[i]);                
                if (tips.length) {
                    del();
                }
            }
        }

        for (var i = 0; i < elems.length; i++) {
            utils.removeClass(elems[i], self.passClass);
            utils.removeClass(elems[i], self.failedClass);
        }
    }
    
    
    
    self.removeTipNode = function(dom) {
        var tip = dom.nextElementSibling;
        if (tip && tip.className.match(/tip-container/)) {
            dom.parentNode.removeChild(tip);
        }
    };
    self.removeTip = EL.removeTip = function(dom){
        self.removeTipNode(dom);
        utils.removeClass(dom, self.passClass);
        utils.removeClass(dom, self.failedClass);
    };

    self.insertTip = EL.insertTip = function(dom, message, className){
        self.removeTipNode(dom);
        var tipContainer = document.createElement('span');
        tipContainer.className = className;
        tipContainer.innerHTML = message;
        utils.insertAfterText(tipContainer, dom);
    };

    self.onValidRefuse = EL.onValidRefuse = config.onValidRefuse || function(dom, errorTips) {
        self.insertTip(dom, errorTips, 'tip-container');
        utils.removeClass(dom, self.passClass);
        utils.addClass(dom, self.failedClass);
    };

    self.onValidPass = EL.onValidPass = config.onValidPass || function(dom, successTips) {
        self.insertTip(dom, successTips, 'tip-container success');
        utils.removeClass(dom, self.failedClass);
        utils.addClass(dom, self.passClass);
    };

    
    self.ajaxSubmit = function(elems, url) {
        var params = '';
        for (var i = 0; i < elems.length; i++) {
            if (elems[i].name) {
                var value;
                if (elems[i].tagName === "SELECT") {
                    var options = elems[i].options;
                    for (var j = 0; j < options.length; j++) {
                        if (options[j].selected) {
                           value = options[j].value;
                           params += elems[i].name + "=" + encodeURIComponent(value) + "&";
                        }
                    }
                }
                else if (elems[i].type === "checkbox" || elems[i].type === "radio"){
                    if (elems[i].checked) {
                        value = elems[i].value;
                        params += elems[i].name + "=" + encodeURIComponent(value) + "&";
                    }
                }
                else {
                    value = elems[i].value;
                    params += elems[i].name + "=" + encodeURIComponent(value) + "&";
                }
            }
            if (elems[i].type === "submit") {
                var submitbtn = elems[i];
                var attr = submitbtn.tagName === 'BUTTON'
                         ? 'innerHTML'
                         : 'value';
                var submitingText = submitbtn[attr];
                submitbtn.disabled = 'disabled';
                submitbtn[attr] = self.submitingText;
            }
        }
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(params);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4) {
                self.removeTips();
                submitbtn[attr] = submitingText;
                submitbtn.disabled = false;
                if (config.complete && typeof config.complete === 'function') {
                    config.complete();
                }
                if (xmlhttp.status === 200) {
                    try {
                        var result = JSON.parse(xmlhttp.responseText);
                        config.callback && config.callback(result);
                        EC.trigger('submit_success', result);
                    }catch(e){
                        throw new Error(e.message);
                    }
                }
                else {
                    config.errCallback && config.errCallback(params);
                    EC.trigger('submit_error', params);
                }
            } 
        };
    }
    
    
    this.submit = function(e) {
        var validArr = [];
        var elems = self.root.getElementsByTagName('form')[0].elements;
        var action = self.action || self.root.getAttribute('action');
        var url = action;

        if (config.valid) {
            for (var i = 0; i < elems.length; i++) {
                doCheck(validArr, elems[i]);
            }
        }

        if (!validArr.length) {
            try {
                config.beforeSubmit && config.beforeSubmit(validArr);
            }
            catch (e) {
                validArr.push({
                    name: 'functionError',
                    dom: null,
                    msg: e.message
                });
            }
        }
        else {
            config.checkFailed && config.checkFailed(validArr);
        }

        if (!validArr.length) {
            if (config.normalSubmit) {
                self.root.firstChild.setAttribute('action', action);
                return true;
            }
            else {
                e.preventDefault();
                self.ajaxSubmit(elems, url);
            }
        }
        else {
            return false;
        }
    }.bind(this);

    function getCheckParam(elem) {
        var elem = elem;
        var attributes = elem.attributes;
        var ret = {};
        for (var i = 0; i < attributes.length; i++) {
            var attr = attributes[i];
            ret[attr.name] = attr.value;
        }
        ret.value = elem.value;
        return ret;
    }

    function isNeedCheck(attrs) {
        for (var i = 0; i < checkList.length; i++) {
            if (attrs[checkList[i]]) {
                return true;
            }
        }
        return false;
    }

    
    self.Validation = function(validArr, name, dom) {
        this.msg = [];        
        this.validTip = function() {
            if (this.msg.length) {
                self.onValidRefuse(dom, this.msg[0]);
                validArr.push({
                    name: name,
                    dom: dom,
                    msg: this.msg[0]
                });
            }
            else {
                if (config.forbidTips) {
                    self.removeTip(dom);
                }
                else {
                    self.onValidPass(dom, self.successTips);
                }
            }
        }
    }

    self.validEmail = function(validation, attrs) {
        if (!attrs.value.match(/^([a-zA-Z0-9_\-\.])+\@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/)) {
            validation.msg.push(self.emailWarning);
        }
        else {
            self.comparator('string').handler(validation, attrs);
        }
        return validation;
    }

    self.validUrl = function(validation, attrs) {
        if (!attrs.value.match(/((http|ftp|https|file):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/)) {
            validation.msg.push(self.urlWarning);
        }
        else {
            self.comparator('string').handler(validation, attrs);
        }
        return validation;
    }

    self.validMobile = function(validation, attrs) {
        if (!attrs.value.match(/^1[3|4|5|8][0-9]\d{4,8}$/)) {
            validation.msg.push(self.mobileWarning);
        }
        else {
            self.comparator('string').handler(validation, attrs);
        }
        return validation;
    }

    self.validPresent = function(validation, attrs) {
        var v = attrs.value.replace(' ', '');
        if (!v.length) {
            validation.msg.push(self.presentWarning);
        }
        else {
            self.comparator('string').handler(validation, attrs);
        }
        return validation;
    }

    self.validRegExp = function(validation, attrs) {
        var valid = attrs.valid.replace(/^\//, '');
        valid = valid.replace(/\/$/, '');
        var reg = new RegExp(valid);
        if (reg.test(attrs.value)) {
            self.comparator('string').handler(validation, attrs);
        }
        else {
            validation.msg.push(self.regWarning);
        }
        return validation;
    }

    self.validNumRange = function(validation, attrs) {
        var reg = NUMBER_REGEXP[attrs.valid.toUpperCase()];
        if (!reg.test(attrs.value)) {
            validation.msg.push(self.numWarning);
        }
        else {
            self.comparator('number').handler(validation, attrs);
        }
        return validation;
    }

    self.validCustom = function(validation, attrs) {
        var customValid = attrs.customValid || attrs.customvalid;
        if (window[customValid]) {
            var reg = window[customValid].regExp;
            var tips = window[customValid].message || self.regWarning;
            if (reg && reg.test(attrs.value)) {
                self.comparator('string').handler(validation, attrs); 
            }
            else {
                validation.msg.push(tips);
            }
        }
        return validation;
    }

    self.validUnion = function (validation, validArr, elem, attrs) {
        if (attrs.vr) {
            var arr = attrs.vr.split('::');
            var method = arr[0];
            var params = arr[1] ? arr[1].split(',') : undefined;
            var flag = false;
            try {
                flag = iToolkit[method].apply(elem, params);
            }
            catch (e) {
                flag = false;
                throw e;
            }
            if (!flag) {
                validation.msg.push('');
            }
        }
        return validation;
    }

    self.validEmpty = function (validation, attrs) {
        if (attrs.value === '') {
            validation.msg.push(self.presentWarning);
        }
        return validation;
    }

    
    function doCheck(validArr, elem) {
        var dom = elem;
        var attrs = getCheckParam(elem);
        if (!isNeedCheck(attrs)) {
            return;
        }
        var validation = new self.Validation(validArr, attrs.name, dom);
        if (attrs.name) {
            if ((attrs.allowEmpty || attrs.allowempty) && attrs.value === '') {
                self.onValidPass(dom, self.successTips);
                return;
            }
            self.validEmpty(validation, attrs);
            if (attrs.valid) {
                if (attrs.valid === 'present') {
                    self.validPresent(validation, attrs);
                }
                else if (attrs.valid === 'mobile') {
                    self.validMobile(validation, attrs);
                }
                else if (attrs.valid === 'url') {
                    self.validUrl(validation, attrs);
                }
                else if (attrs.valid === 'email') {
                    self.validEmail(validation, attrs);
                }
                else if (attrs.valid.match(/^\/\S+\/$/)) {
                    self.validRegExp(validation, attrs);
                }
                else if (NUMBER_REGEXP[attrs.valid.toUpperCase()]) {
                    self.validNumRange(validation, attrs);
                }
            }
            else if (!attrs.valid) {
                if (attrs.customValid || attrs.customvalid) {
                    self.validCustom(validation, attrs);
                }
                else if (attrs.min || attrs.max){
                    self.comparator('string').handler(validation, attrs);
                }
            }
        }
        if (!validArr.length) {
            self.validUnion(validation, validArr, dom, attrs);
        }
        validation.validTip();
    }
    
});
riot.tag('tab', '<ul> <li each="{ data }" onclick="{ parent.toggle }" class="{ active: parent.currentIndex==index }">{ title }</li> </ul> <div class="tab-content"> { content } </div>', function(opts) {

    var self = this
    var config = self.opts.opts || self.opts;

    self.data = config.data;
    if (self.data.length > 0) {
        self.currentIndex = 0;
        self.content = self.data[0].content;
        for (i = 0; i < self.data.length; i++) {
            self.data[i].index = i;
        }
    }
    

    this.toggle = function(e) {
        self.content = e.item.content;
        self.currentIndex = e.item.index;
        self.update();
    }.bind(this);

});
riot.tag('table-view', '<yield> <table class="{ config.class }"> <tr show="{ showHeader }"> <th each="{ cols }" riot-style="{ style }" hide="{ hide }">{ alias || name }</th> </tr> <tr each="{ row in rows }" > <td each="{ colkey, colval in parent.cols }" class="{ newline: parent.parent.config.newline, cut: parent.parent.config.cut }" title="{ parent.row[colkey.name] }" hide="{ colkey.hide }"> { parent.parent.drawcell(parent.row, this, colkey) } </td> </tr> </table>', function(opts) {

    var self = this;
    var EL = self.root;
    self.config = self.opts.opts || self.opts;
    if (self.config.showHeader===false) {
        self.showHeader = false
    }
    else {
        self.showHeader = true;
    }

    self.cols = [];
    self.rows = [];

    self.on('mount', function() {
        self.rows = self.config.data;
        if (EL.children.length > 1) {
            for( i = 0; i < EL.children.length; i++){
                var child = EL.children[i];
                if(child.localName === 'rcol'){
                    var col_style = ''    
                    if(child.attributes['width'] != undefined) {
                        col_style='width: '+ child.attributes['width'].value;
                    }

                    var col = {
                        inner: child.innerHTML,
                        style: col_style,
                        index: i,
                        attrs: child.attributes,
                        hide: false
                    }

                    col.name = child.attributes['name'] ? child.attributes['name'].value : '';
                    if (child.attributes['alias']) {
                        col.alias = child.attributes['alias'].value || ''
                    }

                    self.cols.push(col);
                }

            }
        }
        else {

            for (i in self.rows[0]) {
                var col = {
                    name: i,
                    inner: '',
                    style: col_style,
                }
                self.cols.push(col);
            }
        }
        self.update()
    })

    self.compare = function(a, b) {
        if (a[self.orderkeyName] > b[self.orderkeyName]) {
            return 1;
        } 
        else if (a[self.orderkeyName] === b[self.orderkeyName]) {
            return 0;
        }
        else {
            return -1;
        }
    }

    self.clearOrder = function() {
        self.ordered = false;
        self.reversed = false;
    }


    EL.loadData = function(newrows){
        self.clearOrder();
        self.rows = newrows
        self.update()
    }

    EL.appendData = function(newrows){
        self.clearOrder();
        self.rows.push(newrows)
        self.update()
    }

    EL.clearData = function(newrows){
        self.clearOrder();
        self.rows = [];
        self.update()
    }

    EL.orderData = function(keyName){
        self.orderkeyName = keyName;
        if (self.ordered !== keyName) {
            if (self.reversed !== keyName) {
                self.rows = self.rows.sort(self.compare)
            }
            else {
                self.rows = self.rows.reverse();
            }
        }
        else {
            return
        }
        self.ordered = keyName;
        self.reversed = false;
        self.update()
    }

    EL.reverseData = function(keyName){
        self.orderkeyName = keyName;
        if (self.reversed !== keyName) {
            if (self.ordered !== keyName) {
                self.rows = self.rows.sort(self.compare)
            }
            self.rows = self.rows.reverse();
        }
        else {
            return
        }
        self.ordered = false;
        self.reversed = keyName;
        self.update()
    }

    EL.deleteData = function(keyName, value){
        self.clearOrder();
        var keyName = keyName || 'id';
        for (i = 0; i < self.rows.length; i++) {
            if (self.rows[i][keyName] === value) {
                self.rows.splice(i, 1);
                EL.deleteData(keyName, value);
            }
        }
        self.update();
        return EL;
    }

    EL.hide = function(keyName) {
        for(i = 0; i < self.cols.length; i++) {
            if (self.cols[i].name === keyName) {
                self.cols[i].hide = true
                break
            }
        }
        self.update();
    }

    EL.show = function(keyName) {
        for(i = 0; i < self.cols.length; i++) {
            if (self.cols[i].name === keyName) {
                self.cols[i].hide = false
                break
            }
        }
        self.update();
    }
    
    self.findNodes = function(node, tag) {
        for(var i = 0;i < node.attributes.length; i++){
            var attrName = node.attributes[i]['name'];
            var attrValue = node.attributes[i]['value'];
            if (attrName === 'if' || attrName === 'show' || attrName === 'hide') {
                node.removeAttribute(attrName);
                var judgeValue = riot.util.tmpl(attrValue, tag);
                if (attrName == 'hide') judgeValue = !judgeValue;
                node.style.display = judgeValue ? '' : 'none';
            }
            if (attrName === 'each') {
                node.removeAttribute(attrName);
                var arr = riot.util.tmpl(attrValue, tag);
                var root = node.parentNode;
                if (arr && utils.isArray(arr)) {
                    var placeholder = document.createComment('riot placeholder');
                    var frag = document.createDocumentFragment();

                    root.insertBefore(placeholder, node);
                    for (i = 0; i < arr.length; i++) {
                        var tmp = document.createElement('tmp');
                        tmp.innerHTML = riot.util.tmpl(node.outerHTML, arr[i]);
                        frag.appendChild(tmp.firstChild);
                    }

                    root.removeChild(node);
                    root.insertBefore(frag, placeholder);
                }
                
            } 
        }
        if (node.hasChildNodes()) {
            var children = node.children;
            for (var i = 0; i < children.length; i++) {  
                var child = children.item(i);
                self.findNodes(child, tag);  
            }  
        }
        
    }

    this.drawcell = function(rowdata, td, col) {
        if (col.attrs.length) {
            for (i in col.attrs) {
                if (typeof col.attrs[i] !== 'function') {
                    if (col.attrs[i]['name'] && col.attrs[i]['name']!=='class') {
                        td.root.setAttribute(col.attrs[i]['name'], col.attrs[i]['value']);
                    }
                    else if (col.attrs[i]['name'] && col.attrs[i]['name']=='class') {
                        utils.addClass(td.root, col.attrs[i]['value']);
                    }
                }
            }
        } //将rcol的属性挪到td上，class需特殊处理，name和alias不动
        
        if(col.inner){
            var str = col.inner.replace(/&lt;%=/g, '{')
                               .replace(/%&gt;/g, '}')
                               .replace(/%>/g, '}')
                               .replace(/<%=/g, '{');
            for (i in iToolkit.tableExtend) {
                if (typeof iToolkit.tableExtend[i] === 'function') {
                    rowdata[i] = iToolkit.tableExtend[i].bind(rowdata);
                }
                else {
                    rowdata[i] = iToolkit.tableExtend[i]
                }
            }

            for (i in rowdata) {
                td[i] = rowdata[i];
            }
            
            td.root.innerHTML = str;
            self.findNodes(td.root, td);
            td.root.innerHTML = riot.util.tmpl(td.root.innerHTML, rowdata)
        }
        else{
            return rowdata[col.name];
        }
    }.bind(this);


});
riot.tag('tree', '<div class="tree-item-wrap" each="{ data }" onselectstart="return false" ondragstart="return false"> <input type="checkbox" onchange="{ parent.checkHandle }" if="{ parent.rootConfig.showCheck }"> <i class="{ tree-item-arrow: true, open: opened, empty: !children }" onclick="{ parent.toggle }"></i> <div onclick="{ parent.leftClick }" style="display: inline;"> <i class="tree-item-icon" if="{ !parent.children }"></i> <i class="tree-item-icon" if="{ parent.children }"></i> <div class="{ tree-item-name : true }" title="{ name }">{ name }</div>  </div> <ul class="tree-child-wrap" if="{ children }"> <tree data="{ children }" if="{ children }"></tree> </ul> </div>', function(opts) {

    var self = this;
    self.config = self.opts.opts || self.opts;

    
    self.dataHandle = function(data, idName, pidName) {
        var data = data || []
        var id = idName || 'id';
        var pid = pidName || 'pid';

        var dataMap = {};
        data.forEach(function(node) {
            if (self.config.name) {
                node.name = node[self.config.name];
            }
            dataMap[node[id]] = node;
        });

        var tree = [];
        data.forEach(function(node) {
            var parent = dataMap[node[pid]];
            if (parent) {
                if (!parent.children) {
                    parent.children = [];
                }
                parent.children.push(node);
            }
            else {
                tree.push(node);
            }
        });
        return tree;
    };
    
    
    if (self.config.handleData) {
        var tree = self.dataHandle(self.config.data);
        self.data = tree;
    }
    else {
        self.data = self.config.data;
    }

    
    if (self.config.root) {
        self.rootConfig = self.config;
    }
    else {
        self.rootConfig = self.parent.rootConfig || self.parent.parent.rootConfig;
    }
    
    
    this.leftClick = function(e) {
        if (self.rootConfig.folder && e.item.children) {
            if (e.item.opened === true) {
                e.item.opened = false;
            }
            else {
                e.item.opened = true;
            }
        }
        else {
            var leftClick = self.rootConfig.onLeftClick;
            if (leftClick) {
                leftClick(e.item, e.target);
            }
        }
    }.bind(this);

    
    this.checkHandle = function(e) {
        var checkItem = self.rootConfig.onCheck;
        var uncheckItem = self.rootConfig.onUnCheck;
        if (checkItem && e.target.checked) {
            checkItem(e.item, e.target);
        }
        if (uncheckItem && !e.target.checked) {
            uncheckItem(e.item, e.target);
        }
    }.bind(this);



    
    
    this.toggle = function(e) {
        if (e.item.opened === true) {
            e.item.opened = false;
        }
        else {
            e.item.opened = true;
        }
    }.bind(this);

});