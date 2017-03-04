;
window.Modernizr = (function(window, document, undefined) {
  var version = '2.7.1',
    Modernizr = {},
    enableClasses = true,
    docElement = document.documentElement,
    mod = 'modernizr',
    modElem = document.createElement(mod),
    mStyle = modElem.style,
    inputElem = document.createElement('input'),
    smile = ':)',
    toString = {}.toString,
    prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),
    omPrefixes = 'Webkit Moz O ms',
    cssomPrefixes = omPrefixes.split(' '),
    domPrefixes = omPrefixes.toLowerCase().split(' '),
    ns = {
      'svg': 'http://www.w3.org/2000/svg'
    },
    tests = {},
    inputs = {},
    attrs = {},
    classes = [],
    slice = classes.slice,
    featureName, injectElementWithStyles = function(rule, callback, nodes, testnames) {
      var style, ret, node, docOverflow, div = document.createElement('div'),
        body = document.body,
        fakeBody = body || document.createElement('body');
      if (parseInt(nodes, 10)) {
        while (nodes--) {
          node = document.createElement('div');
          node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
          div.appendChild(node);
        }
      }
      style = ['&#173;', '<style id="s', mod, '">', rule, '</style>'].join('');
      div.id = mod;
      (body ? div : fakeBody).innerHTML += style;
      fakeBody.appendChild(div);
      if (!body) {
        fakeBody.style.background = '';
        fakeBody.style.overflow = 'hidden';
        docOverflow = docElement.style.overflow;
        docElement.style.overflow = 'hidden';
        docElement.appendChild(fakeBody);
      }
      ret = callback(div, rule);
      if (!body) {
        fakeBody.parentNode.removeChild(fakeBody);
        docElement.style.overflow = docOverflow;
      } else {
        div.parentNode.removeChild(div);
      }
      return !!ret;
    },
    testMediaQuery = function(mq) {
      var matchMedia = window.matchMedia || window.msMatchMedia;
      if (matchMedia) {
        return matchMedia(mq).matches;
      }
      var bool;
      injectElementWithStyles('@media ' + mq + ' { #' + mod + ' { position: absolute; } }', function(node) {
        bool = (window.getComputedStyle ? getComputedStyle(node, null) : node.currentStyle)['position'] == 'absolute';
      });
      return bool;
    },
    isEventSupported = (function() {
      var TAGNAMES = {
        'select': 'input',
        'change': 'input',
        'submit': 'form',
        'reset': 'form',
        'error': 'img',
        'load': 'img',
        'abort': 'img'
      };

      function isEventSupported(eventName, element) {
        element = element || document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;
        var isSupported = eventName in element;
        if (!isSupported) {
          if (!element.setAttribute) {
            element = document.createElement('div');
          }
          if (element.setAttribute && element.removeAttribute) {
            element.setAttribute(eventName, '');
            isSupported = is(element[eventName], 'function');
            if (!is(element[eventName], 'undefined')) {
              element[eventName] = undefined;
            }
            element.removeAttribute(eventName);
          }
        }
        element = null;
        return isSupported;
      }
      return isEventSupported;
    })(),
    _hasOwnProperty = ({}).hasOwnProperty,
    hasOwnProp;
  if (!is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined')) {
    hasOwnProp = function(object, property) {
      return _hasOwnProperty.call(object, property);
    };
  } else {
    hasOwnProp = function(object, property) {
      return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
    };
  }
  if (!Function.prototype.bind) {
    Function.prototype.bind = function bind(that) {
      var target = this;
      if (typeof target != "function") {
        throw new TypeError();
      }
      var args = slice.call(arguments, 1),
        bound = function() {
          if (this instanceof bound) {
            var F = function() {};
            F.prototype = target.prototype;
            var self = new F();
            var result = target.apply(self, args.concat(slice.call(arguments)));
            if (Object(result) === result) {
              return result;
            }
            return self;
          } else {
            return target.apply(that, args.concat(slice.call(arguments)));
          }
        };
      return bound;
    };
  }

  function setCss(str) {
    mStyle.cssText = str;
  }

  function setCssAll(str1, str2) {
    return setCss(prefixes.join(str1 + ';') + (str2 || ''));
  }

  function is(obj, type) {
    return typeof obj === type;
  }

  function contains(str, substr) {
    return !!~('' + str).indexOf(substr);
  }

  function testProps(props, prefixed) {
    for (var i in props) {
      var prop = props[i];
      if (!contains(prop, "-") && mStyle[prop] !== undefined) {
        return prefixed == 'pfx' ? prop : true;
      }
    }
    return false;
  }

  function testDOMProps(props, obj, elem) {
    for (var i in props) {
      var item = obj[props[i]];
      if (item !== undefined) {
        if (elem === false) return props[i];
        if (is(item, 'function')) {
          return item.bind(elem || obj);
        }
        return item;
      }
    }
    return false;
  }

  function testPropsAll(prop, prefixed, elem) {
    var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
      props = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');
    if (is(prefixed, "string") || is(prefixed, "undefined")) {
      return testProps(props, prefixed);
    } else {
      props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
      return testDOMProps(props, prefixed, elem);
    }
  }
  tests['flexbox'] = function() {
    return testPropsAll('flexWrap');
  };
  tests['flexboxlegacy'] = function() {
    return testPropsAll('boxDirection');
  };
  tests['canvas'] = function() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
  };
  tests['canvastext'] = function() {
    return !!(Modernizr['canvas'] && is(document.createElement('canvas').getContext('2d').fillText, 'function'));
  };
  tests['touch'] = function() {
    var bool;
    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
      bool = true;
    } else {
      injectElementWithStyles(['@media (', prefixes.join('touch-enabled),('), mod, ')', '{#modernizr{top:9px;position:absolute}}'].join(''), function(node) {
        bool = node.offsetTop === 9;
      });
    }
    return bool;
  };
  tests['geolocation'] = function() {
    return 'geolocation' in navigator;
  };
  tests['history'] = function() {
    return !!(window.history && history.pushState);
  };
  tests['draganddrop'] = function() {
    var div = document.createElement('div');
    return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
  };
  tests['cssanimations'] = function() {
    return testPropsAll('animationName');
  };
  tests['csscolumns'] = function() {
    return testPropsAll('columnCount');
  };
  tests['csstransforms'] = function() {
    return !!testPropsAll('transform');
  };
  tests['csstransforms3d'] = function() {
    var ret = !!testPropsAll('perspective');
    if (ret && 'webkitPerspective' in docElement.style) {
      injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function(node, rule) {
        ret = node.offsetLeft === 9 && node.offsetHeight === 3;
      });
    }
    return ret;
  };
  tests['csstransitions'] = function() {
    return testPropsAll('transition');
  };
  tests['localstorage'] = function() {
    try {
      localStorage.setItem(mod, mod);
      localStorage.removeItem(mod);
      return true;
    } catch (e) {
      return false;
    }
  };
  tests['svg'] = function() {
    return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;
  };

  function webforms() {
    Modernizr['input'] = (function(props) {
      for (var i = 0, len = props.length; i < len; i++) {
        attrs[props[i]] = !!(props[i] in inputElem);
      }
      if (attrs.list) {
        attrs.list = !!(document.createElement('datalist') && window.HTMLDataListElement);
      }
      return attrs;
    })('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));
    Modernizr['inputtypes'] = (function(props) {
      for (var i = 0, bool, inputElemType, defaultView, len = props.length; i < len; i++) {
        inputElem.setAttribute('type', inputElemType = props[i]);
        bool = inputElem.type !== 'text';
        if (bool) {
          inputElem.value = smile;
          inputElem.style.cssText = 'position:absolute;visibility:hidden;';
          if (/^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined) {
            docElement.appendChild(inputElem);
            defaultView = document.defaultView;
            bool = defaultView.getComputedStyle && defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' && (inputElem.offsetHeight !== 0);
            docElement.removeChild(inputElem);
          } else if (/^(search|tel)$/.test(inputElemType)) {} else if (/^(url|email)$/.test(inputElemType)) {
            bool = inputElem.checkValidity && inputElem.checkValidity() === false;
          } else {
            bool = inputElem.value != smile;
          }
        }
        inputs[props[i]] = !!bool;
      }
      return inputs;
    })('search tel url email datetime date month week time datetime-local number range color'.split(' '));
  }
  for (var feature in tests) {
    if (hasOwnProp(tests, feature)) {
      featureName = feature.toLowerCase();
      Modernizr[featureName] = tests[feature]();
      classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
    }
  }
  Modernizr.input || webforms();
  Modernizr.addTest = function(feature, test) {
    if (typeof feature == 'object') {
      for (var key in feature) {
        if (hasOwnProp(feature, key)) {
          Modernizr.addTest(key, feature[key]);
        }
      }
    } else {
      feature = feature.toLowerCase();
      if (Modernizr[feature] !== undefined) {
        return Modernizr;
      }
      test = typeof test == 'function' ? test() : test;
      if (typeof enableClasses !== "undefined" && enableClasses) {
        docElement.className += ' ' + (test ? '' : 'no-') + feature;
      }
      Modernizr[feature] = test;
    }
    return Modernizr;
  };
  setCss('');
  modElem = inputElem = null;;
  (function(window, document) {
    var version = '3.7.0';
    var options = window.html5 || {};
    var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;
    var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;
    var supportsHtml5Styles;
    var expando = '_html5shiv';
    var expanID = 0;
    var expandoData = {};
    var supportsUnknownElements;
    (function() {
      try {
        var a = document.createElement('a');
        a.innerHTML = '<xyz></xyz>';
        supportsHtml5Styles = ('hidden' in a);
        supportsUnknownElements = a.childNodes.length == 1 || (function() {
          (document.createElement)('a');
          var frag = document.createDocumentFragment();
          return (typeof frag.cloneNode == 'undefined' || typeof frag.createDocumentFragment == 'undefined' || typeof frag.createElement == 'undefined');
        }());
      } catch (e) {
        supportsHtml5Styles = true;
        supportsUnknownElements = true;
      }
    }());

    function addStyleSheet(ownerDocument, cssText) {
      var p = ownerDocument.createElement('p'),
        parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;
      p.innerHTML = 'x<style>' + cssText + '</style>';
      return parent.insertBefore(p.lastChild, parent.firstChild);
    }

    function getElements() {
      var elements = html5.elements;
      return typeof elements == 'string' ? elements.split(' ') : elements;
    }

    function getExpandoData(ownerDocument) {
      var data = expandoData[ownerDocument[expando]];
      if (!data) {
        data = {};
        expanID++;
        ownerDocument[expando] = expanID;
        expandoData[expanID] = data;
      }
      return data;
    }

    function createElement(nodeName, ownerDocument, data) {
      if (!ownerDocument) {
        ownerDocument = document;
      }
      if (supportsUnknownElements) {
        return ownerDocument.createElement(nodeName);
      }
      if (!data) {
        data = getExpandoData(ownerDocument);
      }
      var node;
      if (data.cache[nodeName]) {
        node = data.cache[nodeName].cloneNode();
      } else if (saveClones.test(nodeName)) {
        node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
      } else {
        node = data.createElem(nodeName);
      }
      return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
    }

    function createDocumentFragment(ownerDocument, data) {
      if (!ownerDocument) {
        ownerDocument = document;
      }
      if (supportsUnknownElements) {
        return ownerDocument.createDocumentFragment();
      }
      data = data || getExpandoData(ownerDocument);
      var clone = data.frag.cloneNode(),
        i = 0,
        elems = getElements(),
        l = elems.length;
      for (; i < l; i++) {
        clone.createElement(elems[i]);
      }
      return clone;
    }

    function shivMethods(ownerDocument, data) {
      if (!data.cache) {
        data.cache = {};
        data.createElem = ownerDocument.createElement;
        data.createFrag = ownerDocument.createDocumentFragment;
        data.frag = data.createFrag();
      }
      ownerDocument.createElement = function(nodeName) {
        if (!html5.shivMethods) {
          return data.createElem(nodeName);
        }
        return createElement(nodeName, ownerDocument, data);
      };
      ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' + 'var n=f.cloneNode(),c=n.createElement;' + 'h.shivMethods&&(' +
        getElements().join().replace(/[\w\-]+/g, function(nodeName) {
          data.createElem(nodeName);
          data.frag.createElement(nodeName);
          return 'c("' + nodeName + '")';
        }) + ');return n}')(html5, data.frag);
    }

    function shivDocument(ownerDocument) {
      if (!ownerDocument) {
        ownerDocument = document;
      }
      var data = getExpandoData(ownerDocument);
      if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
        data.hasCSS = !!addStyleSheet(ownerDocument, 'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' + 'mark{background:#FF0;color:#000}' + 'template{display:none}');
      }
      if (!supportsUnknownElements) {
        shivMethods(ownerDocument, data);
      }
      return ownerDocument;
    }
    var html5 = {
      'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video',
      'version': version,
      'shivCSS': (options.shivCSS !== false),
      'supportsUnknownElements': supportsUnknownElements,
      'shivMethods': (options.shivMethods !== false),
      'type': 'default',
      'shivDocument': shivDocument,
      createElement: createElement,
      createDocumentFragment: createDocumentFragment
    };
    window.html5 = html5;
    shivDocument(document);
  }(this, document));
  Modernizr._version = version;
  Modernizr._prefixes = prefixes;
  Modernizr._domPrefixes = domPrefixes;
  Modernizr._cssomPrefixes = cssomPrefixes;
  Modernizr.mq = testMediaQuery;
  Modernizr.hasEvent = isEventSupported;
  Modernizr.testProp = function(prop) {
    return testProps([prop]);
  };
  Modernizr.testAllProps = testPropsAll;
  Modernizr.testStyles = injectElementWithStyles;
  Modernizr.prefixed = function(prop, obj, elem) {
    if (!obj) {
      return testPropsAll(prop, 'pfx');
    } else {
      return testPropsAll(prop, obj, elem);
    }
  };
  docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') +
    (enableClasses ? ' js ' + classes.join(' ') : '');
  return Modernizr;
})(this, this.document);
(function(a, b, c) {
  function d(a) {
    return "[object Function]" == o.call(a)
  }

  function e(a) {
    return "string" == typeof a
  }

  function f() {}

  function g(a) {
    return !a || "loaded" == a || "complete" == a || "uninitialized" == a
  }

  function h() {
    var a = p.shift();
    q = 1, a ? a.t ? m(function() {
      ("c" == a.t ? B.injectCss : B.injectJs)(a.s, 0, a.a, a.x, a.e, 1)
    }, 0) : (a(), h()) : q = 0
  }

  function i(a, c, d, e, f, i, j) {
    function k(b) {
      if (!o && g(l.readyState) && (u.r = o = 1, !q && h(), l.onload = l.onreadystatechange = null, b)) {
        "img" != a && m(function() {
          t.removeChild(l)
        }, 50);
        for (var d in y[c]) y[c].hasOwnProperty(d) && y[c][d].onload()
      }
    }
    var j = j || B.errorTimeout,
      l = b.createElement(a),
      o = 0,
      r = 0,
      u = {
        t: d,
        s: c,
        e: f,
        a: i,
        x: j
      };
    1 === y[c] && (r = 1, y[c] = []), "object" == a ? l.data = c : (l.src = c, l.type = a), l.width = l.height = "0", l.onerror = l.onload = l.onreadystatechange = function() {
      k.call(this, r)
    }, p.splice(e, 0, u), "img" != a && (r || 2 === y[c] ? (t.insertBefore(l, s ? null : n), m(k, j)) : y[c].push(l))
  }

  function j(a, b, c, d, f) {
    return q = 0, b = b || "j", e(a) ? i("c" == b ? v : u, a, b, this.i++, c, d, f) : (p.splice(this.i++, 0, a), 1 == p.length && h()), this
  }

  function k() {
    var a = B;
    return a.loader = {
      load: j,
      i: 0
    }, a
  }
  var l = b.documentElement,
    m = a.setTimeout,
    n = b.getElementsByTagName("script")[0],
    o = {}.toString,
    p = [],
    q = 0,
    r = "MozAppearance" in l.style,
    s = r && !!b.createRange().compareNode,
    t = s ? l : n.parentNode,
    l = a.opera && "[object Opera]" == o.call(a.opera),
    l = !!b.attachEvent && !l,
    u = r ? "object" : l ? "script" : "img",
    v = l ? "script" : u,
    w = Array.isArray || function(a) {
      return "[object Array]" == o.call(a)
    },
    x = [],
    y = {},
    z = {
      timeout: function(a, b) {
        return b.length && (a.timeout = b[0]), a
      }
    },
    A, B;
  B = function(a) {
    function b(a) {
      var a = a.split("!"),
        b = x.length,
        c = a.pop(),
        d = a.length,
        c = {
          url: c,
          origUrl: c,
          prefixes: a
        },
        e, f, g;
      for (f = 0; f < d; f++) g = a[f].split("="), (e = z[g.shift()]) && (c = e(c, g));
      for (f = 0; f < b; f++) c = x[f](c);
      return c
    }

    function g(a, e, f, g, h) {
      var i = b(a),
        j = i.autoCallback;
      i.url.split(".").pop().split("?").shift(), i.bypass || (e && (e = d(e) ? e : e[a] || e[g] || e[a.split("/").pop().split("?")[0]]), i.instead ? i.instead(a, e, f, g, h) : (y[i.url] ? i.noexec = !0 : y[i.url] = 1, f.load(i.url, i.forceCSS || !i.forceJS && "css" == i.url.split(".").pop().split("?").shift() ? "c" : c, i.noexec, i.attrs, i.timeout), (d(e) || d(j)) && f.load(function() {
        k(), e && e(i.origUrl, h, g), j && j(i.origUrl, h, g), y[i.url] = 2
      })))
    }

    function h(a, b) {
      function c(a, c) {
        if (a) {
          if (e(a)) c || (j = function() {
            var a = [].slice.call(arguments);
            k.apply(this, a), l()
          }), g(a, j, b, 0, h);
          else if (Object(a) === a)
            for (n in m = function() {
                var b = 0,
                  c;
                for (c in a) a.hasOwnProperty(c) && b++;
                return b
              }(), a) a.hasOwnProperty(n) && (!c && !--m && (d(j) ? j = function() {
              var a = [].slice.call(arguments);
              k.apply(this, a), l()
            } : j[n] = function(a) {
              return function() {
                var b = [].slice.call(arguments);
                a && a.apply(this, b), l()
              }
            }(k[n])), g(a[n], j, b, n, h))
        } else !c && l()
      }
      var h = !!a.test,
        i = a.load || a.both,
        j = a.callback || f,
        k = j,
        l = a.complete || f,
        m, n;
      c(h ? a.yep : a.nope, !!i), i && c(i)
    }
    var i, j, l = this.yepnope.loader;
    if (e(a)) g(a, 0, l, 0);
    else if (w(a))
      for (i = 0; i < a.length; i++) j = a[i], e(j) ? g(j, 0, l, 0) : w(j) ? B(j) : Object(j) === j && h(j, l);
    else Object(a) === a && h(a, l)
  }, B.addPrefix = function(a, b) {
    z[a] = b
  }, B.addFilter = function(a) {
    x.push(a)
  }, B.errorTimeout = 1e4, null == b.readyState && b.addEventListener && (b.readyState = "loading", b.addEventListener("DOMContentLoaded", A = function() {
    b.removeEventListener("DOMContentLoaded", A, 0), b.readyState = "complete"
  }, 0)), a.yepnope = k(), a.yepnope.executeStack = h, a.yepnope.injectJs = function(a, c, d, e, i, j) {
    var k = b.createElement("script"),
      l, o, e = e || B.errorTimeout;
    k.src = a;
    for (o in d) k.setAttribute(o, d[o]);
    c = j ? h : c || f, k.onreadystatechange = k.onload = function() {
      !l && g(k.readyState) && (l = 1, c(), k.onload = k.onreadystatechange = null)
    }, m(function() {
      l || (l = 1, c(1))
    }, e), i ? k.onload() : n.parentNode.insertBefore(k, n)
  }, a.yepnope.injectCss = function(a, c, d, e, g, i) {
    var e = b.createElement("link"),
      j, c = i ? h : c || f;
    e.href = a, e.rel = "stylesheet", e.type = "text/css";
    for (j in d) e.setAttribute(j, d[j]);
    g || (n.parentNode.insertBefore(e, n), m(c, 0))
  }
})(this, document);
Modernizr.load = function() {
  yepnope.apply(window, [].slice.call(arguments, 0));
};
Modernizr.addTest('csscalc', function() {
  var prop = 'width:';
  var value = 'calc(10px);';
  var el = document.createElement('div');
  el.style.cssText = prop + Modernizr._prefixes.join(value + prop);
  return !!el.style.length;
});
Modernizr.addTest('regions', function() {
  var flowFromProperty = Modernizr.prefixed("flowFrom"),
    flowIntoProperty = Modernizr.prefixed("flowInto");
  if (!flowFromProperty || !flowIntoProperty) {
    return false;
  }
  var container = document.createElement('div'),
    content = document.createElement('div'),
    region = document.createElement('div'),
    flowName = 'modernizr_flow_for_regions_check';
  content.innerText = 'M';
  container.style.cssText = 'top: 150px; left: 150px; padding: 0px;';
  region.style.cssText = 'width: 50px; height: 50px; padding: 42px;';
  region.style[flowFromProperty] = flowName;
  container.appendChild(content);
  container.appendChild(region);
  document.documentElement.appendChild(container);
  var flowedRect, delta, plainRect = content.getBoundingClientRect();
  content.style[flowIntoProperty] = flowName;
  flowedRect = content.getBoundingClientRect();
  delta = flowedRect.left - plainRect.left;
  document.documentElement.removeChild(container);
  content = region = container = undefined;
  return (delta == 42);
});
Modernizr.addTest('cssfilters', function() {
  var el = document.createElement('div');
  el.style.cssText = Modernizr._prefixes.join('filter' + ':blur(2px); ');
  return !!el.style.length && ((document.documentMode === undefined || document.documentMode > 9));
});
(function() {
  if (!document.body) {
    window.console && console.warn('document.body doesn\'t exist. Modernizr hyphens test needs it.');
    return;
  }

  function test_hyphens_css() {
    try {
      var div = document.createElement('div'),
        span = document.createElement('span'),
        divStyle = div.style,
        spanHeight = 0,
        spanWidth = 0,
        result = false,
        firstChild = document.body.firstElementChild || document.body.firstChild;
      div.appendChild(span);
      span.innerHTML = 'Bacon ipsum dolor sit amet jerky velit in culpa hamburger et. Laborum dolor proident, enim dolore duis commodo et strip steak. Salami anim et, veniam consectetur dolore qui tenderloin jowl velit sirloin. Et ad culpa, fatback cillum jowl ball tip ham hock nulla short ribs pariatur aute. Pig pancetta ham bresaola, ut boudin nostrud commodo flank esse cow tongue culpa. Pork belly bresaola enim pig, ea consectetur nisi. Fugiat officia turkey, ea cow jowl pariatur ullamco proident do laborum velit sausage. Magna biltong sint tri-tip commodo sed bacon, esse proident aliquip. Ullamco ham sint fugiat, velit in enim sed mollit nulla cow ut adipisicing nostrud consectetur. Proident dolore beef ribs, laborum nostrud meatball ea laboris rump cupidatat labore culpa. Shankle minim beef, velit sint cupidatat fugiat tenderloin pig et ball tip. Ut cow fatback salami, bacon ball tip et in shank strip steak bresaola. In ut pork belly sed mollit tri-tip magna culpa veniam, short ribs qui in andouille ham consequat. Dolore bacon t-bone, velit short ribs enim strip steak nulla. Voluptate labore ut, biltong swine irure jerky. Cupidatat excepteur aliquip salami dolore. Ball tip strip steak in pork dolor. Ad in esse biltong. Dolore tenderloin exercitation ad pork loin t-bone, dolore in chicken ball tip qui pig. Ut culpa tongue, sint ribeye dolore ex shank voluptate hamburger. Jowl et tempor, boudin pork chop labore ham hock drumstick consectetur tri-tip elit swine meatball chicken ground round. Proident shankle mollit dolore. Shoulder ut duis t-bone quis reprehenderit. Meatloaf dolore minim strip steak, laboris ea aute bacon beef ribs elit shank in veniam drumstick qui. Ex laboris meatball cow tongue pork belly. Ea ball tip reprehenderit pig, sed fatback boudin dolore flank aliquip laboris eu quis. Beef ribs duis beef, cow corned beef adipisicing commodo nisi deserunt exercitation. Cillum dolor t-bone spare ribs, ham hock est sirloin. Brisket irure meatloaf in, boudin pork belly sirloin ball tip. Sirloin sint irure nisi nostrud aliqua. Nostrud nulla aute, enim officia culpa ham hock. Aliqua reprehenderit dolore sunt nostrud sausage, ea boudin pork loin ut t-bone ham tempor. Tri-tip et pancetta drumstick laborum. Ham hock magna do nostrud in proident. Ex ground round fatback, venison non ribeye in.';
      document.body.insertBefore(div, firstChild);
      divStyle.cssText = 'position:absolute;top:0;left:0;width:5em;text-align:justify;text-justification:newspaper;';
      spanHeight = span.offsetHeight;
      spanWidth = span.offsetWidth;
      divStyle.cssText = 'position:absolute;top:0;left:0;width:5em;text-align:justify;' + 'text-justification:newspaper;' +
        Modernizr._prefixes.join('hyphens:auto; ');
      result = (span.offsetHeight != spanHeight || span.offsetWidth != spanWidth);
      document.body.removeChild(div);
      div.removeChild(span);
      return result;
    } catch (e) {
      return false;
    }
  }

  function test_hyphens(delimiter, testWidth) {
    try {
      var div = document.createElement('div'),
        span = document.createElement('span'),
        divStyle = div.style,
        spanSize = 0,
        result = false,
        result1 = false,
        result2 = false,
        firstChild = document.body.firstElementChild || document.body.firstChild;
      divStyle.cssText = 'position:absolute;top:0;left:0;overflow:visible;width:1.25em;';
      div.appendChild(span);
      document.body.insertBefore(div, firstChild);
      span.innerHTML = 'mm';
      spanSize = span.offsetHeight;
      span.innerHTML = 'm' + delimiter + 'm';
      result1 = (span.offsetHeight > spanSize);
      if (testWidth) {
        span.innerHTML = 'm<br />m';
        spanSize = span.offsetWidth;
        span.innerHTML = 'm' + delimiter + 'm';
        result2 = (span.offsetWidth > spanSize);
      } else {
        result2 = true;
      }
      if (result1 === true && result2 === true) {
        result = true;
      }
      document.body.removeChild(div);
      div.removeChild(span);
      return result;
    } catch (e) {
      return false;
    }
  }

  function test_hyphens_find(delimiter) {
    try {
      var dummy = document.createElement('input'),
        div = document.createElement('div'),
        testword = 'lebowski',
        result = false,
        textrange, firstChild = document.body.firstElementChild || document.body.firstChild;
      div.innerHTML = testword + delimiter + testword;
      document.body.insertBefore(div, firstChild);
      document.body.insertBefore(dummy, div);
      if (dummy.setSelectionRange) {
        dummy.focus();
        dummy.setSelectionRange(0, 0);
      } else if (dummy.createTextRange) {
        textrange = dummy.createTextRange();
        textrange.collapse(true);
        textrange.moveEnd('character', 0);
        textrange.moveStart('character', 0);
        textrange.select();
      }
      if (window.find) {
        result = window.find(testword + testword);
      } else {
        try {
          textrange = window.self.document.body.createTextRange();
          result = textrange.findText(testword + testword);
        } catch (e) {
          result = false;
        }
      }
      document.body.removeChild(div);
      document.body.removeChild(dummy);
      return result;
    } catch (e) {
      return false;
    }
  }
  Modernizr.addTest("csshyphens", function() {
    if (!Modernizr.testAllProps('hyphens')) return false;
    try {
      return test_hyphens_css();
    } catch (e) {
      return false;
    }
  });
  Modernizr.addTest("softhyphens", function() {
    try {
      return test_hyphens('&#173;', true) && test_hyphens('&#8203;', false);
    } catch (e) {
      return false;
    }
  });
  Modernizr.addTest("softhyphensfind", function() {
    try {
      return test_hyphens_find('&#173;') && test_hyphens_find('&#8203;');
    } catch (e) {
      return false;
    }
  });
})();
Modernizr.addTest('csspositionsticky', function() {
  var prop = 'position:';
  var value = 'sticky';
  var el = document.createElement('modernizr');
  var mStyle = el.style;
  mStyle.cssText = prop + Modernizr._prefixes.join(value + ';' + prop).slice(0, -prop.length);
  return mStyle.position.indexOf(value) !== -1;
});
Modernizr.addTest('pointerevents', function() {
  var element = document.createElement('x'),
    documentElement = document.documentElement,
    getComputedStyle = window.getComputedStyle,
    supports;
  if (!('pointerEvents' in element.style)) {
    return false;
  }
  element.style.pointerEvents = 'auto';
  element.style.pointerEvents = 'x';
  documentElement.appendChild(element);
  supports = getComputedStyle && getComputedStyle(element, '').pointerEvents === 'auto';
  documentElement.removeChild(element);
  return !!supports;
});
Modernizr.addTest("supports", "CSSSupportsRule" in window);
Modernizr.addTest('cssvhunit', function() {
  var bool;
  Modernizr.testStyles("#modernizr { height: 50vh; }", function(elem, rule) {
    var height = parseInt(window.innerHeight / 2, 10),
      compStyle = parseInt((window.getComputedStyle ? getComputedStyle(elem, null) : elem.currentStyle)["height"], 10);
    bool = (compStyle == height);
  });
  return bool;
});
Modernizr.addTest('cssvmaxunit', function() {
  var bool;
  Modernizr.testStyles("#modernizr { width: 50vmax; }", function(elem, rule) {
    var one_vw = window.innerWidth / 100,
      one_vh = window.innerHeight / 100,
      compWidth = parseInt((window.getComputedStyle ? getComputedStyle(elem, null) : elem.currentStyle)['width'], 10);
    bool = (parseInt(Math.max(one_vw, one_vh) * 50, 10) == compWidth);
  });
  return bool;
});
Modernizr.addTest('cssvminunit', function() {
  var bool;
  Modernizr.testStyles("#modernizr { width: 50vmin; }", function(elem, rule) {
    var one_vw = window.innerWidth / 100,
      one_vh = window.innerHeight / 100,
      compWidth = parseInt((window.getComputedStyle ? getComputedStyle(elem, null) : elem.currentStyle)['width'], 10);
    bool = (parseInt(Math.min(one_vw, one_vh) * 50, 10) == compWidth);
  });
  return bool;
});
Modernizr.addTest('cssvwunit', function() {
  var bool;
  Modernizr.testStyles("#modernizr { width: 50vw; }", function(elem, rule) {
    var width = parseInt(window.innerWidth / 2, 10),
      compStyle = parseInt((window.getComputedStyle ? getComputedStyle(elem, null) : elem.currentStyle)["width"], 10);
    bool = (compStyle == width);
  });
  return bool;
});
Modernizr.addTest("progressbar", function() {
  return document.createElement('progress').max !== undefined;
});
Modernizr.addTest("meter", function() {
  return document.createElement('meter').max !== undefined;
});
Modernizr.addTest('emoji', function() {
  if (!Modernizr.canvastext) return false;
  var node = document.createElement('canvas'),
    ctx = node.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '32px Arial';
  ctx.fillText('\ud83d\ude03', 0, 0);
  return ctx.getImageData(16, 16, 1, 1).data[0] !== 0;
});
Modernizr.addTest('filereader', function() {
  return !!(window.File && window.FileList && window.FileReader);
});
Modernizr.addTest("formattribute", function() {
  var form = document.createElement("form"),
    input = document.createElement("input"),
    div = document.createElement("div"),
    id = "formtest" + (new Date().getTime()),
    attr, bool = false;
  form.id = id;
  if (document.createAttribute) {
    attr = document.createAttribute("form");
    attr.nodeValue = id;
    input.setAttributeNode(attr);
    div.appendChild(form);
    div.appendChild(input);
    document.documentElement.appendChild(div);
    bool = form.elements.length === 1 && input.form == form;
    div.parentNode.removeChild(div);
  }
  return bool;
});
Modernizr.addTest('fileinput', function() {
  var elem = document.createElement('input');
  elem.type = 'file';
  return !elem.disabled;
});
Modernizr.addTest('filesystem', !!Modernizr.prefixed('requestFileSystem', window));
Modernizr.addTest('placeholder', function() {
  return !!('placeholder' in (Modernizr.input || document.createElement('input')) && 'placeholder' in (Modernizr.textarea || document.createElement('textarea')));
});
(function(document, Modernizr) {
  Modernizr.formvalidationapi = false;
  Modernizr.formvalidationmessage = false;
  Modernizr.addTest('formvalidation', function() {
    var form = document.createElement('form');
    if (!('checkValidity' in form)) {
      return false;
    }
    var body = document.body,
      html = document.documentElement,
      bodyFaked = false,
      invaildFired = false,
      input;
    Modernizr.formvalidationapi = true;
    form.onsubmit = function(e) {
      if (!window.opera) {
        e.preventDefault();
      }
      e.stopPropagation();
    };
    form.innerHTML = '<input name="modTest" required><button></button>';
    form.style.position = 'absolute';
    form.style.top = '-99999em';
    if (!body) {
      bodyFaked = true;
      body = document.createElement('body');
      body.style.background = "";
      html.appendChild(body);
    }
    body.appendChild(form);
    input = form.getElementsByTagName('input')[0];
    input.oninvalid = function(e) {
      invaildFired = true;
      e.preventDefault();
      e.stopPropagation();
    };
    Modernizr.formvalidationmessage = !!input.validationMessage;
    form.getElementsByTagName('button')[0].click();
    body.removeChild(form);
    bodyFaked && html.removeChild(body);
    return invaildFired;
  });
})(document, window.Modernizr);
Modernizr.addTest('svgfilters', function() {
  var result = false;
  try {
    result = typeof SVGFEColorMatrixElement !== undefined && SVGFEColorMatrixElement.SVG_FECOLORMATRIX_TYPE_SATURATE == 2;
  } catch (e) {}
  return result;
});; + function($) {
  "use strict";

  function transitionEnd() {
    var el = document.createElement('bootstrap')
    var transEndEventNames = {
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'transitionend',
      'OTransition': 'oTransitionEnd otransitionend',
      'transition': 'transitionend'
    }
    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return {
          end: transEndEventNames[name]
        }
      }
    }
  }
  $.fn.emulateTransitionEnd = function(duration) {
    var called = false,
      $el = this
    $(this).one($.support.transition.end, function() {
      called = true
    })
    var callback = function() {
      if (!called) $($el).trigger($.support.transition.end)
    }
    setTimeout(callback, duration)
    return this
  }
  $(function() {
    $.support.transition = transitionEnd()
  })
}(jQuery); + function($) {
  "use strict";
  var Collapse = function(element, options) {
    this.$element = $(element)
    this.options = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null
    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }
  Collapse.DEFAULTS = {
    toggle: true
  }
  Collapse.prototype.dimension = function() {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }
  Collapse.prototype.show = function() {
    if (this.transitioning || this.$element.hasClass('in')) return
    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return
    var actives = this.$parent && this.$parent.find('> .panel > .in')
    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }
    var dimension = this.dimension()
    this.$element.removeClass('collapse').addClass('collapsing')[dimension](0)
    this.transitioning = 1
    var complete = function() {
      this.$element.removeClass('collapsing').addClass('in')[dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }
    if (!$.support.transition) return complete.call(this)
    var scrollSize = $.camelCase(['scroll', dimension].join('-'))
    this.$element.one($.support.transition.end, $.proxy(complete, this)).emulateTransitionEnd(350)[dimension](this.$element[0][scrollSize])
  }
  Collapse.prototype.hide = function() {
    if (this.transitioning || !this.$element.hasClass('in')) return
    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return
    var dimension = this.dimension()
    this.$element[dimension](this.$element[dimension]())[0].offsetHeight
    this.$element.addClass('collapsing').removeClass('collapse').removeClass('in')
    this.transitioning = 1
    var complete = function() {
      this.transitioning = 0
      this.$element.trigger('hidden.bs.collapse').removeClass('collapsing').addClass('collapse')
    }
    if (!$.support.transition) return complete.call(this)
    this.$element[dimension](0).one($.support.transition.end, $.proxy(complete, this)).emulateTransitionEnd(350)
  }
  Collapse.prototype.toggle = function() {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }
  var old = $.fn.collapse
  $.fn.collapse = function(option) {
    return this.each(function() {
      var $this = $(this)
      var data = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }
  $.fn.collapse.Constructor = Collapse
  $.fn.collapse.noConflict = function() {
    $.fn.collapse = old
    return this
  }
  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function(e) {
    var $this = $(this),
      href
    var target = $this.attr('data-target') || e.preventDefault() || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')
    var $target = $(target)
    var data = $target.data('bs.collapse')
    var option = data ? 'toggle' : $this.data()
    var parent = $this.attr('data-parent')
    var $parent = parent && $(parent)
    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }
    $target.collapse(option)
  })
}(jQuery); + function($) {
  "use strict";
  var Modal = function(element, options) {
    this.options = options
    this.$element = $(element)
    this.$backdrop = this.isShown = null
    if (this.options.remote) this.$element.load(this.options.remote)
  }
  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }
  Modal.prototype.toggle = function(_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }
  Modal.prototype.show = function(_relatedTarget) {
    var that = this
    var e = $.Event('show.bs.modal', {
      relatedTarget: _relatedTarget
    })
    this.$element.trigger(e)
    if (this.isShown || e.isDefaultPrevented()) return
    this.isShown = true
    this.escape()
    this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))
    this.backdrop(function() {
      var transition = $.support.transition && that.$element.hasClass('fade')
      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body)
      }
      that.$element.show()
      if (transition) {
        that.$element[0].offsetWidth
      }
      that.$element.addClass('in').attr('aria-hidden', false)
      that.enforceFocus()
      var e = $.Event('shown.bs.modal', {
        relatedTarget: _relatedTarget
      })
      transition ? that.$element.find('.modal-dialog').one($.support.transition.end, function() {
        that.$element.focus().trigger(e)
      }).emulateTransitionEnd(300) : that.$element.focus().trigger(e)
    })
  }
  Modal.prototype.hide = function(e) {
    if (e) e.preventDefault()
    e = $.Event('hide.bs.modal')
    this.$element.trigger(e)
    if (!this.isShown || e.isDefaultPrevented()) return
    this.isShown = false
    this.escape()
    $(document).off('focusin.bs.modal')
    this.$element.removeClass('in').attr('aria-hidden', true).off('click.dismiss.modal')
    $.support.transition && this.$element.hasClass('fade') ? this.$element.one($.support.transition.end, $.proxy(this.hideModal, this)).emulateTransitionEnd(300) : this.hideModal()
  }
  Modal.prototype.enforceFocus = function() {
    $(document).off('focusin.bs.modal').on('focusin.bs.modal', $.proxy(function(e) {
      if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
        this.$element.focus()
      }
    }, this))
  }
  Modal.prototype.escape = function() {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function(e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }
  Modal.prototype.hideModal = function() {
    var that = this
    this.$element.hide()
    this.backdrop(function() {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }
  Modal.prototype.removeBackdrop = function() {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }
  Modal.prototype.backdrop = function(callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''
    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate
      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />').appendTo(document.body)
      this.$element.on('click.dismiss.modal', $.proxy(function(e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static' ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this)
      }, this))
      if (doAnimate) this.$backdrop[0].offsetWidth
      this.$backdrop.addClass('in')
      if (!callback) return
      doAnimate ? this.$backdrop.one($.support.transition.end, callback).emulateTransitionEnd(150) : callback()
    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')
      $.support.transition && this.$element.hasClass('fade') ? this.$backdrop.one($.support.transition.end, callback).emulateTransitionEnd(150) : callback()
    } else if (callback) {
      callback()
    }
  }
  var old = $.fn.modal
  $.fn.modal = function(option, _relatedTarget) {
    return this.each(function() {
      var $this = $(this)
      var data = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }
  $.fn.modal.Constructor = Modal
  $.fn.modal.noConflict = function() {
    $.fn.modal = old
    return this
  }
  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function(e) {
    var $this = $(this)
    var href = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, '')))
    var option = $target.data('modal') ? 'toggle' : $.extend({
      remote: !/#/.test(href) && href
    }, $target.data(), $this.data())
    e.preventDefault()
    $target.modal(option, this).one('hide', function() {
      $this.is(':visible') && $this.focus()
    })
  })
  $(document).on('show.bs.modal', '.modal', function() {
    $(document.body).addClass('modal-open')
  }).on('hidden.bs.modal', '.modal', function() {
    $(document.body).removeClass('modal-open')
  })
}(jQuery); + function($) {
  "use strict";
  var backdrop = '.dropdown-backdrop'
  var toggle = '[data-toggle=dropdown]'
  var Dropdown = function(element) {
    var $el = $(element).on('click.bs.dropdown', this.toggle)
  }
  Dropdown.prototype.toggle = function(e) {
    var $this = $(this)
    if ($this.is('.disabled, :disabled')) return
    var $parent = getParent($this)
    var isActive = $parent.hasClass('open')
    clearMenus()
    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }
      $parent.trigger(e = $.Event('show.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.toggleClass('open').trigger('shown.bs.dropdown')
      $this.focus()
    }
    return false
  }
  Dropdown.prototype.keydown = function(e) {
    if (!/(38|40|27)/.test(e.keyCode)) return
    var $this = $(this)
    e.preventDefault()
    e.stopPropagation()
    if ($this.is('.disabled, :disabled')) return
    var $parent = getParent($this)
    var isActive = $parent.hasClass('open')
    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }
    var $items = $('[role=menu] li:not(.divider):visible a', $parent)
    if (!$items.length) return
    var index = $items.index($items.filter(':focus'))
    if (e.keyCode == 38 && index > 0) index--
      if (e.keyCode == 40 && index < $items.length - 1) index++
        if (!~index) index = 0
    $items.eq(index).focus()
  }

  function clearMenus() {
    $(backdrop).remove()
    $(toggle).each(function(e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')
    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '')
    }
    var $parent = selector && $(selector)
    return $parent && $parent.length ? $parent : $this.parent()
  }
  var old = $.fn.dropdown
  $.fn.dropdown = function(option) {
    return this.each(function() {
      var $this = $(this)
      var data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }
  $.fn.dropdown.Constructor = Dropdown
  $.fn.dropdown.noConflict = function() {
    $.fn.dropdown = old
    return this
  }
  $(document).on('click.bs.dropdown.data-api', clearMenus).on('click.bs.dropdown.data-api', '.dropdown form', function(e) {
    e.stopPropagation()
  }).on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle).on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]', Dropdown.prototype.keydown)
}(jQuery); + function($) {
  "use strict";
  var Tooltip = function(element, options) {
    this.type = this.options = this.enabled = this.timeout = this.hoverState = this.$element = null
    this.init('tooltip', element, options)
  }
  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false
  }
  Tooltip.prototype.init = function(type, element, options) {
    this.enabled = true
    this.type = type
    this.$element = $(element)
    this.options = this.getOptions(options)
    var triggers = this.options.trigger.split(' ')
    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]
      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'
        this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }
    this.options.selector ? (this._options = $.extend({}, this.options, {
      trigger: 'manual',
      selector: ''
    })) : this.fixTitle()
  }
  Tooltip.prototype.getDefaults = function() {
    return Tooltip.DEFAULTS
  }
  Tooltip.prototype.getOptions = function(options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)
    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }
    return options
  }
  Tooltip.prototype.getDelegateOptions = function() {
    var options = {}
    var defaults = this.getDefaults()
    this._options && $.each(this._options, function(key, value) {
      if (defaults[key] != value) options[key] = value
    })
    return options
  }
  Tooltip.prototype.enter = function(obj) {
    var self = obj instanceof this.constructor ? obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)
    clearTimeout(self.timeout)
    self.hoverState = 'in'
    if (!self.options.delay || !self.options.delay.show) return self.show()
    self.timeout = setTimeout(function() {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }
  Tooltip.prototype.leave = function(obj) {
    var self = obj instanceof this.constructor ? obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)
    clearTimeout(self.timeout)
    self.hoverState = 'out'
    if (!self.options.delay || !self.options.delay.hide) return self.hide()
    self.timeout = setTimeout(function() {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }
  Tooltip.prototype.show = function() {
    var e = $.Event('show.bs.' + this.type)
    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      var $tip = this.tip()
      this.setContent()
      if (this.options.animation) $tip.addClass('fade')
      var placement = typeof this.options.placement == 'function' ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement
      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'
      $tip.detach().css({
        top: 0,
        left: 0,
        display: 'block'
      }).addClass(placement)
      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      var pos = this.getPosition()
      var actualWidth = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight
      if (autoPlace) {
        var $parent = this.$element.parent()
        var orgPlacement = placement
        var docScroll = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth = this.options.container == 'body' ? window.innerWidth : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft = this.options.container == 'body' ? 0 : $parent.offset().left
        placement = placement == 'bottom' && pos.top + pos.height + actualHeight - docScroll > parentHeight ? 'top' : placement == 'top' && pos.top - docScroll - actualHeight < 0 ? 'bottom' : placement == 'right' && pos.right + actualWidth > parentWidth ? 'left' : placement == 'left' && pos.left - actualWidth < parentLeft ? 'right' : placement
        $tip.removeClass(orgPlacement).addClass(placement)
      }
      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)
      this.applyPlacement(calculatedOffset, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }
  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip = this.tip()
    var width = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)
    if (isNaN(marginTop)) marginTop = 0
    if (isNaN(marginLeft)) marginLeft = 0
    offset.top = offset.top + marginTop
    offset.left = offset.left + marginLeft
    $tip.offset(offset).addClass('in')
    var actualWidth = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight
    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }
    if (/bottom|top/.test(placement)) {
      var delta = 0
      if (offset.left < 0) {
        delta = offset.left * -2
        offset.left = 0
        $tip.offset(offset)
        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }
      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }
    if (replace) $tip.offset(offset)
  }
  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }
  Tooltip.prototype.setContent = function() {
    var $tip = this.tip()
    var title = this.getTitle()
    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }
  Tooltip.prototype.hide = function() {
    var that = this
    var $tip = this.tip()
    var e = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
    }
    this.$element.trigger(e)
    if (e.isDefaultPrevented()) return
    $tip.removeClass('in')
    $.support.transition && this.$tip.hasClass('fade') ? $tip.one($.support.transition.end, complete).emulateTransitionEnd(150) : complete()
    this.$element.trigger('hidden.bs.' + this.type)
    return this
  }
  Tooltip.prototype.fixTitle = function() {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }
  Tooltip.prototype.hasContent = function() {
    return this.getTitle()
  }
  Tooltip.prototype.getPosition = function() {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth,
      height: el.offsetHeight
    }, this.$element.offset())
  }
  Tooltip.prototype.getCalculatedOffset = function(placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? {
      top: pos.top + pos.height,
      left: pos.left + pos.width / 2 - actualWidth / 2
    } : placement == 'top' ? {
      top: pos.top - actualHeight,
      left: pos.left + pos.width / 2 - actualWidth / 2
    } : placement == 'left' ? {
      top: pos.top + pos.height / 2 - actualHeight / 2,
      left: pos.left - actualWidth
    } : {
      top: pos.top + pos.height / 2 - actualHeight / 2,
      left: pos.left + pos.width
    }
  }
  Tooltip.prototype.getTitle = function() {
    var title
    var $e = this.$element
    var o = this.options
    title = $e.attr('data-original-title') || (typeof o.title == 'function' ? o.title.call($e[0]) : o.title)
    return title
  }
  Tooltip.prototype.tip = function() {
    return this.$tip = this.$tip || $(this.options.template)
  }
  Tooltip.prototype.arrow = function() {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }
  Tooltip.prototype.validate = function() {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options = null
    }
  }
  Tooltip.prototype.enable = function() {
    this.enabled = true
  }
  Tooltip.prototype.disable = function() {
    this.enabled = false
  }
  Tooltip.prototype.toggleEnabled = function() {
    this.enabled = !this.enabled
  }
  Tooltip.prototype.toggle = function(e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }
  Tooltip.prototype.destroy = function() {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }
  var old = $.fn.tooltip
  $.fn.tooltip = function(option) {
    return this.each(function() {
      var $this = $(this)
      var data = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }
  $.fn.tooltip.Constructor = Tooltip
  $.fn.tooltip.noConflict = function() {
    $.fn.tooltip = old
    return this
  }
}(jQuery);
(function() {
  var $, cardFromNumber, cardFromType, cards, defaultFormat, formatBackCardNumber, formatBackExpiry, formatCardNumber, formatExpiry, formatForwardExpiry, formatForwardSlash, hasTextSelected, luhnCheck, reFormatCardNumber, restrictCVC, restrictCardNumber, restrictExpiry, restrictNumeric, setCardType, __slice = [].slice,
    __indexOf = [].indexOf || function(item) {
      for (var i = 0, l = this.length; i < l; i++) {
        if (i in this && this[i] === item) return i;
      }
      return -1;
    },
    _this = this;
  $ = jQuery;
  $.payment = {};
  $.payment.fn = {};
  $.fn.payment = function() {
    var args, method;
    method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return $.payment.fn[method].apply(this, args);
  };
  defaultFormat = /(\d{1,4})/g;
  cards = [{
    type: 'maestro',
    pattern: /^(5018|5020|5038|6304|6759|676[1-3])/,
    format: defaultFormat,
    length: [12, 13, 14, 15, 16, 17, 18, 19],
    cvcLength: [3],
    luhn: true
  }, {
    type: 'dinersclub',
    pattern: /^(36|38|30[0-5])/,
    format: defaultFormat,
    length: [14],
    cvcLength: [3],
    luhn: true
  }, {
    type: 'laser',
    pattern: /^(6706|6771|6709)/,
    format: defaultFormat,
    length: [16, 17, 18, 19],
    cvcLength: [3],
    luhn: true
  }, {
    type: 'jcb',
    pattern: /^35/,
    format: defaultFormat,
    length: [16],
    cvcLength: [3],
    luhn: true
  }, {
    type: 'unionpay',
    pattern: /^62/,
    format: defaultFormat,
    length: [16, 17, 18, 19],
    cvcLength: [3],
    luhn: false
  }, {
    type: 'discover',
    pattern: /^(6011|65|64[4-9]|622)/,
    format: defaultFormat,
    length: [16],
    cvcLength: [3],
    luhn: true
  }, {
    type: 'mastercard',
    pattern: /^5[1-5]/,
    format: defaultFormat,
    length: [16],
    cvcLength: [3],
    luhn: true
  }, {
    type: 'amex',
    pattern: /^3[47]/,
    format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
    length: [15],
    cvcLength: [3, 4],
    luhn: true
  }, {
    type: 'visa',
    pattern: /^4/,
    format: defaultFormat,
    length: [13, 14, 15, 16],
    cvcLength: [3],
    luhn: true
  }];
  cardFromNumber = function(num) {
    var card, _i, _len;
    num = (num + '').replace(/\D/g, '');
    for (_i = 0, _len = cards.length; _i < _len; _i++) {
      card = cards[_i];
      if (card.pattern.test(num)) {
        return card;
      }
    }
  };
  cardFromType = function(type) {
    var card, _i, _len;
    for (_i = 0, _len = cards.length; _i < _len; _i++) {
      card = cards[_i];
      if (card.type === type) {
        return card;
      }
    }
  };
  luhnCheck = function(num) {
    var digit, digits, odd, sum, _i, _len;
    odd = true;
    sum = 0;
    digits = (num + '').split('').reverse();
    for (_i = 0, _len = digits.length; _i < _len; _i++) {
      digit = digits[_i];
      digit = parseInt(digit, 10);
      if ((odd = !odd)) {
        digit *= 2;
      }
      if (digit > 9) {
        digit -= 9;
      }
      sum += digit;
    }
    return sum % 10 === 0;
  };
  hasTextSelected = function($target) {
    var _ref;
    if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== $target.prop('selectionEnd')) {
      return true;
    }
    if (typeof document !== "undefined" && document !== null ? (_ref = document.selection) != null ? typeof _ref.createRange === "function" ? _ref.createRange().text : void 0 : void 0 : void 0) {
      return true;
    }
    return false;
  };
  reFormatCardNumber = function(e) {
    var _this = this;
    return setTimeout(function() {
      var $target, value;
      $target = $(e.currentTarget);
      value = $target.val();
      value = $.payment.formatCardNumber(value);
      return $target.val(value);
    });
  };
  formatCardNumber = function(e) {
    var $target, card, digit, length, re, upperLength, value;
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    $target = $(e.currentTarget);
    value = $target.val();
    card = cardFromNumber(value + digit);
    length = (value.replace(/\D/g, '') + digit).length;
    upperLength = 16;
    if (card) {
      upperLength = card.length[card.length.length - 1];
    }
    if (length >= upperLength) {
      return;
    }
    if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== value.length) {
      return;
    }
    if (card && card.type === 'amex') {
      re = /^(\d{4}|\d{4}\s\d{6})$/;
    } else {
      re = /(?:^|\s)(\d{4})$/;
    }
    if (re.test(value)) {
      e.preventDefault();
      return $target.val(value + ' ' + digit);
    } else if (re.test(value + digit)) {
      e.preventDefault();
      return $target.val(value + digit + ' ');
    }
  };
  formatBackCardNumber = function(e) {
    var $target, value;
    $target = $(e.currentTarget);
    value = $target.val();
    if (e.meta) {
      return;
    }
    if (e.which !== 8) {
      return;
    }
    if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== value.length) {
      return;
    }
    if (/\d\s$/.test(value)) {
      e.preventDefault();
      return $target.val(value.replace(/\d\s$/, ''));
    } else if (/\s\d?$/.test(value)) {
      e.preventDefault();
      return $target.val(value.replace(/\s\d?$/, ''));
    }
  };
  formatExpiry = function(e) {
    var $target, digit, val;
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    $target = $(e.currentTarget);
    val = $target.val() + digit;
    if (/^\d$/.test(val) && (val !== '0' && val !== '1')) {
      e.preventDefault();
      return $target.val("0" + val + " / ");
    } else if (/^\d\d$/.test(val)) {
      e.preventDefault();
      return $target.val("" + val + " / ");
    }
  };
  formatForwardExpiry = function(e) {
    var $target, digit, val;
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    $target = $(e.currentTarget);
    val = $target.val();
    if (/^\d\d$/.test(val)) {
      return $target.val("" + val + " / ");
    }
  };
  formatForwardSlash = function(e) {
    var $target, slash, val;
    slash = String.fromCharCode(e.which);
    if (slash !== '/') {
      return;
    }
    $target = $(e.currentTarget);
    val = $target.val();
    if (/^\d$/.test(val) && val !== '0') {
      return $target.val("0" + val + " / ");
    }
  };
  formatBackExpiry = function(e) {
    var $target, value;
    if (e.meta) {
      return;
    }
    $target = $(e.currentTarget);
    value = $target.val();
    if (e.which !== 8) {
      return;
    }
    if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== value.length) {
      return;
    }
    if (/\d(\s|\/)+$/.test(value)) {
      e.preventDefault();
      return $target.val(value.replace(/\d(\s|\/)*$/, ''));
    } else if (/\s\/\s?\d?$/.test(value)) {
      e.preventDefault();
      return $target.val(value.replace(/\s\/\s?\d?$/, ''));
    }
  };
  restrictNumeric = function(e) {
    var input;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
      return false;
    }
    if (e.which === 0) {
      return true;
    }
    if (e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);
    return !!/[\d\s]/.test(input);
  };
  restrictCardNumber = function(e) {
    var $target, card, digit, value;
    $target = $(e.currentTarget);
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    if (hasTextSelected($target)) {
      return;
    }
    value = ($target.val() + digit).replace(/\D/g, '');
    card = cardFromNumber(value);
    if (card) {
      return value.length <= card.length[card.length.length - 1];
    } else {
      return value.length <= 16;
    }
  };
  restrictExpiry = function(e) {
    var $target, digit, value;
    $target = $(e.currentTarget);
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    if (hasTextSelected($target)) {
      return;
    }
    value = $target.val() + digit;
    value = value.replace(/\D/g, '');
    if (value.length > 6) {
      return false;
    }
  };
  restrictCVC = function(e) {
    var $target, digit, val;
    $target = $(e.currentTarget);
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    if (hasTextSelected($target)) {
      return;
    }
    val = $target.val() + digit;
    return val.length <= 4;
  };
  setCardType = function(e) {
    var $target, allTypes, card, cardType, val;
    $target = $(e.currentTarget);
    val = $target.val();
    cardType = $.payment.cardType(val) || 'unknown';
    if (!$target.hasClass(cardType)) {
      allTypes = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = cards.length; _i < _len; _i++) {
          card = cards[_i];
          _results.push(card.type);
        }
        return _results;
      })();
      $target.removeClass('unknown');
      $target.removeClass(allTypes.join(' '));
      $target.addClass(cardType);
      $target.toggleClass('identified', cardType !== 'unknown');
      return $target.trigger('payment.cardType', cardType);
    }
  };
  $.payment.fn.formatCardCVC = function() {
    this.payment('restrictNumeric');
    this.on('keypress', restrictCVC);
    return this;
  };
  $.payment.fn.formatCardExpiry = function() {
    this.payment('restrictNumeric');
    this.on('keypress', restrictExpiry);
    this.on('keypress', formatExpiry);
    this.on('keypress', formatForwardSlash);
    this.on('keypress', formatForwardExpiry);
    this.on('keydown', formatBackExpiry);
    return this;
  };
  $.payment.fn.formatCardNumber = function() {
    this.payment('restrictNumeric');
    this.on('keypress', restrictCardNumber);
    this.on('keypress', formatCardNumber);
    this.on('keydown', formatBackCardNumber);
    this.on('keyup', setCardType);
    this.on('paste', reFormatCardNumber);
    return this;
  };
  $.payment.fn.restrictNumeric = function() {
    this.on('keypress', restrictNumeric);
    return this;
  };
  $.payment.fn.cardExpiryVal = function() {
    return $.payment.cardExpiryVal($(this).val());
  };
  $.payment.cardExpiryVal = function(value) {
    var month, prefix, year, _ref;
    value = value.replace(/\s/g, '');
    _ref = value.split('/', 2), month = _ref[0], year = _ref[1];
    if ((year != null ? year.length : void 0) === 2 && /^\d+$/.test(year)) {
      prefix = (new Date).getFullYear();
      prefix = prefix.toString().slice(0, 2);
      year = prefix + year;
    }
    month = parseInt(month, 10);
    year = parseInt(year, 10);
    return {
      month: month,
      year: year
    };
  };
  $.payment.validateCardNumber = function(num) {
    var card, _ref;
    num = (num + '').replace(/\s+|-/g, '');
    if (!/^\d+$/.test(num)) {
      return false;
    }
    card = cardFromNumber(num);
    if (!card) {
      return false;
    }
    return (_ref = num.length, __indexOf.call(card.length, _ref) >= 0) && (card.luhn === false || luhnCheck(num));
  };
  $.payment.validateCardExpiry = function(month, year) {
    var currentTime, expiry, prefix, _ref;
    if (typeof month === 'object' && 'month' in month) {
      _ref = month, month = _ref.month, year = _ref.year;
    }
    if (!(month && year)) {
      return false;
    }
    month = $.trim(month);
    year = $.trim(year);
    if (!/^\d+$/.test(month)) {
      return false;
    }
    if (!/^\d+$/.test(year)) {
      return false;
    }
    if (!(parseInt(month, 10) <= 12)) {
      return false;
    }
    if (year.length === 2) {
      prefix = (new Date).getFullYear();
      prefix = prefix.toString().slice(0, 2);
      year = prefix + year;
    }
    expiry = new Date(year, month);
    currentTime = new Date;
    expiry.setMonth(expiry.getMonth() - 1);
    expiry.setMonth(expiry.getMonth() + 1, 1);
    return expiry > currentTime;
  };
  $.payment.validateCardCVC = function(cvc, type) {
    var _ref, _ref1;
    cvc = $.trim(cvc);
    if (!/^\d+$/.test(cvc)) {
      return false;
    }
    if (type) {
      return _ref = cvc.length, __indexOf.call((_ref1 = cardFromType(type)) != null ? _ref1.cvcLength : void 0, _ref) >= 0;
    } else {
      return cvc.length >= 3 && cvc.length <= 4;
    }
  };
  $.payment.cardType = function(num) {
    var _ref;
    if (!num) {
      return null;
    }
    return ((_ref = cardFromNumber(num)) != null ? _ref.type : void 0) || null;
  };
  $.payment.formatCardNumber = function(num) {
    var card, groups, upperLength, _ref;
    card = cardFromNumber(num);
    if (!card) {
      return num;
    }
    upperLength = card.length[card.length.length - 1];
    num = num.replace(/\D/g, '');
    num = num.slice(0, +upperLength + 1 || 9e9);
    if (card.format.global) {
      return (_ref = num.match(card.format)) != null ? _ref.join(' ') : void 0;
    } else {
      groups = card.format.exec(num);
      if (groups != null) {
        groups.shift();
      }
      return groups != null ? groups.join(' ') : void 0;
    }
  };
}).call(this);
(function() {
  var $, AbstractChosen, Chosen, SelectParser, _ref, __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
      for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
      }

      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    };
  SelectParser = (function() {
    function SelectParser() {
      this.options_index = 0;
      this.parsed = [];
    }
    SelectParser.prototype.add_node = function(child) {
      if (child.nodeName.toUpperCase() === "OPTGROUP") {
        return this.add_group(child);
      } else {
        return this.add_option(child);
      }
    };
    SelectParser.prototype.add_group = function(group) {
      var group_position, option, _i, _len, _ref, _results;
      group_position = this.parsed.length;
      this.parsed.push({
        array_index: group_position,
        group: true,
        label: this.escapeExpression(group.label),
        children: 0,
        disabled: group.disabled
      });
      _ref = group.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        _results.push(this.add_option(option, group_position, group.disabled));
      }
      return _results;
    };
    SelectParser.prototype.add_option = function(option, group_position, group_disabled) {
      if (option.nodeName.toUpperCase() === "OPTION") {
        if (option.text !== "") {
          if (group_position != null) {
            this.parsed[group_position].children += 1;
          }
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            value: option.value,
            text: option.text,
            html: option.innerHTML,
            selected: option.selected,
            disabled: group_disabled === true ? group_disabled : option.disabled,
            group_array_index: group_position,
            classes: option.className,
            style: option.style.cssText
          });
        } else {
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            empty: true
          });
        }
        return this.options_index += 1;
      }
    };
    SelectParser.prototype.escapeExpression = function(text) {
      var map, unsafe_chars;
      if ((text == null) || text === false) {
        return "";
      }
      if (!/[\&\<\>\"\'\`]/.test(text)) {
        return text;
      }
      map = {
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "`": "&#x60;"
      };
      unsafe_chars = /&(?!\w+;)|[\<\>\"\'\`]/g;
      return text.replace(unsafe_chars, function(chr) {
        return map[chr] || "&amp;";
      });
    };
    return SelectParser;
  })();
  SelectParser.select_to_array = function(select) {
    var child, parser, _i, _len, _ref;
    parser = new SelectParser();
    _ref = select.childNodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      parser.add_node(child);
    }
    return parser.parsed;
  };
  AbstractChosen = (function() {
    function AbstractChosen(form_field, options) {
      this.form_field = form_field;
      this.options = options != null ? options : {};
      if (!AbstractChosen.browser_is_supported()) {
        return;
      }
      this.is_multiple = this.form_field.multiple;
      this.set_default_text();
      this.set_default_values();
      this.setup();
      this.set_up_html();
      this.register_observers();
    }
    AbstractChosen.prototype.set_default_values = function() {
      var _this = this;
      this.click_test_action = function(evt) {
        return _this.test_active_click(evt);
      };
      this.activate_action = function(evt) {
        return _this.activate_field(evt);
      };
      this.active_field = false;
      this.mouse_on_container = false;
      this.results_showing = false;
      this.result_highlighted = null;
      this.result_single_selected = null;
      this.allow_single_deselect = (this.options.allow_single_deselect != null) && (this.form_field.options[0] != null) && this.form_field.options[0].text === "" ? this.options.allow_single_deselect : false;
      this.disable_search_threshold = this.options.disable_search_threshold || 0;
      this.disable_search = this.options.disable_search || false;
      this.enable_split_word_search = this.options.enable_split_word_search != null ? this.options.enable_split_word_search : true;
      this.group_search = this.options.group_search != null ? this.options.group_search : true;
      this.search_contains = this.options.search_contains || false;
      this.single_backstroke_delete = this.options.single_backstroke_delete != null ? this.options.single_backstroke_delete : true;
      this.max_selected_options = this.options.max_selected_options || Infinity;
      this.inherit_select_classes = this.options.inherit_select_classes || false;
      this.display_selected_options = this.options.display_selected_options != null ? this.options.display_selected_options : true;
      return this.display_disabled_options = this.options.display_disabled_options != null ? this.options.display_disabled_options : true;
    };
    AbstractChosen.prototype.set_default_text = function() {
      if (this.form_field.getAttribute("data-placeholder")) {
        this.default_text = this.form_field.getAttribute("data-placeholder");
      } else if (this.is_multiple) {
        this.default_text = this.options.placeholder_text_multiple || this.options.placeholder_text || AbstractChosen.default_multiple_text;
      } else {
        this.default_text = this.options.placeholder_text_single || this.options.placeholder_text || AbstractChosen.default_single_text;
      }
      return this.results_none_found = this.form_field.getAttribute("data-no_results_text") || this.options.no_results_text || AbstractChosen.default_no_result_text;
    };
    AbstractChosen.prototype.mouse_enter = function() {
      return this.mouse_on_container = true;
    };
    AbstractChosen.prototype.mouse_leave = function() {
      return this.mouse_on_container = false;
    };
    AbstractChosen.prototype.input_focus = function(evt) {
      var _this = this;
      if (this.is_multiple) {
        if (!this.active_field) {
          return setTimeout((function() {
            return _this.container_mousedown();
          }), 50);
        }
      } else {
        if (!this.active_field) {
          return this.activate_field();
        }
      }
    };
    AbstractChosen.prototype.input_blur = function(evt) {
      var _this = this;
      if (!this.mouse_on_container) {
        this.active_field = false;
        return setTimeout((function() {
          return _this.blur_test();
        }), 100);
      }
    };
    AbstractChosen.prototype.results_option_build = function(options) {
      var content, data, _i, _len, _ref;
      content = '';
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        data = _ref[_i];
        if (data.group) {
          content += this.result_add_group(data);
        } else {
          content += this.result_add_option(data);
        }
        if (options != null ? options.first : void 0) {
          if (data.selected && this.is_multiple) {
            this.choice_build(data);
          } else if (data.selected && !this.is_multiple) {
            this.single_set_selected_text(data.text);
          }
        }
      }
      return content;
    };
    AbstractChosen.prototype.result_add_option = function(option) {
      var classes, style;
      if (!option.search_match) {
        return '';
      }
      if (!this.include_option_in_results(option)) {
        return '';
      }
      classes = [];
      if (!option.disabled && !(option.selected && this.is_multiple)) {
        classes.push("active-result");
      }
      if (option.disabled && !(option.selected && this.is_multiple)) {
        classes.push("disabled-result");
      }
      if (option.selected) {
        classes.push("result-selected");
      }
      if (option.group_array_index != null) {
        classes.push("group-option");
      }
      if (option.classes !== "") {
        classes.push(option.classes);
      }
      style = option.style.cssText !== "" ? " style=\"" + option.style + "\"" : "";
      return "<li class=\"" + (classes.join(' ')) + "\"" + style + " data-option-array-index=\"" + option.array_index + "\">" + option.search_text + "</li>";
    };
    AbstractChosen.prototype.result_add_group = function(group) {
      if (!(group.search_match || group.group_match)) {
        return '';
      }
      if (!(group.active_options > 0)) {
        return '';
      }
      return "<li class=\"group-result\">" + group.search_text + "</li>";
    };
    AbstractChosen.prototype.results_update_field = function() {
      this.set_default_text();
      if (!this.is_multiple) {
        this.results_reset_cleanup();
      }
      this.result_clear_highlight();
      this.result_single_selected = null;
      this.results_build();
      if (this.results_showing) {
        return this.winnow_results();
      }
    };
    AbstractChosen.prototype.results_toggle = function() {
      if (this.results_showing) {
        return this.results_hide();
      } else {
        return this.results_show();
      }
    };
    AbstractChosen.prototype.results_search = function(evt) {
      if (this.results_showing) {
        return this.winnow_results();
      } else {
        return this.results_show();
      }
    };
    AbstractChosen.prototype.winnow_results = function() {
      var escapedSearchText, option, regex, regexAnchor, results, results_group, searchText, startpos, text, zregex, _i, _len, _ref;
      this.no_results_clear();
      results = 0;
      searchText = this.get_search_text();
      escapedSearchText = searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      regexAnchor = this.search_contains ? "" : "^";
      regex = new RegExp(regexAnchor + escapedSearchText, 'i');
      zregex = new RegExp(escapedSearchText, 'i');
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        option.search_match = false;
        results_group = null;
        if (this.include_option_in_results(option)) {
          if (option.group) {
            option.group_match = false;
            option.active_options = 0;
          }
          if ((option.group_array_index != null) && this.results_data[option.group_array_index]) {
            results_group = this.results_data[option.group_array_index];
            if (results_group.active_options === 0 && results_group.search_match) {
              results += 1;
            }
            results_group.active_options += 1;
          }
          if (!(option.group && !this.group_search)) {
            option.search_text = option.group ? option.label : option.html;
            option.search_match = this.search_string_match(option.search_text, regex);
            if (option.search_match && !option.group) {
              results += 1;
            }
            if (option.search_match) {
              if (searchText.length) {
                startpos = option.search_text.search(zregex);
                text = option.search_text.substr(0, startpos + searchText.length) + '</em>' + option.search_text.substr(startpos + searchText.length);
                option.search_text = text.substr(0, startpos) + '<em>' + text.substr(startpos);
              }
              if (results_group != null) {
                results_group.group_match = true;
              }
            } else if ((option.group_array_index != null) && this.results_data[option.group_array_index].search_match) {
              option.search_match = true;
            }
          }
        }
      }
      this.result_clear_highlight();
      if (results < 1 && searchText.length) {
        this.update_results_content("");
        return this.no_results(searchText);
      } else {
        this.update_results_content(this.results_option_build());
        return this.winnow_results_set_highlight();
      }
    };
    AbstractChosen.prototype.search_string_match = function(search_string, regex) {
      var part, parts, _i, _len;
      if (regex.test(search_string)) {
        return true;
      } else if (this.enable_split_word_search && (search_string.indexOf(" ") >= 0 || search_string.indexOf("[") === 0)) {
        parts = search_string.replace(/\[|\]/g, "").split(" ");
        if (parts.length) {
          for (_i = 0, _len = parts.length; _i < _len; _i++) {
            part = parts[_i];
            if (regex.test(part)) {
              return true;
            }
          }
        }
      }
    };
    AbstractChosen.prototype.choices_count = function() {
      var option, _i, _len, _ref;
      if (this.selected_option_count != null) {
        return this.selected_option_count;
      }
      this.selected_option_count = 0;
      _ref = this.form_field.options;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        if (option.selected) {
          this.selected_option_count += 1;
        }
      }
      return this.selected_option_count;
    };
    AbstractChosen.prototype.choices_click = function(evt) {
      evt.preventDefault();
      if (!(this.results_showing || this.is_disabled)) {
        return this.results_show();
      }
    };
    AbstractChosen.prototype.keyup_checker = function(evt) {
      var stroke, _ref;
      stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
      this.search_field_scale();
      switch (stroke) {
        case 8:
          if (this.is_multiple && this.backstroke_length < 1 && this.choices_count() > 0) {
            return this.keydown_backstroke();
          } else if (!this.pending_backstroke) {
            this.result_clear_highlight();
            return this.results_search();
          }
          break;
        case 13:
          evt.preventDefault();
          if (this.results_showing) {
            return this.result_select(evt);
          }
          break;
        case 27:
          if (this.results_showing) {
            this.results_hide();
          }
          return true;
        case 9:
        case 38:
        case 40:
        case 16:
        case 91:
        case 17:
          break;
        default:
          return this.results_search();
      }
    };
    getHiddenOffsetWidth = function(el) {
      var $hiddenElement = $(el).clone().appendTo('body');
      var width = $hiddenElement.outerWidth();
      $hiddenElement.remove();
      return width;
    };
    AbstractChosen.prototype.container_width = function() {
      if (this.options.width != null) {
        return this.options.width;
      } else {
        return "" + (($(this.form_field).is(":visible")) ? this.form_field.offsetWidth : getHiddenOffsetWidth(this.form_field)) + "px";
      }
    };
    AbstractChosen.prototype.include_option_in_results = function(option) {
      if (this.is_multiple && (!this.display_selected_options && option.selected)) {
        return false;
      }
      if (!this.display_disabled_options && option.disabled) {
        return false;
      }
      if (option.empty) {
        return false;
      }
      return true;
    };
    AbstractChosen.browser_is_supported = function() {
      if (window.navigator.appName === "Microsoft Internet Explorer") {
        return document.documentMode >= 8;
      }
      if (/iP(od|hone)/i.test(window.navigator.userAgent)) {
        return false;
      }
      if (/Android/i.test(window.navigator.userAgent)) {
        if (/Mobile/i.test(window.navigator.userAgent)) {
          return false;
        }
      }
      return true;
    };
    AbstractChosen.default_multiple_text = "Select Some Options";
    AbstractChosen.default_single_text = "Select an Option";
    AbstractChosen.default_no_result_text = "No results match";
    return AbstractChosen;
  })();
  $ = jQuery;
  $.fn.extend({
    chosen: function(options) {
      if (!AbstractChosen.browser_is_supported()) {
        return this;
      }
      return this.each(function(input_field) {
        var $this, chosen;
        $this = $(this);
        chosen = $this.data('chosen');
        if (options === 'destroy' && chosen) {
          chosen.destroy();
        } else if (!chosen) {
          $this.data('chosen', new Chosen(this, options));
        }
      });
    }
  });
  Chosen = (function(_super) {
    __extends(Chosen, _super);

    function Chosen() {
      _ref = Chosen.__super__.constructor.apply(this, arguments);
      return _ref;
    }
    Chosen.prototype.setup = function() {
      this.form_field_jq = $(this.form_field);
      this.current_selectedIndex = this.form_field.selectedIndex;
      return this.is_rtl = this.form_field_jq.hasClass("chosen-rtl");
    };
    Chosen.prototype.set_up_html = function() {
      var container_classes, container_props;
      container_classes = ["chosen-container"];
      container_classes.push("chosen-container-" + (this.is_multiple ? "multi" : "single"));
      if (this.inherit_select_classes && this.form_field.className) {
        container_classes.push(this.form_field.className);
      }
      if (this.is_rtl) {
        container_classes.push("chosen-rtl");
      }
      container_props = {
        'class': container_classes.join(' '),
        'style': "width: " + (this.container_width()) + ";",
        'title': this.form_field.title
      };
      if (this.form_field.id.length) {
        container_props.id = this.form_field.id.replace(/[^\w]/g, '_') + "_chosen";
      }
      this.container = $("<div />", container_props);
      if (this.is_multiple) {
        this.container.html('<ul class="chosen-choices"><li class="search-field"><input type="text" value="' + this.default_text + '" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chosen-drop"><ul class="chosen-results"></ul></div>');
      } else {
        this.container.html('<a class="chosen-single chosen-default" tabindex="-1"><span>' + this.default_text + '</span><div><b></b></div></a><div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off" /></div><ul class="chosen-results"></ul></div>');
      }
      this.form_field_jq.hide().after(this.container);
      this.dropdown = this.container.find('div.chosen-drop').first();
      this.search_field = this.container.find('input').first();
      this.search_results = this.container.find('ul.chosen-results').first();
      this.search_field_scale();
      this.search_no_results = this.container.find('li.no-results').first();
      if (this.is_multiple) {
        this.search_choices = this.container.find('ul.chosen-choices').first();
        this.search_container = this.container.find('li.search-field').first();
      } else {
        this.search_container = this.container.find('div.chosen-search').first();
        this.selected_item = this.container.find('.chosen-single').first();
      }
      this.results_build();
      this.set_tab_index();
      this.set_label_behavior();
      return this.form_field_jq.trigger("chosen:ready", {
        chosen: this
      });
    };
    Chosen.prototype.register_observers = function() {
      var _this = this;
      this.container.bind('mousedown.chosen', function(evt) {
        _this.container_mousedown(evt);
      });
      this.container.bind('mouseup.chosen', function(evt) {
        _this.container_mouseup(evt);
      });
      this.container.bind('mouseenter.chosen', function(evt) {
        _this.mouse_enter(evt);
      });
      this.container.bind('mouseleave.chosen', function(evt) {
        _this.mouse_leave(evt);
      });
      this.search_results.bind('mouseup.chosen', function(evt) {
        _this.search_results_mouseup(evt);
      });
      this.search_results.bind('mouseover.chosen', function(evt) {
        _this.search_results_mouseover(evt);
      });
      this.search_results.bind('mouseout.chosen', function(evt) {
        _this.search_results_mouseout(evt);
      });
      this.search_results.bind('mousewheel.chosen DOMMouseScroll.chosen', function(evt) {
        _this.search_results_mousewheel(evt);
      });
      this.form_field_jq.bind("chosen:updated.chosen", function(evt) {
        _this.results_update_field(evt);
      });
      this.form_field_jq.bind("chosen:activate.chosen", function(evt) {
        _this.activate_field(evt);
      });
      this.form_field_jq.bind("chosen:open.chosen", function(evt) {
        _this.container_mousedown(evt);
      });
      this.search_field.bind('blur.chosen', function(evt) {
        _this.input_blur(evt);
      });
      this.search_field.bind('keyup.chosen', function(evt) {
        _this.keyup_checker(evt);
      });
      this.search_field.bind('keydown.chosen', function(evt) {
        _this.keydown_checker(evt);
      });
      this.search_field.bind('focus.chosen', function(evt) {
        _this.input_focus(evt);
      });
      if (this.is_multiple) {
        return this.search_choices.bind('click.chosen', function(evt) {
          _this.choices_click(evt);
        });
      } else {
        return this.container.bind('click.chosen', function(evt) {
          evt.preventDefault();
        });
      }
    };
    Chosen.prototype.destroy = function() {
      $(document).unbind("click.chosen", this.click_test_action);
      if (this.search_field[0].tabIndex) {
        this.form_field_jq[0].tabIndex = this.search_field[0].tabIndex;
      }
      this.container.remove();
      this.form_field_jq.removeData('chosen');
      return this.form_field_jq.show();
    };
    Chosen.prototype.search_field_disabled = function() {
      this.is_disabled = this.form_field_jq[0].disabled;
      if (this.is_disabled) {
        this.container.addClass('chosen-disabled');
        this.search_field[0].disabled = true;
        if (!this.is_multiple) {
          this.selected_item.unbind("focus.chosen", this.activate_action);
        }
        return this.close_field();
      } else {
        this.container.removeClass('chosen-disabled');
        this.search_field[0].disabled = false;
        if (!this.is_multiple) {
          return this.selected_item.bind("focus.chosen", this.activate_action);
        }
      }
    };
    Chosen.prototype.container_mousedown = function(evt) {
      if (!this.is_disabled) {
        if (evt && evt.type === "mousedown" && !this.results_showing) {
          evt.preventDefault();
        }
        if (!((evt != null) && ($(evt.target)).hasClass("search-choice-close"))) {
          if (!this.active_field) {
            if (this.is_multiple) {
              this.search_field.val("");
            }
            $(document).bind('click.chosen', this.click_test_action);
            this.results_show();
          } else if (!this.is_multiple && evt && (($(evt.target)[0] === this.selected_item[0]) || $(evt.target).parents("a.chosen-single").length)) {
            evt.preventDefault();
            this.results_toggle();
          }
          return this.activate_field();
        }
      }
    };
    Chosen.prototype.container_mouseup = function(evt) {
      if (evt.target.nodeName === "ABBR" && !this.is_disabled) {
        return this.results_reset(evt);
      }
    };
    Chosen.prototype.search_results_mousewheel = function(evt) {
      var delta, _ref1, _ref2;
      delta = -((_ref1 = evt.originalEvent) != null ? _ref1.wheelDelta : void 0) || ((_ref2 = evt.originialEvent) != null ? _ref2.detail : void 0);
      if (delta != null) {
        evt.preventDefault();
        if (evt.type === 'DOMMouseScroll') {
          delta = delta * 40;
        }
        return this.search_results.scrollTop(delta + this.search_results.scrollTop());
      }
    };
    Chosen.prototype.blur_test = function(evt) {
      if (!this.active_field && this.container.hasClass("chosen-container-active")) {
        return this.close_field();
      }
    };
    Chosen.prototype.close_field = function() {
      $(document).unbind("click.chosen", this.click_test_action);
      this.active_field = false;
      this.results_hide();
      this.container.removeClass("chosen-container-active");
      this.clear_backstroke();
      this.show_search_field_default();
      return this.search_field_scale();
    };
    Chosen.prototype.activate_field = function() {
      this.container.addClass("chosen-container-active");
      this.active_field = true;
      this.search_field.val(this.search_field.val());
      return this.search_field.focus();
    };
    Chosen.prototype.test_active_click = function(evt) {
      if (this.container.is($(evt.target).closest('.chosen-container'))) {
        return this.active_field = true;
      } else {
        return this.close_field();
      }
    };
    Chosen.prototype.results_build = function() {
      this.parsing = true;
      this.selected_option_count = null;
      this.results_data = SelectParser.select_to_array(this.form_field);
      if (this.is_multiple) {
        this.search_choices.find("li.search-choice").remove();
      } else if (!this.is_multiple) {
        this.single_set_selected_text();
        if (this.disable_search || this.form_field.options.length <= this.disable_search_threshold) {
          this.search_field[0].readOnly = true;
          this.container.addClass("chosen-container-single-nosearch");
        } else {
          this.search_field[0].readOnly = false;
          this.container.removeClass("chosen-container-single-nosearch");
        }
      }
      this.update_results_content(this.results_option_build({
        first: true
      }));
      this.search_field_disabled();
      this.show_search_field_default();
      this.search_field_scale();
      return this.parsing = false;
    };
    Chosen.prototype.result_do_highlight = function(el) {
      var high_bottom, high_top, maxHeight, visible_bottom, visible_top;
      if (el.length) {
        this.result_clear_highlight();
        this.result_highlight = el;
        this.result_highlight.addClass("highlighted");
        maxHeight = parseInt(this.search_results.css("maxHeight"), 10);
        visible_top = this.search_results.scrollTop();
        visible_bottom = maxHeight + visible_top;
        high_top = this.result_highlight.position().top + this.search_results.scrollTop();
        high_bottom = high_top + this.result_highlight.outerHeight();
        if (high_bottom >= visible_bottom) {
          return this.search_results.scrollTop((high_bottom - maxHeight) > 0 ? high_bottom - maxHeight : 0);
        } else if (high_top < visible_top) {
          return this.search_results.scrollTop(high_top);
        }
      }
    };
    Chosen.prototype.result_clear_highlight = function() {
      if (this.result_highlight) {
        this.result_highlight.removeClass("highlighted");
      }
      return this.result_highlight = null;
    };
    Chosen.prototype.results_show = function() {
      if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
        this.form_field_jq.trigger("chosen:maxselected", {
          chosen: this
        });
        return false;
      }
      this.container.addClass("chosen-with-drop");
      this.form_field_jq.trigger("chosen:showing_dropdown", {
        chosen: this
      });
      this.results_showing = true;
      this.search_field.focus();
      this.search_field.val(this.search_field.val());
      return this.winnow_results();
    };
    Chosen.prototype.update_results_content = function(content) {
      return this.search_results.html(content);
    };
    Chosen.prototype.results_hide = function() {
      if (this.results_showing) {
        this.result_clear_highlight();
        this.container.removeClass("chosen-with-drop");
        this.form_field_jq.trigger("chosen:hiding_dropdown", {
          chosen: this
        });
      }
      return this.results_showing = false;
    };
    Chosen.prototype.set_tab_index = function(el) {
      var ti;
      if (this.form_field.tabIndex) {
        ti = this.form_field.tabIndex;
        this.form_field.tabIndex = -1;
        return this.search_field[0].tabIndex = ti;
      }
    };
    Chosen.prototype.set_label_behavior = function() {
      var _this = this;
      this.form_field_label = this.form_field_jq.parents("label");
      if (!this.form_field_label.length && this.form_field.id.length) {
        this.form_field_label = $("label[for='" + this.form_field.id + "']");
      }
      if (this.form_field_label.length > 0) {
        return this.form_field_label.bind('click.chosen', function(evt) {
          if (_this.is_multiple) {
            return _this.container_mousedown(evt);
          } else {
            return _this.activate_field();
          }
        });
      }
    };
    Chosen.prototype.show_search_field_default = function() {
      if (this.is_multiple && this.choices_count() < 1 && !this.active_field) {
        this.search_field.val(this.default_text);
        return this.search_field.addClass("default");
      } else {
        this.search_field.val("");
        return this.search_field.removeClass("default");
      }
    };
    Chosen.prototype.search_results_mouseup = function(evt) {
      var target;
      target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
      if (target.length) {
        this.result_highlight = target;
        this.result_select(evt);
        return this.search_field.focus();
      }
    };
    Chosen.prototype.search_results_mouseover = function(evt) {
      var target;
      target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
      if (target) {
        return this.result_do_highlight(target);
      }
    };
    Chosen.prototype.search_results_mouseout = function(evt) {
      if ($(evt.target).hasClass("active-result" || $(evt.target).parents('.active-result').first())) {
        return this.result_clear_highlight();
      }
    };
    Chosen.prototype.choice_build = function(item) {
      var choice, close_link, _this = this;
      choice = $('<li />', {
        "class": "search-choice"
      }).html("<span>" + item.html + "</span>");
      if (item.disabled) {
        choice.addClass('search-choice-disabled');
      } else {
        close_link = $('<a />', {
          "class": 'search-choice-close',
          'data-option-array-index': item.array_index
        });
        close_link.bind('click.chosen', function(evt) {
          return _this.choice_destroy_link_click(evt);
        });
        choice.append(close_link);
      }
      return this.search_container.before(choice);
    };
    Chosen.prototype.choice_destroy_link_click = function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      if (!this.is_disabled) {
        return this.choice_destroy($(evt.target));
      }
    };
    Chosen.prototype.choice_destroy = function(link) {
      if (this.result_deselect(link[0].getAttribute("data-option-array-index"))) {
        this.show_search_field_default();
        if (this.is_multiple && this.choices_count() > 0 && this.search_field.val().length < 1) {
          this.results_hide();
        }
        link.parents('li').first().remove();
        return this.search_field_scale();
      }
    };
    Chosen.prototype.results_reset = function() {
      this.form_field.options[0].selected = true;
      this.selected_option_count = null;
      this.single_set_selected_text();
      this.show_search_field_default();
      this.results_reset_cleanup();
      this.form_field_jq.trigger("change");
      if (this.active_field) {
        return this.results_hide();
      }
    };
    Chosen.prototype.results_reset_cleanup = function() {
      this.current_selectedIndex = this.form_field.selectedIndex;
      return this.selected_item.find("abbr").remove();
    };
    Chosen.prototype.result_select = function(evt) {
      var high, item, selected_index;
      if (this.result_highlight) {
        high = this.result_highlight;
        this.result_clear_highlight();
        if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
          this.form_field_jq.trigger("chosen:maxselected", {
            chosen: this
          });
          return false;
        }
        if (this.is_multiple) {
          high.removeClass("active-result");
        } else {
          if (this.result_single_selected) {
            this.result_single_selected.removeClass("result-selected");
            selected_index = this.result_single_selected[0].getAttribute('data-option-array-index');
            this.results_data[selected_index].selected = false;
          }
          this.result_single_selected = high;
        }
        high.addClass("result-selected");
        item = this.results_data[high[0].getAttribute("data-option-array-index")];
        item.selected = true;
        this.form_field.options[item.options_index].selected = true;
        this.selected_option_count = null;
        if (this.is_multiple) {
          this.choice_build(item);
        } else {
          this.single_set_selected_text(item.text);
        }
        if (!((evt.metaKey || evt.ctrlKey) && this.is_multiple)) {
          this.results_hide();
        }
        this.search_field.val("");
        if (this.is_multiple || this.form_field.selectedIndex !== this.current_selectedIndex) {
          this.form_field_jq.trigger("change", {
            'selected': this.form_field.options[item.options_index].value
          });
        }
        this.current_selectedIndex = this.form_field.selectedIndex;
        return this.search_field_scale();
      }
    };
    Chosen.prototype.single_set_selected_text = function(text) {
      if (text == null) {
        text = this.default_text;
      }
      if (text === this.default_text) {
        this.selected_item.addClass("chosen-default");
      } else {
        this.single_deselect_control_build();
        this.selected_item.removeClass("chosen-default");
      }
      return this.selected_item.find("span").text(text);
    };
    Chosen.prototype.result_deselect = function(pos) {
      var result_data;
      result_data = this.results_data[pos];
      if (!this.form_field.options[result_data.options_index].disabled) {
        result_data.selected = false;
        this.form_field.options[result_data.options_index].selected = false;
        this.selected_option_count = null;
        this.result_clear_highlight();
        if (this.results_showing) {
          this.winnow_results();
        }
        this.form_field_jq.trigger("change", {
          deselected: this.form_field.options[result_data.options_index].value
        });
        this.search_field_scale();
        return true;
      } else {
        return false;
      }
    };
    Chosen.prototype.single_deselect_control_build = function() {
      if (!this.allow_single_deselect) {
        return;
      }
      if (!this.selected_item.find("abbr").length) {
        this.selected_item.find("span").first().after("<abbr class=\"search-choice-close\"></abbr>");
      }
      return this.selected_item.addClass("chosen-single-with-deselect");
    };
    Chosen.prototype.get_search_text = function() {
      if (this.search_field.val() === this.default_text) {
        return "";
      } else {
        return $('<div/>').text($.trim(this.search_field.val())).html();
      }
    };
    Chosen.prototype.winnow_results_set_highlight = function() {
      var do_high, selected_results;
      selected_results = !this.is_multiple ? this.search_results.find(".result-selected.active-result") : [];
      do_high = selected_results.length ? selected_results.first() : this.search_results.find(".active-result").first();
      if (do_high != null) {
        return this.result_do_highlight(do_high);
      }
    };
    Chosen.prototype.no_results = function(terms) {
      var no_results_html;
      no_results_html = $('<li class="no-results">' + this.results_none_found + ' "<span></span>"</li>');
      no_results_html.find("span").first().html(terms);
      return this.search_results.append(no_results_html);
    };
    Chosen.prototype.no_results_clear = function() {
      return this.search_results.find(".no-results").remove();
    };
    Chosen.prototype.keydown_arrow = function() {
      var next_sib;
      if (this.results_showing && this.result_highlight) {
        next_sib = this.result_highlight.nextAll("li.active-result").first();
        if (next_sib) {
          return this.result_do_highlight(next_sib);
        }
      } else {
        return this.results_show();
      }
    };
    Chosen.prototype.keyup_arrow = function() {
      var prev_sibs;
      if (!this.results_showing && !this.is_multiple) {
        return this.results_show();
      } else if (this.result_highlight) {
        prev_sibs = this.result_highlight.prevAll("li.active-result");
        if (prev_sibs.length) {
          return this.result_do_highlight(prev_sibs.first());
        } else {
          if (this.choices_count() > 0) {
            this.results_hide();
          }
          return this.result_clear_highlight();
        }
      }
    };
    Chosen.prototype.keydown_backstroke = function() {
      var next_available_destroy;
      if (this.pending_backstroke) {
        this.choice_destroy(this.pending_backstroke.find("a").first());
        return this.clear_backstroke();
      } else {
        next_available_destroy = this.search_container.siblings("li.search-choice").last();
        if (next_available_destroy.length && !next_available_destroy.hasClass("search-choice-disabled")) {
          this.pending_backstroke = next_available_destroy;
          if (this.single_backstroke_delete) {
            return this.keydown_backstroke();
          } else {
            return this.pending_backstroke.addClass("search-choice-focus");
          }
        }
      }
    };
    Chosen.prototype.clear_backstroke = function() {
      if (this.pending_backstroke) {
        this.pending_backstroke.removeClass("search-choice-focus");
      }
      return this.pending_backstroke = null;
    };
    Chosen.prototype.keydown_checker = function(evt) {
      var stroke, _ref1;
      stroke = (_ref1 = evt.which) != null ? _ref1 : evt.keyCode;
      this.search_field_scale();
      if (stroke !== 8 && this.pending_backstroke) {
        this.clear_backstroke();
      }
      switch (stroke) {
        case 8:
          this.backstroke_length = this.search_field.val().length;
          break;
        case 9:
          if (this.results_showing && !this.is_multiple) {
            this.result_select(evt);
          }
          this.mouse_on_container = false;
          break;
        case 13:
          evt.preventDefault();
          break;
        case 38:
          evt.preventDefault();
          this.keyup_arrow();
          break;
        case 40:
          evt.preventDefault();
          this.keydown_arrow();
          break;
      }
    };
    Chosen.prototype.search_field_scale = function() {
      var div, f_width, h, style, style_block, styles, w, _i, _len;
      if (this.is_multiple) {
        h = 0;
        w = 0;
        style_block = "position:absolute; left: -1000px; top: -1000px; display:none;";
        styles = ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing'];
        for (_i = 0, _len = styles.length; _i < _len; _i++) {
          style = styles[_i];
          style_block += style + ":" + this.search_field.css(style) + ";";
        }
        div = $('<div />', {
          'style': style_block
        });
        div.text(this.search_field.val());
        $('body').append(div);
        w = div.width() + 25;
        div.remove();
        f_width = this.container.outerWidth();
        if (w > f_width - 10) {
          w = f_width - 10;
        }
        return this.search_field.css({
          'width': w + 'px'
        });
      }
    };
    return Chosen;
  })(AbstractChosen);
}).call(this);
(function($) {
  "use strict";
  $.fn.fitVids = function(options) {
    var settings = {
      customSelector: null
    };
    if (!document.getElementById('fit-vids-style')) {
      var head = document.head || document.getElementsByTagName('head')[0];
      var css = '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}';
      var div = document.createElement('div');
      div.innerHTML = '<p>x</p><style id="fit-vids-style">' + css + '</style>';
      head.appendChild(div.childNodes[1]);
    }
    if (options) {
      $.extend(settings, options);
    }
    return this.each(function() {
      var selectors = ["iframe[src*='player.vimeo.com']", "iframe[src*='youtube.com']", "iframe[src*='youtube-nocookie.com']", "iframe[src*='kickstarter.com'][src*='video.html']", "object", "embed"];
      if (settings.customSelector) {
        selectors.push(settings.customSelector);
      }
      var $allVideos = $(this).find(selectors.join(','));
      $allVideos = $allVideos.not("object object");
      $allVideos.each(function() {
        var $this = $(this);
        if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) {
          return;
        }
        var height = (this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10)))) ? parseInt($this.attr('height'), 10) : $this.height(),
          width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
          aspectRatio = height / width;
        if (!$this.attr('id')) {
          var videoID = 'fitvid' + Math.floor(Math.random() * 999999);
          $this.attr('id', videoID);
        }
        $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100) + "%");
        $this.removeAttr('height').removeAttr('width');
      });
    });
  };
})(window.jQuery || window.Zepto);
(function($) {
  $.fn.typer = function(text, options) {
    options = $.extend({}, {
      char: '',
      delay: 2000,
      duration: 600,
      endless: true,
      onType: $.noop,
      afterAll: $.noop,
      afterPhrase: $.noop
    }, options || text);
    text = $.isPlainObject(text) ? options.text : text;
    text = $.isArray(text) ? text : text.split(" ");
    return this.each(function() {
      var elem = $(this),
        isVal = {
          input: 1,
          textarea: 1
        }[this.tagName.toLowerCase()],
        isTag = false,
        timer, c = 0;
      (function typetext(i) {
        var e = ({
            string: 1,
            number: 1
          }[typeof text] ? text : text[i]) + '',
          char = e.substr(c++, 1);
        if (char === '<') {
          isTag = true;
        }
        if (char === '>') {
          isTag = false;
        }
        elem[isVal ? "val" : "html"](e.substr(0, c) + ($.isFunction(options.char) ? options.char() : options.char || ' '));
        if (c <= e.length) {
          if (isTag) {
            typetext(i);
          } else {
            timer = setTimeout(typetext, options.duration / 10, i);
          }
          options.onType(timer);
        } else {
          c = 0;
          i++;
          if (i === text.length && !options.endless) {
            if (typeof options.afterPhrase === 'function') options.afterPhrase();
            return (typeof options.afterAll === 'function' ? options.afterAll() : null);
          } else if (i === text.length) {
            i = 0;
          }
          timer = setTimeout(typetext, options.delay, i);
          if (typeof options.afterPhrase === 'function') options.afterPhrase(timer);
        }
      })(0);
    });
  };
}(jQuery));
(function($) {
  var inviewObjects = {},
    viewportSize, viewportOffset, d = document,
    w = window,
    documentElement = d.documentElement,
    expando = $.expando,
    timer;
  $.event.special.inview = {
    add: function(data) {
      inviewObjects[data.guid + "-" + this[expando]] = {
        data: data,
        $element: $(this)
      };
      if (!timer && !$.isEmptyObject(inviewObjects)) {
        timer = setInterval(checkInView, 250);
      }
    },
    remove: function(data) {
      try {
        delete inviewObjects[data.guid + "-" + this[expando]];
      } catch (e) {}
      if ($.isEmptyObject(inviewObjects)) {
        clearInterval(timer);
        timer = null;
      }
    }
  };

  function getViewportSize() {
    var mode, domObject, size = {
      height: w.innerHeight,
      width: w.innerWidth
    };
    if (!size.height) {
      mode = d.compatMode;
      if (mode || !$.support.boxModel) {
        domObject = mode === 'CSS1Compat' ? documentElement : d.body;
        size = {
          height: domObject.clientHeight,
          width: domObject.clientWidth
        };
      }
    }
    return size;
  }

  function getViewportOffset() {
    return {
      top: w.pageYOffset || documentElement.scrollTop || d.body.scrollTop,
      left: w.pageXOffset || documentElement.scrollLeft || d.body.scrollLeft
    };
  }

  function checkInView() {
    var $elements = $(),
      elementsLength, i = 0;
    $.each(inviewObjects, function(i, inviewObject) {
      var selector = inviewObject.data.selector,
        $element = inviewObject.$element;
      $elements = $elements.add(selector ? $element.find(selector) : $element);
    });
    elementsLength = $elements.length;
    if (elementsLength) {
      viewportSize = viewportSize || getViewportSize();
      viewportOffset = viewportOffset || getViewportOffset();
      for (; i < elementsLength; i++) {
        if (!$.contains(documentElement, $elements[i])) {
          continue;
        }
        var $element = $($elements[i]),
          elementSize = {
            height: $element.height(),
            width: $element.width()
          },
          elementOffset = $element.offset(),
          inView = $element.data('inview'),
          visiblePartX, visiblePartY, visiblePartsMerged;
        if (!viewportOffset || !viewportSize) {
          return;
        }
        if (elementOffset.top + elementSize.height > viewportOffset.top && elementOffset.top < viewportOffset.top + viewportSize.height && elementOffset.left + elementSize.width > viewportOffset.left && elementOffset.left < viewportOffset.left + viewportSize.width) {
          visiblePartX = (viewportOffset.left > elementOffset.left ? 'right' : (viewportOffset.left + viewportSize.width) < (elementOffset.left + elementSize.width) ? 'left' : 'both');
          visiblePartY = (viewportOffset.top > elementOffset.top ? 'bottom' : (viewportOffset.top + viewportSize.height) < (elementOffset.top + elementSize.height) ? 'top' : 'both');
          visiblePartsMerged = visiblePartX + "-" + visiblePartY;
          if (!inView || inView !== visiblePartsMerged) {
            $element.data('inview', visiblePartsMerged).trigger('inview', [true, visiblePartX, visiblePartY]);
          }
        } else if (inView) {
          $element.data('inview', false).trigger('inview', [false]);
        }
      }
    }
  }
  $(w).bind("scroll resize", function() {
    viewportSize = viewportOffset = null;
  });
  if (!documentElement.addEventListener && documentElement.attachEvent) {
    documentElement.attachEvent("onfocusin", function() {
      viewportOffset = null;
    });
  }
})(jQuery);
(function($) {
  $.fn.arctic_scroll = function(options) {
    var defaults = {
      elem: $(this),
      speed: 500,
      scroll_selector: 'html,body'
    };
    var options = $.extend(defaults, options),
      to_scroll = options.scroll_selector;
    options.elem.click(function(event) {
      event.preventDefault();
      var offset = ($(this).attr('data-offset')) ? $(this).attr('data-offset') : false,
        position = ($(this).attr('data-position')) ? $(this).attr('data-position') : false,
        speed = ($(this).attr('data-speed')) ? parseInt($(this).attr('data-speed')) : defaults.speed;
      if (offset) {
        var toMove = parseInt(offset);
        $(options.scroll_selector).stop(true, false).animate({
          scrollTop: ($(this.hash).offset().top + toMove)
        }, speed);
      } else if (position) {
        var toMove = parseInt(position);
        $(options.scroll_selector).stop(true, false).animate({
          scrollTop: toMove
        }, speed);
      } else {
        $(options.scroll_selector).stop(true, false).animate({
          scrollTop: ($(this.hash).offset().top)
        }, speed);
      }
    });
  };
})(jQuery);
$.fn.spinbutton = function(options) {
  if (!options || !options.text) {
    this.css('width', this.outerWidth()).addClass('button-loading').html('<span class="spinner"></span>');
    if (this.is("button")) {
      this.prop('disabled', true);
    }
  } else if (options.text) {
    this.css('width', this.outerWidth()).removeClass('button-loading').html(options.text);
    if (this.is("button")) {
      this.prop('disabled', false);
    }
  }
};
$.fn.stripeForm = function() {
  $(this).each(function(i, $modal) {
    var $form = $('form.stripe-form', $modal),
      $submitButton, submitText, doSubmit;
    if (!$form.length) return;
    if ($form.hasClass('stripe-loaded')) return;
    $form.find('.payment-errors').html('');
    $form.addClass('stripe-loaded');
    $submitButton = $('button[type=submit]');
    submitText = $submitButton.text();
    doSubmit = function doSubmit(e) {
      $submitButton.spinbutton();
      var $ccToken = $('.cc-token', $form);
      if ($ccToken.val().length) return true;
      e.preventDefault();
      var $ccNumber = $('.cc-number', $form);
      var $ccExp = $('.cc-exp', $form);
      var $ccCvc = $('.cc-cvc', $form);
      var $ccCountry = $(".cc-country", $form);
      var $ccCurrency = $(".cc-currency", $form);
      var $ccCoupon = $(".cc-coupon", $form);
      $('input, select', $form).removeClass('invalid');
      $('.validation', $form).removeClass('passed failed');
      var cardType = $.payment.cardType($ccNumber.val());
      var cardExpiry = $ccExp.payment('cardExpiryVal');
      if (cardExpiry.month)
        $('.cc-exp-month', $form).val(cardExpiry.month);
      if (cardExpiry.year)
        $('.cc-exp-year', $form).val(cardExpiry.year);
      if (!$.payment.validateCardNumber($ccNumber.val()))
        $ccNumber.addClass('invalid');
      if (!$.payment.validateCardExpiry(cardExpiry.month, cardExpiry.year))
        $ccExp.addClass('invalid');
      if (!$.payment.validateCardCVC($ccCvc.val(), cardType))
        $ccCvc.addClass('invalid');
      if ($ccCountry.length && !$ccCountry.val().length)
        $ccCountry.addClass('invalid');
      if ($ccCurrency.length && !$ccCurrency.val().length)
        $ccCurrency.addClass('invalid');
      if ($ccCoupon[0] && $ccCoupon.val() !== '' && $ccCoupon.val().toLocaleUpperCase() !== 'ILOVEGHOST')
        $ccCoupon.addClass('invalid');
      if (!$('input.invalid, select.invalid', $form).length) {
        if ($ccCoupon[0] && $ccCoupon.val() !== '') {
          $ccCoupon.val($ccCoupon.val().toLocaleUpperCase());
        }
        $form.find('.payment-errors').text('');
        var card_options = {
          number: $ccNumber.val(),
          exp_month: cardExpiry.month,
          exp_year: cardExpiry.year,
          cvc: $ccCvc.val(),
          address_country: $ccCountry.val()
        };
        Stripe.card.createToken(card_options, function(status, response) {
          if (response.error) {
            $form.find('.payment-errors').html('<div class="notification-alert">' + response.error.message + '</div>');
            $submitButton.spinbutton({
              text: submitText
            });
          } else {
            $ccToken.val(response.id);
            $form.submit();
          }
        });
      } else {
        $submitButton.spinbutton({
          text: submitText
        });
      }
    };
    $submitButton.on('click.submit', doSubmit);
    $(".cc-country", $form).chosen();
    $(".cc-currency", $form).chosen({
      disable_search_threshold: 3
    });
    $('.cc-number', $form).payment('formatCardNumber');
    $('.cc-exp', $form).payment('formatCardExpiry');
    $('.cc-cvc', $form).payment('formatCardCVC');
    $($modal).on('show.bs.modal', function() {
      $('input, select', $form).removeClass('invalid');
      $('.cc-number', $form).val('');
      $('.cc-exp', $form).val('');
      $('.cc-cvc', $form).val('');
    });
  });
  return $(this);
};
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    factory(require('jquery'));
  } else {
    factory(jQuery);
  }
}(function($) {
  var pluses = /\+/g;

  function encode(s) {
    return config.raw ? s : encodeURIComponent(s);
  }

  function decode(s) {
    return config.raw ? s : decodeURIComponent(s);
  }

  function stringifyCookieValue(value) {
    return encode(config.json ? JSON.stringify(value) : String(value));
  }

  function parseCookieValue(s) {
    if (s.indexOf('"') === 0) {
      s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }
    try {
      s = decodeURIComponent(s.replace(pluses, ' '));
      return config.json ? JSON.parse(s) : s;
    } catch (e) {}
  }

  function read(s, converter) {
    var value = config.raw ? s : parseCookieValue(s);
    return $.isFunction(converter) ? converter(value) : value;
  }
  var config = $.cookie = function(key, value, options) {
    if (value !== undefined && !$.isFunction(value)) {
      options = $.extend({}, config.defaults, options);
      if (typeof options.expires === 'number') {
        var days = options.expires,
          t = options.expires = new Date();
        t.setTime(+t + days * 864e+5);
      }
      return (document.cookie = [encode(key), '=', stringifyCookieValue(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join(''));
    }
    var result = key ? undefined : {};
    var cookies = document.cookie ? document.cookie.split('; ') : [];
    for (var i = 0, l = cookies.length; i < l; i++) {
      var parts = cookies[i].split('=');
      var name = decode(parts.shift());
      var cookie = parts.join('=');
      if (key && key === name) {
        result = read(cookie, value);
        break;
      }
      if (!key && (cookie = read(cookie)) !== undefined) {
        result[name] = cookie;
      }
    }
    return result;
  };
  config.defaults = {};
  $.removeCookie = function(key, options) {
    if ($.cookie(key) === undefined) {
      return false;
    }
    $.cookie(key, '', $.extend({}, options, {
      expires: -1
    }));
    return !$.cookie(key);
  };
}));

function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    if (interval === 1)
      return interval + " year";
    else
      return interval + " years";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    if (interval === 1)
      return interval + " month";
    else
      return interval + " months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    if (interval === 1)
      return interval + " day";
    else
      return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    if (interval === 1)
      return interval + " hour";
    else
      return interval + " hours";
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    if (interval === 1)
      return interval + " minute";
    else
      return interval + " minutes";
  }
  if (Math.floor(seconds) === 1)
    return Math.floor(seconds) + " second";
  else
    return Math.floor(seconds) + " seconds";
}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
(function($) {
  'use strict';
  $(document).on('ready', function() {
    $(document).on('click', '.js-notification .js-close', function(e) {
      var $close_link = $(this),
        $notification = $close_link.parents('.js-notification:first');
      if (!$close_link.attr('data-remote')) {
        e.preventDefault();
      }
      $notification.fadeOut(100, function() {
        $notification.remove();
      });
    });
    if ($('.focus').length) {
      $('.focus:first').focus();
    }
    (function() {
      var interval, $counter = $('.download-count'),
        $link = $("#ghost-download");

      function formatCount(count) {
        count = count.toString();
        var pattern = /(-?\d+)(\d{3})/;
        while (pattern.test(count)) {
          count = count.replace(pattern, '$1,$2');
        }
        return count;
      }

      function setupCounter() {
        if ($counter[0]) {
          interval = setInterval(function() {
            $.getJSON('https://count.ghost.org', function(json) {
              $counter.html(formatCount(json.count));
            });
          }, 20000);
        }
      }
      if ($counter[0] && $link[0]) {
        $link.on('click', function() {
          clearInterval(interval);
          var number = parseInt($counter.html().replace(/,/g, ''), 10);
          number += 1;
          $counter.html(formatCount(number));
          setupCounter();
        });
      }
      setupCounter();
    })();
    (function() {
      if ($('.dashboard-section-latest').length) {
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        $.get('/rss', function(json) {
          var items = json.rss.channel.item.slice(0, 3);
          $.each(items, function(i) {
            var parsed_date = new Date(items[i].pubDate),
              friendly_month = months[parsed_date.getMonth()],
              html_link = "<li><p><a href='" + items[i].link + "'>" + items[i].title + " <span class='timestamp'>" + friendly_month + " " + parsed_date.getDate() + "</span></p></li>";
            $('.dashboard-section-latest ul').append(html_link);
          });
        });
      }
    })();
    (function() {
      if ($('.myblogs-latest-news').length && window.ghost) {
        $.get(window.ghost.url.api('posts', {
          limit: 1,
          include: 'author'
        }), function(json) {
          var item = json.posts[0],
            parsed_date = new Date(item.published_at),
            image_url = item.author.image.substr(0, 2) === '//' ? item.author.image : '//blog.ghost.org/' + item.author.image,
            news_html = '<p><a href="https://blog.ghost.org' + item.url + '">' + item.title + '</a></p>' + '<span class="meta">' + '<img src="' + image_url + '" />' + '<time title="' + parsed_date + '">' + timeSince(parsed_date) + ' ago</time> by ' + item.author.name + '</span>';
          $(".myblogs-latest-news").html(news_html);
        });
      }
    })();
    (function() {
      var $input = $('#profile-settings #user_homepage');
      if ($input.length) {
        $input.blur(function() {
          var homepage = $(this).val().replace(/ /g, ''),
            match = homepage.match(/https?\:\/\//);
          if (homepage.length && !match) {
            $(this).val('http://' + homepage);
          }
        });
      }
    })();
    (function() {
      var $blog_name = $('.newblog-form input#name');
      if ($blog_name.length) {
        $blog_name.change(function() {
          if ($('.newblog-form input#subdomain').attr("data-pre-filled")) return;
          var permalink = $(this).val().replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();
          var reg = /^-+(.+?)-+$/;
          if (permalink.match(reg)) {
            permalink = permalink.match(reg)[1];
          }
          if (!$('.newblog-form input#subdomain').val().length) {
            $('.newblog-form input#subdomain').val(permalink);
            $('.newblog-form input#subdomain').attr("data-pre-filled", "true");
          }
        });
      }
    })();
    (function() {
      if ($(".modal-billing[role=dialog]").length) {
        $('.modal-billing[role=dialog]').on('shown.bs.modal', function(e) {
          $(this).find('.payment-errors').html('');
          $(this).stripeForm();
        });
      }
      if ($(".checkout-wrapper").length) {
        $(".checkout-wrapper").find('.payment-errors').html('');
        $(".checkout-wrapper").stripeForm();
      }
      if ($(".modal[role=dialog]").length) {
        $('.modal[role=dialog]').on('shown.bs.modal', function(e) {
          $('.focus:first').focus();
        });
        $('.modal[role=dialog]').each(function(i, self) {
          var $form = $('form:not(.stripe-form)', self);
          if (!$form.length) return;
          var $button = $('.modal-footer button[type=submit]', self);
          $button.on('click', function() {
            $form.submit();
          });
        });
      }
    })();
    (function() {
      var $cancelModal = $('#cancel-package-modal'),
        $fakeIntercomButton = $('#button-intercom');
      if ($cancelModal[0] && $fakeIntercomButton[0]) {
        $fakeIntercomButton.on('click', function() {
          $cancelModal.modal('hide');
          if ($('.intercom-launcher-button')[0]) {
            $('.intercom-launcher-button').click();
          } else {
            window.location.href = 'mailto:support@ghost.org';
          }
        });
      }
    })();
    (function() {
      if ($(".photographer").length) {
        var photoCredits = $('.photographer').html(),
          $creditElem = $(document.createElement('span')).addClass('left photo-credits').html(photoCredits);
        $('#social-menu').before($creditElem);
      }
    })();
    (function() {
      if ($(".usage-cycle").length) {
        $('.usage-cycle').tooltip();
      }
    })();
    (function() {
      if ($(".postfix").length && $(".blog-url").length) {
        var postfix_left_padding = parseInt($('.postfix').css("padding-left")),
          postfix_outer_width = parseInt($('.postfix').outerWidth()),
          postfix_width = postfix_outer_width - postfix_left_padding - 1;
        $('.blog-url').css('padding-right', postfix_width);
      }
    })();
    (function() {
      if ($("#video").length) {
        $('#video').on('show.bs.modal', function() {
          $('#kickstarter').html('<iframe width="800" height="600" src="//www.kickstarter.com/projects/johnonolan/ghost-just-a-blogging-platform/widget/video.html" frameborder="0"> </iframe>');
        });
        $('#video').on('hide.bs.modal', function() {
          $('#kickstarter').html('');
        });
      }
    })();
    (function() {
      function scrollToPost(post) {
        var $forum_post = $('.forum-post#forum-post-' + post),
          scroll_position = $forum_post.offset().top;
        window.scrollTo(0, scroll_position)
      };
      if ($('.forum-thread').length && GhostForum !== undefined) {
        if (GhostForum.post) {
          scrollToPost(GhostForum.post);
        }
        $('.post-number').click(function() {
          if (!history.pushState) return true;
          var postNumber = $(this).data().postNumber;
          var url = '/forum/' + GhostForum.category + '/' + GhostForum.topic + '/' + postNumber + '/';
          history.pushState({}, document.title, url);
          scrollToPost(postNumber);
          return false;
        });
      }
    })();
    (function() {
      $('form:not(.stripe-form):not(.newblog-form)').submit(function() {
        $(this).find('button[type=submit]').spinbutton();
        $(this).find('input[type=submit]').spinbutton();
        $(this).submit(false);
      });
      $(".btn-spin").on("click", function(e) {
        $(this).spinbutton();
      });
    })();
    (function() {
      if ($(".js-trim-all-whitespace").length) {
        $(".js-trim-all-whitespace").on("blur", function() {
          var value = $(this).val(),
            trimmed = value.replace(/ /g, '');
          $(this).val(trimmed);
        });
      }
      if ($(".js-trim").length) {
        $(".js-trim").on("blur", function() {
          var value = $(this).val(),
            trimmed = value.trim();
          $(this).val(trimmed);
        });
      }
    })();
    (function() {
      if ($(".js-validate-email").length) {
        $(".js-validate-email").on("blur", function() {
          var value = $(this).val(),
            is_valid = validateEmail(value),
            $parent_label = $(this).parent("label");
          if (!is_valid && $parent_label.not(".validation-error") && $parent_label.find(".validation-message").length == 0) {
            $parent_label.addClass("validation-error").append('<div class="validation-message">Please choose an Email address</div>');
          } else if (is_valid) {
            $parent_label.removeClass("validation-error");
            $parent_label.find(".validation-message").remove();
          }
        });
      }
    })();
    (function() {
      if (!$('.settings-form .settings-upload input[type=file]').length) return;
      var $settings_form = $('.settings-form'),
        formErrors = false;
      $settings_form.submit(function() {
        var $form = $(this),
          $file_inputs = $('.settings-upload input[type=file]', $form);
        $('.notification-alert.js-notification').remove();
        $file_inputs.each(function(i, input) {
          var file = $(input).val(),
            extension = file.split('.').pop().toLowerCase();
          if (extension.length && extension != ('jpg' || 'jpeg' || 'gif' || 'png' || 'tiff' || 'bmp')) {
            var error_html = '<section class="notification-alert js-notification">Upload must be a valid image.<a class="close js-close" href="#"><span class="hidden">Close</span></a></section>';
            $('#global-header').after(error_html);
            window.scrollTo(0, 0)
            formErrors = true;
          }
        });
        if (formErrors) {
          $('button[type=disabled]', $form).attr('type', 'submit').removeAttr("disabled");
          $('input[type=disabled]', $form).removeAttr("disabled");
          $form.submit(true);
          return false;
        } else {
          return true;
        }
      });
    })();

    function start_typewriter() {
      var top_text = $(".terminal-code.top noscript").text(),
        bottom_text_1 = $(".terminal-code.bottom noscript").eq(0).text(),
        type_duration = 300,
        type_endless = false;
      $('.terminal-code.top').typer([top_text], {
        duration: type_duration,
        endless: type_endless,
        afterAll: function(timer) {
          setTimeout(function() {
            $('.terminal-code.bottom').typer([bottom_text_1], {
              duration: type_duration,
              endless: type_endless,
            });
          }, 1400);
        }
      });
    }
    (function() {
      if ($(".terminal-code").length) {
        $('.terminal').bind('inview', function(event, isInView, visiblePartX, visiblePartY) {
          if (isInView && visiblePartY == 'both' && visiblePartY == 'both') {
            start_typewriter();
            $('.terminal').unbind('inview');
          }
        });
      }
    })();
    (function() {
      if ($("body").hasClass("create") || $("body").hasClass("manage-blogs")) {
        $(".setup, .newblog-form").on("submit", function(e) {
          e.preventDefault();
          var blog_name = $("#name").val(),
            blog_domain = $("#subdomain").val(),
            button = $(".setup, .newblog-form").find('button'),
            buttonText = button.html();
          if (blog_name.length == 0 && $(".dash-name-error").length == 0) {
            $("#global-header").after('<section class="dash-name-error notification-alert js-notification">Title can\'t be blank<a class="close js-close" href="#"><span class="hidden">Close</span></a></section>');
          }
          if (blog_domain.length == 0 && $(".dash-domain-error").length == 0) {
            $("#global-header").after('<section class="dash-domain-error notification-alert js-notification">Please choose a URL!<a class="close js-close" href="#"><span class="hidden">Close</span></a></section>');
          } else if (blog_domain.length < 3 && $(".dash-domain-error2").length == 0) {
            $("#global-header").after('<section class="dash-domain-error2 notification-alert js-notification">Subdomain must be at least 3 characters long<a class="close js-close" href="#"><span class="hidden">Close</span></a></section>');
          }
          if (blog_name.length) {
            $(".dash-name-error").fadeOut(100, function() {
              $(this).remove();
            });
          }
          if (blog_domain.length) {
            $(".dash-domain-error").fadeOut(100, function() {
              $(this).remove();
            });
          }
          if (blog_domain.length >= 3) {
            $(".dash-domain-error2").fadeOut(100, function() {
              $(this).remove();
            });
          }
          if (blog_name.length && blog_domain.length >= 3) {
            $(".js-blog-name").text(blog_name);
            button.spinbutton();
            $.ajax({
              url: $(this).attr('action'),
              data: $(this).serialize(),
              method: 'POST'
            }).done(function() {
              window.location = '/';
            }).fail(function(response) {
              var errorMessage;
              response = $.parseJSON(response.responseText).errors;
              errorMessage = response.base && response.base[0] ? response.base[0] : 'Whoops, something went wrong! Please try again.';
              setTimeout(function() {
                button.spinbutton({
                  text: buttonText
                });
                $(".loading-wrapper").fadeOut(100, function() {
                  $(".setup-wrapper").fadeIn(100);
                  $(".global-header").after('<section class="dash-domain-error notification-alert js-notification">' +
                    errorMessage + '<a class="close js-close" href="#"><span class="hidden">Close</span></a>' + '</section>');
                })
              }, 1000)
            });
            $(".setup-wrapper").delay(200).fadeOut(300, function() {
              $(".loading-wrapper").fadeIn(300);
            });
          }
        });
      }
    })();
    (function() {
      if ($("[data-arcticscroll]").length) {
        $("[data-arcticscroll='true']").arctic_scroll({
          speed: 800
        });
      }
    })();
    (function() {
      var signup_form = $(".js-home-signup-validation");
      if (signup_form.length) {
        signup_form.on("submit", function(e) {
          e.preventDefault();
          var inputs = signup_form.find("input").not("[type='hidden']"),
            username_input = $('#username'),
            username_label = username_input.parent('label'),
            email_input = $('#email'),
            email_label = email_input.parent('label'),
            password_input = $('#password'),
            password_label = password_input.parent('label');
          if (username_input.val().length < 1) {
            username_label.addClass('error').find('.error-message').css('display', 'block');
          } else {
            username_label.removeClass('error').find('.error-message').hide();
          }
          if (email_input.val().length == 0 || validateEmail(email_input.val()) == false) {
            email_label.addClass('error').find('.error-message').css('display', 'block');
          } else {
            email_label.removeClass('error').find('.error-message').hide();
          }
          if (password_input.val().length <= 6) {
            password_label.addClass('error').find('.error-message').css('display', 'block');
          } else {
            password_label.removeClass('error').find('.error-message').hide();
          }
          if ($(this).find(".error").length == 0) {
            $(this).find('.home-signup-button.button-add').prop('disabled', true);
            $(this).unbind('submit').submit();
          }
        });
      }
    })();
    (function() {
      var delete_form = $(".js-delete-blog-validation");
      if (delete_form.length) {
        delete_form.on("submit", function(e) {
          e.preventDefault();
          var blog_url_input = $('#delete-blog input[name="subdomain"]'),
            blog_url_label = blog_url_input.parent('label'),
            blog_url_hidden = $('#delete-blog input[name="blog-url"]')
          error_html = '';
          if (blog_url_input.val().length < 1) {
            var error_html = '<section class="notification-alert js-notification">Blog URL must be provided.<a class="close js-close" href="#"><span class="hidden">Close</span></a></section>';
            $('.delete-blog-model-body').prepend(error_html);
          } else {
            $('.delete-blog-model-body .notification-alert').remove();
          }
          if ($(".delete-blog-model-body .notification-alert").length == 0) {
            if (blog_url_input.val() != blog_url_hidden.val()) {
              var error_html = '<section class="notification-alert js-notification">Blog URL is not correct.<a class="close js-close" href="#"><span class="hidden">Close</span></a></section>';
              $('.delete-blog-model-body').prepend(error_html);
            } else {
              $('.delete-blog-model-body .notification-alert').remove();
            }
          }
          if ($(this).find(".delete-blog-model-body .notification-alert").length == 0) {
            $(this).find('.js-delete-blog-validation.button-delete').prop('disabled', true);
            $(this).unbind('submit').submit();
          }
        });
      }
    })();
    (function() {
      function set_banner_size() {
        var window_height = $(window).innerHeight(),
          banner = $(".home-banner"),
          inner_height = $(".home-banner .inner").height();
        if (window_height > inner_height) {
          banner.css("height", window_height);
        }
      }
      if (Modernizr.touch && $(".home-banner").length) {
        set_banner_size();
        $(window).on("resize orientationchange", function() {
          set_banner_size();
        });
      }
    })();
    (function() {
      $("[href='#home-top']").on("click", function() {
        $(".home-signup-form input[name='username']").focus();
      });
    })();
    (function() {
      if ($(".js-myblogs-views-chart").length) {
        var charts = $(".js-myblogs-views-chart");
        charts.each(function() {
          var chart = $(this),
            views = chart.attr("data-views").split(","),
            view_ints = [];
          for (i = 0; i < views.length; i++) {
            if (views[i] == 0) {
              views[i] = 0;
            }
            if (!isNaN(views[i])) {
              view_ints.push(parseInt(views[i]));
            }
          }
          if (view_ints.length > 30) {
            var sliced = view_ints.slice(Math.max(view_ints.length - 30, 1));
            view_ints = sliced;
          }
          var min = Math.min.apply(Math, view_ints),
            max = Math.max.apply(Math, view_ints);
          $.each(view_ints, function(i, e) {
            var perc = (10 + ((e - min) / (max - min)) * 90);
            if (isNaN(perc)) {
              perc = 0;
            }
            chart.append('<span class="stat" style="height: ' + perc + '%;"></span>');
          });
        });
      }
    })();
    (function() {
      if ($('#custom_theme').length) {
        var iOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false);
        if (iOS) {
          $(".blog-drop-zones").css({
            'display': 'none'
          });
        } else {
          $('#custom_theme').change(function(e) {
            var name_split = $(this).val().split("\\");
            var name = name_split[name_split.length - 1]
            $(".file-drop-zone-label").text("Upload '" + name + "'");
          });
        }
      }
    })();
    (function() {
      $(".setup_share").on("click", function(e) {
        if (!$(this).hasClass('setup_email')) {
          e.preventDefault();
        }
        $.post("/setup/set-shared/", {}, function() {});
      });
    })();
    (function() {
      $(".close-welcome").on("click", function(e) {
        e.preventDefault();
        $.post("/setup/seen-welcome/", {}, function() {});
        $('.welcome-message').hide();
      });
    })();
    (function() {
      $(".open_slack").on("click", function(e) {
        var timeout = 0,
          poll = function() {
            setTimeout(function() {
              $.ajax({
                type: "GET",
                url: "/slack/invitation/",
                cache: false,
                statusCode: {
                  500: function() {}
                }
              }).done(function(res) {
                if (res.slack_token) {
                  window.location.href = "https://ghost.slack.com/invite/" + res.slack_token;
                } else if (res.message && res.message === 'Slack token not found') {
                  timeout = 2000;
                  $.post("/slack/invitation/", {}, function() {});
                  poll();
                }
              });
            }, timeout);
          };
        e.preventDefault();
        $(".open_slack").spinbutton();
        poll();
      });
    })();
    (function() {
      if ($('body').hasClass('checkout-page')) {
        var switchToMonthly, showFeeNote;
        switchToMonthly = function(monthly) {
          var plan_basename = $('.checkout-choose-plan').attr('data-plan-name');
          if (monthly) {
            $('.checkout-form').attr("action", "/subscribe/" + plan_basename + "/activate/");
            $('.checkout-form').attr("id", "credit-card-" + plan_basename);
          } else {
            $('.checkout-form').attr("action", "/subscribe/" + plan_basename + "-yearly/activate/");
            $('.checkout-form').attr("id", "credit-card-" + plan_basename + "-yearly");
          }
        };
        showFeeNote = function() {
          if ($(':radio[value=monthly]').prop("checked") && $('.cc-country option:selected').val() !== 'United States') {
            $('.payment-notes-fees').show();
          } else {
            $('.payment-notes-fees').hide();
          }
        };
        $('.checkout-choose-plan input[type="radio"]').change(function() {
          switchToMonthly($(':radio[value=monthly]').prop('checked') === true);
          showFeeNote();
          var the_price = $('.checkout-choose-plan input[type="radio"]:checked').attr('data-price-today'),
            old_text = $('.price-today .price');
          old_text.addClass('out');
          setTimeout(function() {
            old_text.remove();
            $('.price-today').append('<span class="price coming-in">' + the_price + '</span>');
            setTimeout(function() {
              $('.price-today .price').removeClass('coming-in');
            }, 100);
          }, 100);
        });
        $('.checkout-form .cc-country').change(function(data) {
          var selectedOption = $('.cc-country option:selected');
          showFeeNote();
          if (selectedOption.attr('data-country-code')) {
            $('.payment-notes-vat').show();
            $('.payment-notes-vat-country').text(selectedOption.val());
            $('.payment-notes-vat-rate').text(selectedOption.attr('data-tax') + '% VAT');
          } else {
            $('.payment-notes-vat').hide();
          }
        });
        $('.checkout-form input[type="text"]').on('keyup', function() {
          var number = $('.checkout-form .cc-number'),
            exp = $('.checkout-form .cc-exp'),
            cvc = $('.checkout-form .cc-cvc');
          var new_width = 50;
          if (number.val().length) new_width = new_width + 20;
          if (exp.val().length) new_width = new_width + 10;
          if (cvc.val().length) new_width = new_width + 10;
          $('.checkout-form .bar-inner').css({
            width: new_width + '%'
          });
          $('.checkout-form .progress-perc').html(new_width + '%');
        });
        if ($('.checkout-choose-plan').attr('data-monthly') === 'true') {
          $(':radio[value=monthly]').prop("checked", true);
          switchToMonthly(true);
        } else {
          $(':radio[value=yearly]').prop("checked", true);
          switchToMonthly(false);
        }
        var the_price = $('.checkout-choose-plan input[type="radio"]:checked').attr('data-price-today');
        $('.price-today .price').remove();
        $('.price-today').append('<span class="price">' + the_price + '</span>');
      }
    })();
    (function() {
      var your_plan = $('tr.your-plan'),
        your_plan_name = your_plan.attr('data-plan-name'),
        togglePlanTable = function(type) {
          var $billingWrapper = $('.billing-tables-wrapper'),
            $monthly = $('.billing-table-monthly, .see-yearly-plans'),
            $yearly = $('.billing-table-yearly, .see-monthly-plans');
          $billingWrapper.addClass('pulse');
          if (type === 'yearly') {
            $monthly.hide();
            $yearly.show();
          } else {
            $yearly.hide();
            $monthly.show();
          }
          $billingWrapper.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
            if (e.originalEvent.animationName === 'pulse') {
              $('.billing-tables-wrapper').removeClass('pulse');
            }
          });
        };
      if ($('body').hasClass('settings-billing')) {
        $('.see-yearly-plans').on('click', function(e) {
          e.preventDefault();
          togglePlanTable('yearly');
        });
        $('.see-monthly-plans').on('click', function(e) {
          e.preventDefault();
          togglePlanTable('monthly');
        });
        if (your_plan_name.indexOf('-yearly') > -1) {
          togglePlanTable('yearly');
        }
      }
    })();
  });
})(jQuery);
(function() {
  var root = this;
  var previousUnderscore = root._;
  var breaker = {};
  var ArrayProto = Array.prototype,
    ObjProto = Object.prototype,
    FuncProto = Function.prototype;
  var push = ArrayProto.push,
    slice = ArrayProto.slice,
    concat = ArrayProto.concat,
    toString = ObjProto.toString,
    hasOwnProperty = ObjProto.hasOwnProperty;
  var
    nativeForEach = ArrayProto.forEach,
    nativeMap = ArrayProto.map,
    nativeReduce = ArrayProto.reduce,
    nativeReduceRight = ArrayProto.reduceRight,
    nativeFilter = ArrayProto.filter,
    nativeEvery = ArrayProto.every,
    nativeSome = ArrayProto.some,
    nativeIndexOf = ArrayProto.indexOf,
    nativeLastIndexOf = ArrayProto.lastIndexOf,
    nativeIsArray = Array.isArray,
    nativeKeys = Object.keys,
    nativeBind = FuncProto.bind;
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }
  _.VERSION = '1.4.4';
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
  };
  var reduceError = 'Reduce of empty array with no initial value';
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };
  _.pluck = function(obj, key) {
    return _.map(obj, function(value) {
      return value[key];
    });
  };
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? null : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {
      computed: -Infinity,
      value: -Infinity
    };
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {
        value: value,
        computed: computed
      });
    });
    return result.value;
  };
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {
      computed: Infinity,
      value: Infinity
    };
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {
        value: value,
        computed: computed
      });
    });
    return result.value;
  };
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj) {
      return obj[value];
    };
  };
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index < right.index ? -1 : 1;
    }), 'value');
  };
  var group = function(obj, value, context, behavior) {
    var result = {};
    var iterator = lookupIterator(value || _.identity);
    each(obj, function(value, index) {
      var key = iterator.call(context, value, index, obj);
      behavior(result, key, value);
    });
    return result;
  };
  _.groupBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key, value) {
      (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
    });
  };
  _.countBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key) {
      if (!_.has(result, key)) result[key] = 0;
      result[key]++;
    });
  };
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0,
      high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };
  var flatten = function(input, shallow, output) {
    each(input, function(value) {
      if (_.isArray(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };
  _.union = function() {
    return _.uniq(concat.apply(ArrayProto, arguments));
  };
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value) {
      return !_.contains(rest, value);
    });
  };
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(args, "" + i);
    }
    return results;
  };
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, l = list.length; i < l; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0,
      l = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, l + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < l; i++)
      if (array[i] === item) return i;
    return -1;
  };
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--)
      if (array[i] === item) return i;
    return -1;
  };
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;
    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);
    while (idx < len) {
      range[idx++] = start;
      start += step;
    }
    return range;
  };
  _.bind = function(func, context) {
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    var args = slice.call(arguments, 2);
    return function() {
      return func.apply(context, args.concat(slice.call(arguments)));
    };
  };
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) funcs = _.functions(obj);
    each(funcs, function(f) {
      obj[f] = _.bind(obj[f], obj);
    });
    return obj;
  };
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function() {
      return func.apply(null, args);
    }, wait);
  };
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };
  _.throttle = function(func, wait) {
    var context, args, timeout, result;
    var previous = 0;
    var later = function() {
      previous = new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };
  _.debounce = function(func, wait, immediate) {
    var timeout, result;
    return function() {
      var context = this,
        args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };
  _.once = function(func) {
    var ran = false,
      memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj)
      if (_.has(obj, key)) keys[keys.length] = key;
    return keys;
  };
  _.values = function(obj) {
    var values = [];
    for (var key in obj)
      if (_.has(obj, key)) values.push(obj[key]);
    return values;
  };
  _.pairs = function(obj) {
    var pairs = [];
    for (var key in obj)
      if (_.has(obj, key)) pairs.push([key, obj[key]]);
    return pairs;
  };
  _.invert = function(obj) {
    var result = {};
    for (var key in obj)
      if (_.has(obj, key)) result[obj[key]] = key;
    return result;
  };
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] == null) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };
  var eq = function(a, b, aStack, bStack) {
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    if (a == null || b == null) return a === b;
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      case '[object String]':
        return a == String(b);
      case '[object Number]':
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        return +a == +b;
      case '[object RegExp]':
        return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    var length = aStack.length;
    while (length--) {
      if (aStack[length] == a) return bStack[length] == b;
    }
    aStack.push(a);
    bStack.push(b);
    var size = 0,
      result = true;
    if (className == '[object Array]') {
      size = a.length;
      result = size == b.length;
      if (result) {
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      var aCtor = a.constructor,
        bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) && _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
        return false;
      }
      for (var key in a) {
        if (_.has(a, key)) {
          size++;
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    aStack.pop();
    bStack.pop();
    return result;
  };
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj)
      if (_.has(obj, key)) return false;
    return true;
  };
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };
  _.isObject = function(obj) {
    return obj === Object(obj);
  };
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }
  if (typeof(/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };
  _.isNull = function(obj) {
    return obj === null;
  };
  _.isUndefined = function(obj) {
    return obj === void 0;
  };
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };
  _.identity = function(value) {
    return value;
  };
  _.times = function(n, iterator, context) {
    var accum = Array(n);
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);
  var entityRegexes = {
    escape: new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });
  _.result = function(object, property) {
    if (object == null) return null;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };
  _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };
  var noMatch = /(.)^/;
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\t': 't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };
  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);
    var matcher = new RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join('|') + '|$', 'g');
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, function(match) {
        return '\\' + escapes[match];
      });
      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';
    source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";
    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }
    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';
    return template;
  };
  _.chain = function(obj) {
    return _(obj).chain();
  };
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };
  _.mixin(_);
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });
  _.extend(_.prototype, {
    chain: function() {
      this._chain = true;
      return this;
    },
    value: function() {
      return this._wrapped;
    }
  });
}).call(this);
(function($, undefined) {
  if ($.rails !== undefined) {
    $.error('jquery-ujs has already been loaded!');
  }
  var rails;
  var $document = $(document);
  $.rails = rails = {
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',
    buttonClickSelector: 'button[data-remote]',
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',
    formSubmitSelector: 'form',
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',
    fileInputSelector: 'input[type=file]',
    linkDisableSelector: 'a[data-disable-with]',
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },
    confirm: function(message) {
      return confirm(message);
    },
    ajax: function(options) {
      return $.ajax(options);
    },
    href: function(element) {
      return element.attr('href');
    },
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;
      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);
        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }
        options = {
          type: method || 'GET',
          data: data,
          dataType: dataType,
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }
        if (url) {
          options.url = url;
        }
        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';
      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }
      if (target) {
        form.attr('target', target);
      }
      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this),
          method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this),
          method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },
    allowAction: function(element) {
      var message = element.data('confirm'),
        answer = false,
        callback;
      if (!message) {
        return true;
      }
      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(),
        input, valueToCheck, selector = specifiedSelector || 'input,textarea',
        allInputs = form.find(selector);
      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        if (!valueToCheck === !nonBlank) {
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true;
          }
          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true);
    },
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html());
      element.html(element.data('disable-with'));
      element.bind('click.railsDisable', function(e) {
        return rails.stopEverything(e);
      });
    },
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with'));
        element.removeData('ujs:enable-with');
      }
      element.unbind('click.railsDisable');
    }
  };
  if (rails.fire($document, 'rails:attachBindings')) {
    $.ajaxPrefilter(function(options, originalOptions, xhr) {
      if (!options.crossDomain) {
        rails.CSRFProtection(xhr);
      }
    });
    $document.delegate(rails.linkDisableSelector, 'ajax:complete', function() {
      rails.enableElement($(this));
    });
    $document.delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this),
        method = link.data('method'),
        data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);
      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);
      if (link.data('remote') !== undefined) {
        if ((e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data) {
          return true;
        }
        var handleRemote = rails.handleRemote(link);
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error(function() {
            rails.enableElement(link);
          });
        }
        return false;
      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });
    $document.delegate(rails.buttonClickSelector, 'click.rails', function(e) {
      var button = $(this);
      if (!rails.allowAction(button)) return rails.stopEverything(e);
      rails.handleRemote(button);
      return false;
    });
    $document.delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);
      rails.handleRemote(link);
      return false;
    });
    $document.delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);
      if (!rails.allowAction(form)) return rails.stopEverything(e);
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }
      if (remote) {
        if (nonBlankFileInputs) {
          setTimeout(function() {
            rails.disableFormElements(form);
          }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);
          if (!aborted) {
            setTimeout(function() {
              rails.enableFormElements(form);
            }, 13);
          }
          return aborted;
        }
        rails.handleRemote(form);
        return false;
      } else {
        setTimeout(function() {
          rails.disableFormElements(form);
        }, 13);
      }
    });
    $document.delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);
      if (!rails.allowAction(button)) return rails.stopEverything(event);
      var name = button.attr('name'),
        data = name ? {
          name: name,
          value: button.val()
        } : null;
      button.closest('form').data('ujs:submit-button', data);
    });
    $document.delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });
    $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });
    $(function() {
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }
})(jQuery);
(function() {
  $(document).on('click', '#trigger-overlay', function() {
    $('#overlay').toggleClass('overlay-open');
  });
  $(document).on('click', '#overlay-close', function() {
    $('#overlay').toggleClass('overlay-open');
  });
  $(document).keyup(function(k) {
    if (k.keyCode == 27 && $('#overlay').hasClass('overlay-open')) {
      $('#overlay').toggleClass('overlay-open');
    }
  });
})();