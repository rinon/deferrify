window.gbar && gbar.elp && gbar.elp()(function () {
  __called[146] = true;
  try {
    var i = void 0, j = !0, l = null, m = !1, n, o = this, p = function (a, b, c) {
        __called[22] = true;
        a = a.split('.');
        c = c || o;
        !(a[0] in c) && c.execScript && c.execScript('var ' + a[0]);
        for (var d; a.length && (d = a.shift());)
          !a.length && b !== i ? c[d] = b : c = c[d] ? c[d] : c[d] = {};
      }, s = function (a) {
        __called[23] = true;
        var b = typeof a;
        if ('object' == b)
          if (a) {
            if (a instanceof Array)
              return 'array';
            if (a instanceof Object)
              return b;
            var c = Object.prototype.toString.call(a);
            if ('[object Window]' == c)
              return 'object';
            if ('[object Array]' == c || 'number' == typeof a.length && 'undefined' != typeof a.splice && 'undefined' != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable('splice'))
              return 'array';
            if ('[object Function]' == c || 'undefined' != typeof a.call && 'undefined' != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable('call'))
              return 'function';
          } else
            return 'null';
        else if ('function' == b && 'undefined' == typeof a.call)
          return 'object';
        return b;
      }, aa = function (a) {
        var b = s(a);
        return 'array' == b || 'object' == b && 'number' == typeof a.length;
      }, u = function (a) {
        return 'string' == typeof a;
      }, ba = function (a) {
        var b = typeof a;
        return 'object' == b && a != l || 'function' == b;
      }, ca = function (a, b, c) {
        return a.call.apply(a.bind, arguments);
      }, da = function (a, b, c) {
        __called[25] = true;
        if (!a)
          throw Error();
        if (2 < arguments.length) {
          var d = Array.prototype.slice.call(arguments, 2);
          return function () {
            __called[24] = true;
            var c = Array.prototype.slice.call(arguments);
            Array.prototype.unshift.apply(c, d);
            return a.apply(b, c);
          };
        }
        return function () {
          return a.apply(b, arguments);
        };
      }, v = function (a, b, c) {
        __called[26] = true;
        v = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf('native code') ? ca : da;
        return v.apply(l, arguments);
      }, ea = function (a, b) {
        __called[28] = true;
        var c = Array.prototype.slice.call(arguments, 1);
        return function () {
          __called[27] = true;
          var b = Array.prototype.slice.call(arguments);
          b.unshift.apply(b, c);
          return a.apply(this, b);
        };
      }, fa = Date.now || function () {
        return +new Date();
      };
    window.gbar.tev && window.gbar.tev(3, 'm');
    window.gbar.bls && window.gbar.bls('m');
    var la = function (a) {
        __called[29] = true;
        if (!ga.test(a))
          return a;
        -1 != a.indexOf('&') && (a = a.replace(ha, '&amp;'));
        -1 != a.indexOf('<') && (a = a.replace(ia, '&lt;'));
        -1 != a.indexOf('>') && (a = a.replace(ja, '&gt;'));
        -1 != a.indexOf('"') && (a = a.replace(ka, '&quot;'));
        return a;
      }, ha = /&/g, ia = /</g, ja = />/g, ka = /\"/g, ga = /[&<>\"]/;
    var w = Array.prototype, ma = w.indexOf ? function (a, b, c) {
        return w.indexOf.call(a, b, c);
      } : function (a, b, c) {
        __called[30] = true;
        c = c == l ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
        if (u(a))
          return !u(b) || 1 != b.length ? -1 : a.indexOf(b, c);
        for (; c < a.length; c++)
          if (c in a && a[c] === b)
            return c;
        return -1;
      }, na = w.forEach ? function (a, b, c) {
        w.forEach.call(a, b, c);
      } : function (a, b, c) {
        for (var d = a.length, e = u(a) ? a.split('') : a, f = 0; f < d; f++)
          f in e && b.call(c, e[f], f, a);
      }, oa = w.filter ? function (a, b, c) {
        return w.filter.call(a, b, c);
      } : function (a, b, c) {
        __called[31] = true;
        for (var d = a.length, e = [], f = 0, g = u(a) ? a.split('') : a, h = 0; h < d; h++)
          if (h in g) {
            var k = g[h];
            b.call(c, k, h, a) && (e[f++] = k);
          }
        return e;
      }, pa = function (a) {
        var b = a.length;
        if (0 < b) {
          for (var c = Array(b), d = 0; d < b; d++)
            c[d] = a[d];
          return c;
        }
        return [];
      }, qa = function (a, b, c) {
        return 2 >= arguments.length ? w.slice.call(a, b) : w.slice.call(a, b, c);
      };
    var x = function (a, b) {
      this.x = a !== i ? a : 0;
      this.y = b !== i ? b : 0;
    };
    var ra = function (a, b) {
      this.width = a;
      this.height = b;
    };
    ra.prototype.floor = function () {
      this.width = Math.floor(this.width);
      this.height = Math.floor(this.height);
      return this;
    };
    var sa = function (a, b) {
        for (var c in a)
          b.call(i, a[c], c, a);
      }, ta = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(','), ua = function (a, b) {
        __called[32] = true;
        for (var c, d, e = 1; e < arguments.length; e++) {
          d = arguments[e];
          for (c in d)
            a[c] = d[c];
          for (var f = 0; f < ta.length; f++)
            c = ta[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
        }
      };
    var va, wa, xa, ya, za = function () {
        return o.navigator ? o.navigator.userAgent : l;
      };
    ya = xa = wa = va = m;
    var Aa;
    if (Aa = za()) {
      var Ba = o.navigator;
      va = 0 == Aa.indexOf('Opera');
      wa = !va && -1 != Aa.indexOf('MSIE');
      xa = !va && -1 != Aa.indexOf('WebKit');
      ya = !va && !xa && 'Gecko' == Ba.product;
    }
    var Ca = va, C = wa, Da = ya, Ea = xa, Fa;
    a: {
      var Ga = '', Ha;
      if (Ca && o.opera)
        var Ia = o.opera.version, Ga = 'function' == typeof Ia ? Ia() : Ia;
      else if (Da ? Ha = /rv\:([^\);]+)(\)|;)/ : C ? Ha = /MSIE\s+([^\);]+)(\)|;)/ : Ea && (Ha = /WebKit\/(\S+)/), Ha)
        var Ja = Ha.exec(za()), Ga = Ja ? Ja[1] : '';
      if (C) {
        var Ka, La = o.document;
        Ka = La ? La.documentMode : i;
        if (Ka > parseFloat(Ga)) {
          Fa = '' + Ka;
          break a;
        }
      }
      Fa = Ga;
    }
    var Oa = Fa, Pa = {}, Qa = function (a) {
        __called[33] = true;
        var b;
        if (!(b = Pa[a])) {
          b = 0;
          for (var c = ('' + Oa).replace(/^[\s\xa0]+|[\s\xa0]+$/g, '').split('.'), d = ('' + a).replace(/^[\s\xa0]+|[\s\xa0]+$/g, '').split('.'), e = Math.max(c.length, d.length), f = 0; 0 == b && f < e; f++) {
            var g = c[f] || '', h = d[f] || '', k = RegExp('(\\d*)(\\D*)', 'g'), q = RegExp('(\\d*)(\\D*)', 'g');
            do {
              var r = k.exec(g) || [
                  '',
                  '',
                  ''
                ], t = q.exec(h) || [
                  '',
                  '',
                  ''
                ];
              if (0 == r[0].length && 0 == t[0].length)
                break;
              b = ((0 == r[1].length ? 0 : parseInt(r[1], 10)) < (0 == t[1].length ? 0 : parseInt(t[1], 10)) ? -1 : (0 == r[1].length ? 0 : parseInt(r[1], 10)) > (0 == t[1].length ? 0 : parseInt(t[1], 10)) ? 1 : 0) || ((0 == r[2].length) < (0 == t[2].length) ? -1 : (0 == r[2].length) > (0 == t[2].length) ? 1 : 0) || (r[2] < t[2] ? -1 : r[2] > t[2] ? 1 : 0);
            } while (0 == b);
          }
          b = Pa[a] = 0 <= b;
        }
        return b;
      }, Ra = {}, Sa = function (a) {
        return Ra[a] || (Ra[a] = C && !(!document.documentMode) && document.documentMode >= a);
      };
    var Ta, Ua = !C || Sa(9);
    !Da && !C || C && Sa(9) || Da && Qa('1.9.1');
    var Va = C && !Qa('9');
    var Wa = function (a) {
        a = a.className;
        return u(a) && a.match(/\S+/g) || [];
      }, Ya = function (a, b) {
        __called[34] = true;
        var c = Wa(a), d = qa(arguments, 1), e = c.length + d.length;
        Xa(c, d);
        a.className = c.join(' ');
        return c.length == e;
      }, $a = function (a, b) {
        __called[35] = true;
        var c = Wa(a), d = qa(arguments, 1), e = Za(c, d);
        a.className = e.join(' ');
        return e.length == c.length - d.length;
      }, Xa = function (a, b) {
        for (var c = 0; c < b.length; c++)
          0 <= ma(a, b[c]) || a.push(b[c]);
      }, Za = function (a, b) {
        return oa(a, function (a) {
          return !(0 <= ma(b, a));
        });
      };
    var cb = function (a) {
        return a ? new ab(bb(a)) : Ta || (Ta = new ab());
      }, eb = function (a, b) {
        __called[36] = true;
        var c = b || document;
        return c.querySelectorAll && c.querySelector ? c.querySelectorAll('.' + a) : c.getElementsByClassName ? c.getElementsByClassName(a) : db(a, b);
      }, fb = function (a, b) {
        __called[37] = true;
        var c = b || document, d = l;
        return (d = c.querySelectorAll && c.querySelector ? c.querySelector('.' + a) : eb(a, b)[0]) || l;
      }, db = function (a, b) {
        __called[38] = true;
        var c, d, e, f;
        c = b || document;
        if (c.querySelectorAll && c.querySelector && a)
          return c.querySelectorAll('' + (a ? '.' + a : ''));
        if (a && c.getElementsByClassName) {
          var g = c.getElementsByClassName(a);
          return g;
        }
        g = c.getElementsByTagName('*');
        if (a) {
          f = {};
          for (d = e = 0; c = g[d]; d++) {
            var h = c.className;
            'function' == typeof h.split && 0 <= ma(h.split(/\s+/), a) && (f[e++] = c);
          }
          f.length = e;
          return f;
        }
        return g;
      }, hb = function (a, b) {
        __called[40] = true;
        sa(b, function (b, d) {
          __called[39] = true;
          'style' == d ? a.style.cssText = b : 'class' == d ? a.className = b : 'for' == d ? a.htmlFor = b : d in gb ? a.setAttribute(gb[d], b) : 0 == d.lastIndexOf('aria-', 0) || 0 == d.lastIndexOf('data-', 0) ? a.setAttribute(d, b) : a[d] = b;
        });
      }, gb = {
        cellpadding: 'cellPadding',
        cellspacing: 'cellSpacing',
        colspan: 'colSpan',
        frameborder: 'frameBorder',
        height: 'height',
        maxlength: 'maxLength',
        role: 'role',
        rowspan: 'rowSpan',
        type: 'type',
        usemap: 'useMap',
        valign: 'vAlign',
        width: 'width'
      }, jb = function (a, b, c) {
        __called[41] = true;
        var d = arguments, e = document, f = d[0], g = d[1];
        if (!Ua && g && (g.name || g.type)) {
          f = [
            '<',
            f
          ];
          g.name && f.push(' name="', la(g.name), '"');
          if (g.type) {
            f.push(' type="', la(g.type), '"');
            var h = {};
            ua(h, g);
            delete h.type;
            g = h;
          }
          f.push('>');
          f = f.join('');
        }
        f = e.createElement(f);
        g && (u(g) ? f.className = g : 'array' == s(g) ? Ya.apply(l, [
          f
        ].concat(g)) : hb(f, g));
        2 < d.length && ib(e, f, d, 2);
        return f;
      }, ib = function (a, b, c, d) {
        __called[42] = true;
        function e(c) {
          c && b.appendChild(u(c) ? a.createTextNode(c) : c);
        }
        for (; d < c.length; d++) {
          var f = c[d];
          if (aa(f) && !(ba(f) && 0 < f.nodeType)) {
            var g;
            a: {
              if (f && 'number' == typeof f.length) {
                if (ba(f)) {
                  g = 'function' == typeof f.item || 'string' == typeof f.item;
                  break a;
                }
                if ('function' == s(f)) {
                  g = 'function' == typeof f.item;
                  break a;
                }
              }
              g = m;
            }
            na(g ? pa(f) : f, e);
          } else
            e(f);
        }
      }, kb = function (a, b) {
        ib(bb(a), a, arguments, 1);
      }, bb = function (a) {
        return 9 == a.nodeType ? a : a.ownerDocument || a.document;
      }, lb = {
        SCRIPT: 1,
        STYLE: 1,
        HEAD: 1,
        IFRAME: 1,
        OBJECT: 1
      }, mb = {
        IMG: ' ',
        BR: '\n'
      }, nb = function (a, b, c) {
        __called[43] = true;
        if (!(a.nodeName in lb))
          if (3 == a.nodeType)
            c ? b.push(('' + a.nodeValue).replace(/(\r\n|\r|\n)/g, '')) : b.push(a.nodeValue);
          else if (a.nodeName in mb)
            b.push(mb[a.nodeName]);
          else
            for (a = a.firstChild; a;)
              nb(a, b, c), a = a.nextSibling;
      }, ab = function (a) {
        this.r = a || o.document || document;
      };
    ab.prototype.createElement = function (a) {
      return this.r.createElement(a);
    };
    ab.prototype.createTextNode = function (a) {
      return this.r.createTextNode(a);
    };
    var pb = function (a) {
      __called[44] = true;
      var b = a.r, a = !Ea && 'CSS1Compat' == b.compatMode ? b.documentElement : b.body, b = b.parentWindow || b.defaultView;
      return new x(b.pageXOffset || a.scrollLeft, b.pageYOffset || a.scrollTop);
    };
    ab.prototype.appendChild = function (a, b) {
      a.appendChild(b);
    };
    var qb = function (a) {
      qb[' '](a);
      return a;
    };
    qb[' '] = function () {
    };
    var rb = function (a, b) {
      try {
        return qb(a[b]), j;
      } catch (c) {
      }
      return m;
    };
    var E = function (a, b, c, d) {
      d = d || {};
      d._sn = [
        'm',
        b,
        c
      ].join('.');
      window.gbar.logger.ml(a, d);
    };
    var F = window.gbar;
    var sb = {
        vb: 1,
        Pb: 2,
        Ob: 3,
        xb: 4,
        wb: 5,
        zb: 6,
        yb: 7,
        Ib: 8
      };
    var tb = [], ub = l, G = function (a, b) {
        tb.push([
          a,
          b
        ]);
      }, vb = function (a, b) {
        var c = l;
        b && (c = {
          m: b
        });
        F.tev && F.tev(a, 'm', c);
      };
    p('gbar.mddn', function () {
      for (var a = [], b = 0, c; c = tb[b]; ++b)
        a.push(c[0]);
      return a.join(',');
    }, i);
    var wb, Db = function () {
        __called[45] = true;
        xb();
        p('gbar.addHover', yb, i);
        p('gbar.close', zb, i);
        p('gbar.cls', Ab, i);
        p('gbar.tg', Bb, i);
        F.adh('gbd4', function () {
          Cb(5);
        });
        F.adh('gbd5', function () {
          Cb(6);
        });
      }, Eb = function () {
        wb === i && (wb = /MSIE (\d+)\.(\d+);/.exec(navigator.userAgent));
        return wb;
      }, Fb = function () {
        var a = Eb();
        return a && 1 < a.length ? new Number(a[1]) : l;
      }, Gb = '', I = i, Hb = i, Ib = i, Jb = i, Kb = m, Lb = i, Mb = 'gbzt,gbgt,gbg0l,gbmt,gbml1,gbmlb,gbqfb,gbqfba,gbqfbb,gbqfqw'.split(','), K = function (a, b, c, d) {
        __called[46] = true;
        var e = 'on' + b;
        if (a.addEventListener)
          a.addEventListener(b, c, !(!d));
        else if (a.attachEvent)
          a.attachEvent(e, c);
        else {
          var f = a[e];
          a[e] = function () {
            var a = f.apply(this, arguments), b = c.apply(this, arguments);
            return a == i ? b : b == i ? a : b && a;
          };
        }
      }, L = function (a) {
        return document.getElementById(a);
      }, Nb = function () {
        __called[47] = true;
        var a = L('gbx1');
        return F.kn && F.kn() && a ? a.clientWidth : document.documentElement && document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth;
      }, Ob = function (a) {
        __called[48] = true;
        var b = {};
        if ('none' != a.style.display)
          return b.width = a.offsetWidth, b.height = a.offsetHeight, b;
        var c = a.style, d = c.display, e = c.visibility, f = c.position;
        c.visibility = 'hidden';
        c.position = 'absolute';
        c.display = 'inline';
        var g;
        g = a.offsetWidth;
        a = a.offsetHeight;
        c.display = d;
        c.position = f;
        c.visibility = e;
        b.width = g;
        b.height = a;
        return b;
      }, Pb = function (a) {
        __called[49] = true;
        if (Ib === i) {
          var b = document.body.style;
          Ib = !(b.WebkitBoxShadow !== i || b.MozBoxShadow !== i || b.boxShadow !== i || b.BoxShadow !== i);
        }
        if (Ib) {
          var b = a.id + '-gbxms', c = L(b);
          c || (c = document.createElement('span'), c.id = b, c.className = 'gbxms', a.appendChild(c));
          Jb === i && (Jb = c.offsetHeight < a.offsetHeight / 2);
          Jb && (c.style.height = a.offsetHeight - 5 + 'px', c.style.width = a.offsetWidth - 3 + 'px');
        }
      }, Qb = function (a, b) {
        __called[50] = true;
        if (a) {
          var c = a.style, d = b || L(Gb);
          d && (a.parentNode && a.parentNode.appendChild(d), d = d.style, d.width = a.offsetWidth + 'px', d.height = a.offsetHeight + 'px', d.left = c.left, d.right = c.right);
        }
      }, Rb = function (a) {
        __called[51] = true;
        try {
          if (I && (!F.eh[I] || !(!a && !window.event ? 0 : (a || window.event).ctrlKey || (a || window.event).metaKey || 2 == (a || window.event).which))) {
            var b = L(Gb);
            b && (b.style.cssText = '', b.style.visibility = 'hidden');
            var c = L(I);
            if (c) {
              c.style.cssText = '';
              c.style.visibility = 'hidden';
              var d = c.getAttribute('aria-owner'), e = d ? L(d) : l;
              e && (M(e.parentNode, 'gbto'), e.blur());
            }
            Hb && (Hb(), Hb = i);
            var f = F.ch[I];
            if (f)
              for (var a = 0, g; g = f[a]; a++)
                try {
                  g();
                } catch (h) {
                  E(h, 'sb', 'cdd1');
                }
            I = i;
          }
        } catch (k) {
          E(k, 'sb', 'cdd2');
        }
      }, Sb = function (a, b) {
        __called[52] = true;
        try {
          if (I)
            for (var c = b.target || b.srcElement; 'a' != c.tagName.toLowerCase();) {
              if (c.id == a)
                return b.cancelBubble = j, c;
              c = c.parentNode;
            }
        } catch (d) {
          E(d, 'sb', 'kdo');
        }
        return l;
      }, Cb = function (a) {
        var b = {
            s: !I ? 'o' : 'c'
          };
        -1 != a && F.logger.il(a, b);
      }, Tb = function (a, b) {
        if (rb(a, 'className')) {
          var c = a.className;
          N(a, b) || (a.className += ('' != c ? ' ' : '') + b);
        }
      }, M = function (a, b) {
        __called[53] = true;
        var c = a.className, d = RegExp('\\s?\\b' + b + '\\b');
        c && c.match(d) && (a.className = c.replace(d, ''));
      }, N = function (a, b) {
        var c = a.className;
        return !(!c || !c.match(RegExp('\\b' + b + '\\b')));
      }, Bb = function (a, b, c, d) {
        __called[54] = true;
        try {
          a = a || window.event;
          c = c || m;
          if (!Gb) {
            var e = document.createElement('iframe');
            e.frameBorder = '0';
            e.tabIndex = '-1';
            Gb = e.id = 'gbs';
            e.src = 'javascript:\'\'';
            L('gbw').appendChild(e);
          }
          Kb || (K(document, 'click', zb), K(document, 'keyup', Ub), Kb = j);
          c || (a.preventDefault && a.preventDefault(), a.returnValue = m, a.cancelBubble = j);
          if (!b)
            for (var b = a.target || a.srcElement, f = b.parentNode.id; !N(b.parentNode, 'gbt');) {
              if ('gb' == f)
                return;
              b = b.parentNode;
              f = b.parentNode.id;
            }
          var g = b.getAttribute('aria-owns');
          if (g && g.length)
            if (d || b.focus(), I == g)
              Ab(g);
            else {
              var h = b.offsetWidth, a = 0;
              do
                a += b.offsetLeft || 0;
              while (b = b.offsetParent);
              if (Lb === i) {
                var k = document.body, q, r = document.defaultView;
                if (r && r.getComputedStyle) {
                  var t = r.getComputedStyle(k, '');
                  t && (q = t.direction);
                } else
                  q = k.currentStyle ? k.currentStyle.direction : k.style.direction;
                Lb = 'rtl' == q;
              }
              k = Lb ? m : j;
              b = Lb ? m : j;
              'gbd' == g && (b = !b);
              'gbz' == g && (b = !b, k = !k);
              I && Rb();
              var A = F.bh[g];
              if (A)
                for (var B = 0, y; y = A[B]; B++)
                  try {
                    y();
                  } catch (z) {
                    E(z, 'sb', 't1');
                  }
              var A = a, D = L(g);
              if (D) {
                var T = D.style, H = D.offsetWidth;
                if (H < h) {
                  T.width = h + 'px';
                  var H = h, J = D.offsetWidth;
                  J != h && (T.width = h - (J - h) + 'px');
                }
                J = 5;
                if (0 > A)
                  var U = Nb(), P = window.document, Ma = 'CSS1Compat' == P.compatMode ? P.documentElement : P.body, J = J - (U - new ra(Ma.clientWidth, Ma.clientHeight).width);
                var Na, V, U = Nb();
                if (b) {
                  if (Na = k ? Math.max(U - A - H, J) : U - A - h, V = -(U - A - h - Na), Eb()) {
                    var uc = Fb();
                    (6 == uc || 7 == uc && 'BackCompat' == document.compatMode) && (V -= 2);
                  }
                } else
                  Na = k ? A : Math.max(A + h - H, J), V = Na - A;
                var vc = L('gbw'), wc = L('gb');
                if (vc && wc) {
                  var xc = vc.offsetLeft;
                  xc != wc.offsetLeft && (V -= xc);
                }
                Pb(D);
                T.right = b ? V + 'px' : 'auto';
                T.left = b ? 'auto' : V + 'px';
                T.visibility = 'visible';
                var yc = D.getAttribute('aria-owner'), zc = yc ? L(yc) : l;
                zc && Tb(zc.parentNode, 'gbto');
                var ob = L(Gb);
                ob && (Qb(D, ob), ob.style.visibility = 'visible');
                I = g;
              }
              var Ac = F.dh[g];
              if (Ac)
                for (B = 0; y = Ac[B]; B++)
                  try {
                    y();
                  } catch (Nd) {
                    E(Nd, 'sb', 't2');
                  }
            }
        } catch (Od) {
          E(Od, 'sb', 't3');
        }
      }, Ub = function (a) {
        __called[55] = true;
        if (I)
          try {
            var a = a || window.event, b = a.target || a.srcElement;
            if (a.keyCode && b)
              if (a.keyCode && 27 == a.keyCode)
                Rb();
              else if ('a' == b.tagName.toLowerCase() && -1 != b.className.indexOf('gbgt') && (13 == a.keyCode || 3 == a.keyCode)) {
                var c = document.getElementById(I);
                if (c && 'gbz' != c.id) {
                  var d = c.getElementsByTagName('a');
                  d && d.length && d[0].focus && d[0].focus();
                }
              }
          } catch (e) {
            E(e, 'sb', 'kuh');
          }
      }, xb = function () {
        __called[56] = true;
        var a = L('gb');
        if (a) {
          M(a, 'gbpdjs');
          for (var b = a.getElementsByTagName('a'), a = [], c = L('gbqfw'), d = 0, e; e = b[d]; d++)
            a.push(e);
          if (c) {
            var f = L('gbqfqw'), d = L('gbqfwc'), b = L('gbqfwe');
            e = c.getElementsByTagName('button');
            c = [];
            f && !F.sg.c && c.push(f);
            if (e && 0 < e.length)
              for (var f = 0, g; g = e[f]; f++)
                c.push(g);
            d && b && (c.push(d), c.push(b));
            for (d = 0; b = c[d]; d++)
              a.push(b);
          }
          for (d = 0; c = a[d]; d++)
            (b = Vb(c)) && Wb(c, ea(Xb, b));
        }
      }, yb = function (a) {
        var b = Vb(a);
        b && Wb(a, ea(Xb, b));
      }, Vb = function (a) {
        for (var b = 0, c; c = Mb[b]; b++)
          if (N(a, c))
            return c;
      }, Wb = function (a, b) {
        __called[59] = true;
        var c = function (a, b) {
            __called[58] = true;
            return function (c) {
              __called[57] = true;
              try {
                var c = c || window.event, g, h = c.relatedTarget;
                g = h && rb(h, 'parentNode') ? h : l;
                var k;
                if (!(k = a === g))
                  if (a === g)
                    k = m;
                  else {
                    for (; g && g !== a;)
                      g = g.parentNode;
                    k = g === a;
                  }
                k || b(c, a);
              } catch (q) {
                E(q, 'sb', 'bhe');
              }
            };
          }(a, b);
        K(a, 'mouseover', c);
        K(a, 'mouseout', c);
      }, Xb = function (a, b, c) {
        __called[60] = true;
        try {
          if (a += '-hvr', 'mouseover' == b.type) {
            Tb(c, a);
            var d = document.activeElement;
            if (d && rb(d, 'className')) {
              var e = N(d, 'gbgt') || N(d, 'gbzt'), f = N(c, 'gbgt') || N(c, 'gbzt');
              e && f && d.blur();
            }
          } else
            'mouseout' == b.type && M(c, a);
        } catch (g) {
          E(g, 'sb', 'moaoh');
        }
      }, Yb = function (a) {
        for (; a && a.hasChildNodes();)
          a.removeChild(a.firstChild);
      }, zb = function (a) {
        Rb(a);
      }, Ab = function (a) {
        a == I && Rb();
      }, O = function (a, b) {
        var c = document.createElement(a);
        c.className = b;
        return c;
      }, Zb = function (a) {
        a && 'visible' == a.style.visibility && (Pb(a), Qb(a));
      };
    G('base', {
      init: function () {
        Db();
      }
    });
    var Q = function (a, b) {
        __called[61] = true;
        var c;
        a: {
          c = bb(a);
          if (c.defaultView && c.defaultView.getComputedStyle && (c = c.defaultView.getComputedStyle(a, l))) {
            c = c[b] || c.getPropertyValue(b) || '';
            break a;
          }
          c = '';
        }
        return c || (a.currentStyle ? a.currentStyle[b] : l) || a.style && a.style[b];
      }, $b = function (a) {
        __called[62] = true;
        var b = a.getBoundingClientRect();
        C && (a = a.ownerDocument, b.left -= a.documentElement.clientLeft + a.body.clientLeft, b.top -= a.documentElement.clientTop + a.body.clientTop);
        return b;
      }, ac = function (a) {
        __called[63] = true;
        if (C && !Sa(8))
          return a.offsetParent;
        for (var b = bb(a), c = Q(a, 'position'), d = 'fixed' == c || 'absolute' == c, a = a.parentNode; a && a != b; a = a.parentNode)
          if (c = Q(a, 'position'), d = d && 'static' == c && a != b.documentElement && a != b.body, !d && (a.scrollWidth > a.clientWidth || a.scrollHeight > a.clientHeight || 'fixed' == c || 'absolute' == c || 'relative' == c))
            return a;
        return l;
      }, bc = function (a) {
        __called[64] = true;
        var b, c = bb(a), d = Q(a, 'position'), e = Da && c.getBoxObjectFor && !a.getBoundingClientRect && 'absolute' == d && (b = c.getBoxObjectFor(a)) && (0 > b.screenX || 0 > b.screenY), f = new x(0, 0), g;
        b = c ? bb(c) : document;
        if (g = C)
          if (g = !Sa(9))
            g = 'CSS1Compat' != cb(b).r.compatMode;
        g = g ? b.body : b.documentElement;
        if (a == g)
          return f;
        if (a.getBoundingClientRect)
          b = $b(a), a = pb(cb(c)), f.x = b.left + a.x, f.y = b.top + a.y;
        else if (c.getBoxObjectFor && !e)
          b = c.getBoxObjectFor(a), a = c.getBoxObjectFor(g), f.x = b.screenX - a.screenX, f.y = b.screenY - a.screenY;
        else {
          e = a;
          do {
            f.x += e.offsetLeft;
            f.y += e.offsetTop;
            e != a && (f.x += e.clientLeft || 0, f.y += e.clientTop || 0);
            if (Ea && 'fixed' == Q(e, 'position')) {
              f.x += c.body.scrollLeft;
              f.y += c.body.scrollTop;
              break;
            }
            e = e.offsetParent;
          } while (e && e != a);
          if (Ca || Ea && 'absolute' == d)
            f.y -= c.body.offsetTop;
          for (e = a; (e = ac(e)) && e != c.body && e != g;)
            if (f.x -= e.scrollLeft, !Ca || 'TR' != e.tagName)
              f.y -= e.scrollTop;
        }
        return f;
      }, dc = function (a) {
        __called[65] = true;
        if ('none' != Q(a, 'display'))
          return cc(a);
        var b = a.style, c = b.display, d = b.visibility, e = b.position;
        b.visibility = 'hidden';
        b.position = 'absolute';
        b.display = 'inline';
        a = cc(a);
        b.display = c;
        b.position = e;
        b.visibility = d;
        return a;
      }, cc = function (a) {
        __called[66] = true;
        var b = a.offsetWidth, c = a.offsetHeight, d = Ea && !b && !c;
        return (b === i || d) && a.getBoundingClientRect ? (a = $b(a), new ra(a.right - a.left, a.bottom - a.top)) : new ra(b, c);
      }, ec = function (a, b) {
        __called[67] = true;
        var c = a.style;
        'opacity' in c ? c.opacity = b : 'MozOpacity' in c ? c.MozOpacity = b : 'filter' in c && (c.filter = '' === b ? '' : 'alpha(opacity=' + 100 * b + ')');
      }, fc = /matrix\([0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, ([0-9\.\-]+)p?x?, ([0-9\.\-]+)p?x?\)/;
    var gc = window.gbar.i;
    var hc = function (a, b) {
      __called[68] = true;
      this.z = a;
      this.P = b;
      !this.z || !this.P ? E(Error('Missing DOM'), 'sbr', 'init') : (this.ba = fb('gbsbt', this.z), this.aa = fb('gbsbb', this.z), !this.ba || !this.aa ? E(Error('Missing Drop Shadows for ' + b.id), 'sbr', 'init') : (this.k(), K(b, 'scroll', v(this.k, this), m)));
    };
    hc.prototype.k = function () {
      __called[69] = true;
      try {
        var a = this.P.scrollTop, b = this.P.scrollHeight - this.P.clientHeight;
        0 === b ? (ec(this.ba, 0), ec(this.aa, 0)) : (ec(this.ba, a / b), ec(this.aa, (b - a) / b));
      } catch (c) {
        E(c, 'sbr', 'sh');
      }
    };
    var R = function (a) {
      __called[70] = true;
      var b = v(this.Na, this);
      p('gbar.pcm', b, i);
      b = v(this.La, this);
      p('gbar.paa', b, i);
      b = v(this.Oa, this);
      p('gbar.pca', b, i);
      b = v(this.Ra, this);
      p('gbar.prm', b, i);
      b = v(this.ka, this);
      p('gbar.pge', b, i);
      b = v(this.ma, this);
      p('gbar.ppe', b, i);
      b = v(this.Ka, this);
      p('gbar.pae', b, i);
      b = v(this.Ta, this);
      p('gbar.spn', b, i);
      b = v(this.Ua, this);
      p('gbar.spp', b, i);
      b = v(this.Va, this);
      p('gbar.sps', b, i);
      b = v(this.Wa, this);
      p('gbar.spd', b, i);
      this.T = this.la = this.ia = this.L = this.ja = m;
      this.Fa = a.mg || '%1$s';
      this.Ea = a.md || '%1$s';
      this.J = a.ppa;
      this.Ma = a.cp;
      this.Ia = a.mh;
      this.Pa = a.d;
      this.C = a.e;
      this.U = a.p;
      this.Ja = a.ppl;
      this.ha = a.pp;
      this.Ga = a.ppm;
      this.Sa = a.s;
      this.Ha = a.sanw;
      (b = L('gbi4i')) && b.loadError && this.ka();
      (b = L('gbmpi')) && b.loadError && this.ma();
      this.ja || ((b = L('gbd4')) && K(b, 'click', v(Sb, this, 'gbd4'), j), this.ja = j);
      try {
        var c = L('gbmpas'), d = L('gbmpasb');
        this.Sa && c && d && (this.b = new hc(d, c), F.adh('gbd4', v(this.Qa, this)));
      } catch (e) {
        E(e, 'sp', 'ssb');
      }
      if (this.Ma)
        try {
          var f = document.getElementById('gbd4');
          f && (K(f, 'mouseover', v(this.V, this, $a), m), K(f, 'mouseout', v(this.V, this, Ya), m), this.V(Ya));
        } catch (g) {
          E(g, 'sp', 'smh');
        }
      if (!this.Pa && (c = L('gbmpn')) && ic(c) == this.C)
        c = this.C.indexOf('@'), 0 <= c && jc(this.C.substring(0, c));
      a.xp && (a = L('gbg4'), c = L('gbg6'), a && (K(a, 'mouseover', v(this.W, this)), this.J && K(a, 'mouseover', v(this.na, this))), c && (K(c, 'mouseover', v(this.W, this)), this.J && K(c, 'mouseover', v(this.na, this))));
      if (this.J && (this.K = {}, a = L('gbmpas'))) {
        a = eb('gbmt', a);
        for (c = 0; d = a[c]; ++c)
          d && (f = fb('gbps3', d), d = fb('gbmpia', d), f && d && (b = i, Va && 'innerText' in f ? b = f.innerText.replace(/(\r\n|\r|\n)/g, '\n') : (b = [], nb(f, b, j), b = b.join('')), b = b.replace(/ \xAD /g, ' ').replace(/\xAD/g, ''), b = b.replace(/\u200B/g, ''), Va || (b = b.replace(/ +/g, ' ')), ' ' != b && (b = b.replace(/^\s*/, '')), f = b, d = d.getAttribute('data-asrc'), this.K[f] = d));
      }
      this.ga = [];
    };
    n = R.prototype;
    n.V = function (a) {
      __called[71] = true;
      var b = document.getElementById('gbmpicb'), c = document.getElementById('gbmpicp');
      b && a(b, 'gbxo');
      c && a(c, 'gbxo');
    };
    n.Na = function () {
      __called[72] = true;
      try {
        var a = L('gbmpas');
        a && Yb(a);
        this.b && this.b.k();
        this.L = m;
        kc(this, m);
      } catch (b) {
        E(b, 'sp', 'cam');
      }
    };
    n.Ra = function () {
      __called[73] = true;
      var a = L('gbmpdv'), b = L('gbmps');
      if (a && b && !this.L) {
        var c = L('gbmpal'), d = L('gbpm');
        if (c) {
          a.style.width = '';
          b.style.width = '';
          c.style.width = '';
          d && (d.style.width = '1px');
          var e = Ob(a).width, f = Ob(b).width, e = e > f ? e : f;
          if (f = L('gbg4'))
            f = Ob(f).width, f > e && (e = f);
          Eb() && (f = Fb(), (6 == f || 7 == f && 'BackCompat' == document.compatMode) && (e += 2));
          e += 'px';
          a.style.width = e;
          b.style.width = e;
          c.style.width = e;
          d && (d.style.width = e);
          this.b && this.b.k();
          this.L = j;
        }
      }
    };
    n.Oa = function () {
      __called[74] = true;
      for (var a = 0, b; b = this.ga[a]; ++a)
        b && b && b.parentNode && b.parentNode.removeChild(b);
      this.b && this.b.k();
      this.L = m;
      kc(this, m);
    };
    n.La = function (a, b, c, d, e, f, g, h, k, q) {
      __called[75] = true;
      try {
        var r = L('gbmpas');
        if (a)
          for (var t = eb('gbp0', r), A = 0, B; B = t[A]; ++A)
            B && $a(B, 'gbp0');
        if (r) {
          t = 'gbmtc';
          a && (t += ' gbp0');
          f || (t += ' gbpd');
          var y = O('div', t), z = O(f ? 'a' : 'span', 'gbmt');
          if (f) {
            if (h)
              for (var D in h)
                z.setAttribute(D, h[D]);
            z.href = g;
            Wb(z, ea(Xb, 'gbmt'));
            this.Ha && (z.target = '_blank', z.rel = 'noreferrer');
          }
          if (this.J) {
            var T = O('span', 'gbmpiaw'), H = O('img', 'gbmpia');
            H.height = '48';
            H.width = '48';
            d ? H.alt = d : H.alt = e;
            a = q ? '//ssl.gstatic.com/gb/images/pluspages_48.png' : '//ssl.gstatic.com/gb/images/silhouette_48.png';
            k ? (a = k, this.K[e] = k) : this.K[e] && (a = this.K[e]);
            H.setAttribute('src', a);
            H.setAttribute('data-asrc', a);
            T.appendChild(H);
            z.appendChild(T);
          }
          var J = O('span', 'gbmpnw'), U = O('span', 'gbps');
          J.appendChild(U);
          U.appendChild(document.createTextNode(d || e));
          var P = O('span', 'gbps2');
          b ? lc(this.Ea, e, P) : c ? lc(this.Fa, e, P) : q ? P.appendChild(document.createTextNode(this.Ga)) : lc(l, e, P);
          J.appendChild(P);
          z.appendChild(J);
          y.appendChild(z);
          r.appendChild(y);
          this.ga.push(y);
          this.b && this.b.k();
          q && !this.T && kc(this, q);
        }
      } catch (Ma) {
        E(Ma, 'sp', 'aa');
      }
    };
    var lc = function (a, b, c) {
        __called[76] = true;
        var d = O('span', 'gbps3');
        d.appendChild(document.createTextNode(b));
        a ? (a = a.split('%1$s'), b = document.createTextNode(a[1]), c.appendChild(document.createTextNode(a[0])), c.appendChild(d), c.appendChild(b)) : c.appendChild(d);
      }, kc = function (a, b) {
        var c = L('gbmppc');
        c && (b ? (M(c, 'gbxx'), a.T = j) : (Tb(c, 'gbxx'), a.T = m));
      }, jc = function (a) {
        __called[77] = true;
        var b = L('gbd4'), c = L('gbmpn');
        b && c && (Yb(c), c.appendChild(document.createTextNode(a)), Zb(b));
      }, mc = function () {
        var a = L('gbmpas');
        return a ? eb('gbmpiaw', a) : l;
      };
    R.prototype.ka = function () {
      try {
        nc('gbi4i', 'gbi4id');
      } catch (a) {
        E(a, 'sp', 'gbpe');
      }
    };
    R.prototype.ma = function () {
      try {
        nc('gbmpi', 'gbmpid');
      } catch (a) {
        E(a, 'sp', 'ppe');
      }
    };
    R.prototype.Ka = function () {
      __called[78] = true;
      try {
        var a = mc();
        if (a)
          for (var b = 0, c; c = a[b]; ++b)
            c && (c.style.display = 'none');
      } catch (d) {
        E(d, 'sp', 'pae');
      }
    };
    var nc = function (a, b) {
      __called[79] = true;
      var c = L(a);
      c && (c.style.backgroundImage = '//ssl.gstatic.com/gb/images/s_513818bc.png', c.style.display = 'none');
      var d = L(b);
      d && (c.style.backgroundImage = '//ssl.gstatic.com/gb/images/s_513818bc.png', d.style.display = '', d.style.backgroundImage = 'url(//ssl.gstatic.com/gb/images/s_513818bc.png)');
    };
    R.prototype.W = function () {
      __called[80] = true;
      try {
        if (!this.ia) {
          this.ia = j;
          var a = L('gbmpi');
          a && this.U && (a.src = this.U);
        }
      } catch (b) {
        E(b, 'sp', 'swp');
      }
    };
    R.prototype.na = function () {
      __called[81] = true;
      try {
        if (!this.la) {
          this.la = j;
          var a = mc();
          if (a)
            for (var b = 0, c; c = a[b]; ++b)
              if (c) {
                var d = eb('gbmpia', c)[0];
                d.setAttribute('src', d.getAttribute('data-asrc'));
                M(c, 'gbxv');
              }
        }
      } catch (e) {
        E(e, 'sp', 'sap');
      }
    };
    R.prototype.Ta = function (a) {
      __called[82] = true;
      try {
        var b = L('gbi4t');
        ic(L('gbmpn')) == this.C || jc(a);
        ic(b) != this.C && (Yb(b), b.appendChild(document.createTextNode(a)));
      } catch (c) {
        E(c, 'sp', 'spn');
      }
    };
    var ic = function (a) {
      return a.firstChild && a.firstChild.nodeValue ? a.firstChild.nodeValue : '';
    };
    n = R.prototype;
    n.Ua = function (a) {
      __called[83] = true;
      try {
        this.ha = a;
        var b = L('gbmpi');
        if (b) {
          var c = a(b.height);
          c && (this.U = b.src = c);
        }
        var d = L('gbi4i');
        if (d) {
          var e = a(d.height);
          e && (d.src = e);
        }
      } catch (f) {
        E(f, 'sp', 'spp');
      }
    };
    n.Va = function (a) {
      __called[84] = true;
      try {
        if (this.Ja) {
          var b = L('gbi4i'), c = L('gbi4ip');
          b && c && (b.width = b.height = c.width = c.height = a, 'none' != b.style.display && (c.src = b.src, c.style.display = '', b.onload = R.prototype.Ab, b.src = this.ha(a)));
        }
      } catch (d) {
        E(d, 'sp', 'sps');
      }
    };
    n.Ab = function () {
      var a = L('gbi4i');
      a.onload = l;
      a.style.display = '';
      L('gbi4ip').style.display = 'none';
    };
    n.Wa = function () {
      try {
        var a = L('gbg4');
        this.W();
        Bb(l, a, j, j);
      } catch (b) {
        E(b, 'sp', 'sd');
      }
    };
    n.Qa = function () {
      __called[85] = true;
      try {
        var a = L('gbmpas');
        if (a) {
          var b = gc.j('Height'), c = L('gbd4'), d = new x();
          if (1 == c.nodeType) {
            if (c.getBoundingClientRect) {
              var e = $b(c);
              d.x = e.left;
              d.y = e.top;
            } else {
              var f = pb(cb(c)), g = bc(c);
              d.x = g.x - f.x;
              d.y = g.y - f.y;
            }
            if (Da && !Qa(12)) {
              var h = d, k;
              var q;
              C ? q = '-ms-transform' : Ea ? q = '-webkit-transform' : Ca ? q = '-o-transform' : Da && (q = '-moz-transform');
              var r;
              q && (r = Q(c, q));
              r || (r = Q(c, 'transform'));
              if (r) {
                var t = r.match(fc);
                k = !t ? new x(0, 0) : new x(parseFloat(t[1]), parseFloat(t[2]));
              } else
                k = new x(0, 0);
              d = new x(h.x + k.x, h.y + k.y);
            }
          } else
            h = 'function' == s(c.ua), k = c, c.targetTouches ? k = c.targetTouches[0] : h && c.ua().targetTouches && (k = c.ua().targetTouches[0]), d.x = k.clientX, d.y = k.clientY;
          var A = d.y, B = dc(c).height, b = A + B - (b - 20), y = dc(a).height, z = Math.min(y - b, this.Ia);
          a.style.maxHeight = Math.max(74, z) + 'px';
          Zb(c);
          this.b.k();
        }
      } catch (D) {
        E(D, 'sp', 'rac');
      }
    };
    G('prf', {
      init: function (a) {
        new R(a);
      }
    });
    var oc = function () {
    };
    (function (a) {
      a.Eb = function () {
        a.Fb || (a.Fb = new a());
      };
    }(oc));
    var pc = l;
    G('il', {
      init: function () {
        __called[86] = true;
        oc.Eb();
        var a;
        if (!pc) {
          a: {
            a = [
              'gbar',
              'logger'
            ];
            for (var b = o, c; c = a.shift();)
              if (b[c] != l)
                b = b[c];
              else {
                a = l;
                break a;
              }
            a = b;
          }
          pc = a || {};
        }
        a = pc;
        'function' == s(a.il) && a.il(8, i);
      }
    });
    var tc = function (a, b) {
      __called[87] = true;
      if (window.gbar.logger._itl(b))
        return b;
      var c = a.stack;
      if (c) {
        for (var c = c.replace(/\s*$/, '').split('\n'), d = [], e = 0; e < c.length; e++)
          d.push(qc(c[e]));
        c = d;
      } else
        c = rc();
      for (var d = c, e = 0, f = d.length - 1, g = 0; g <= f; g++)
        if (d[g] && 0 <= d[g].name.indexOf('_mlToken')) {
          e = g + 1;
          break;
        }
      0 == e && f--;
      c = [];
      for (g = e; g <= f; g++)
        d[g] && !(0 <= d[g].name.indexOf('_onErrorToken')) && c.push('> ' + sc(d[g]));
      d = [
        b,
        '&jsst=',
        c.join('')
      ];
      e = d.join('');
      if (!window.gbar.logger._itl(e) || 2 < c.length && (d[2] = c[0] + '...' + c[c.length - 1], e = d.join(''), !window.gbar.logger._itl(e)))
        return e;
      return b;
    };
    G('er', {
      init: function () {
        window.gbar.logger._aem = tc;
      }
    });
    var qc = function (a) {
        __called[88] = true;
        var b = a.match(Bc);
        return b ? new Cc(b[1] || '', b[2] || '', b[3] || '', '', b[4] || b[5] || '') : (b = a.match(Dc)) ? new Cc('', b[1] || '', '', b[2] || '', b[3] || '') : l;
      }, Bc = RegExp('^    at(?: (?:(.*?)\\.)?((?:new )?(?:[a-zA-Z_$][\\w$]*|<anonymous>))(?: \\[as ([a-zA-Z_$][\\w$]*)\\])?)? (?:\\(unknown source\\)|\\(native\\)|\\((?:eval at )?((?:http|https|file)://[^\\s)]+|javascript:.*)\\)|((?:http|https|file)://[^\\s)]+|javascript:.*))$'), Dc = /^([a-zA-Z_$][\w$]*)?(\(.*\))?@(?::0|((?:http|https|file):\/\/[^\s)]+|javascript:.*))$/, rc = function () {
        __called[89] = true;
        for (var a = [], b = arguments.callee.caller, c = 0; b && 20 > c;) {
          var d;
          d = (d = Function.prototype.toString.call(b).match(Ec)) ? d[1] : '';
          var e = b, f = [
              '('
            ];
          if (e.arguments)
            for (var g = 0; g < e.arguments.length; g++) {
              var h = e.arguments[g];
              0 < g && f.push(', ');
              'string' == typeof h ? f.push('"', h, '"') : f.push('' + h);
            }
          else
            f.push('unknown');
          f.push(')');
          a.push(new Cc('', d, '', f.join(''), ''));
          try {
            if (b == b.caller)
              break;
            b = b.caller;
          } catch (k) {
            break;
          }
          c++;
        }
        return a;
      }, Ec = /^function ([a-zA-Z_$][\w$]*)/, Cc = function (a, b, c, d, e) {
        this.ya = a;
        this.name = b;
        this.xa = c;
        this.qb = d;
        this.za = e;
      }, sc = function (a) {
        __called[90] = true;
        var b = [
            a.ya ? a.ya + '.' : '',
            a.name ? a.name : 'anonymous',
            a.qb,
            a.xa ? ' [as ' + a.xa + ']' : ''
          ];
        a.za && (b.push(' at '), b.push(a.za));
        a = b.join('');
        for (b = window.location.href.replace(/#.*/, ''); 0 <= a.indexOf(b);)
          a = a.replace(b, '[page]');
        return a = a.replace(/http.*?extern_js.*?\.js/g, '[xjs]');
      };
    var Fc = function (a) {
        this.r = a;
      }, Gc = /\s*;\s*/;
    Fc.prototype.isEnabled = function () {
      return navigator.cookieEnabled;
    };
    Fc.prototype.set = function (a, b, c, d, e, f) {
      __called[91] = true;
      if (/[;=\s]/.test(a))
        throw Error('Invalid cookie name "' + a + '"');
      if (/[;\r\n]/.test(b))
        throw Error('Invalid cookie value "' + b + '"');
      c !== i || (c = -1);
      e = e ? ';domain=' + e : '';
      d = d ? ';path=' + d : '';
      f = f ? ';secure' : '';
      c = 0 > c ? '' : 0 == c ? ';expires=' + new Date(1970, 1, 1).toUTCString() : ';expires=' + new Date(fa() + 1000 * c).toUTCString();
      this.r.cookie = a + '=' + b + e + d + c + f;
    };
    Fc.prototype.get = function (a, b) {
      __called[92] = true;
      for (var c = a + '=', d = (this.r.cookie || '').split(Gc), e = 0, f; f = d[e]; e++) {
        if (0 == f.indexOf(c))
          return f.substr(c.length);
        if (f == a)
          return '';
      }
      return b;
    };
    var Hc = new Fc(document);
    Hc.Qb = 3950;
    var Ic, Jc = function (a, b, c, d, e) {
        __called[93] = true;
        try {
          var f = Ic;
          if (e != i && e != l)
            if (0 <= e && 1 >= e)
              f = e;
            else {
              E(Error(b + '_' + c + '_' + e), 'up', 'log');
              return;
            }
          if (Math.random() <= f) {
            var g = [
                '//www.google.com/gen_204?atyp=i',
                'zx=' + new Date().getTime(),
                'ogsr=' + f / 1,
                'ct=' + b,
                'cad=' + c,
                'id=' + a,
                'loc=' + (window.google ? window.google.sn : ''),
                'ogprm=up'
              ];
            d && g.push(d);
            F.logger.log(g.join('&'));
          }
        } catch (h) {
          E(Error(b + '_' + c + '_' + e), 'up', 'log');
        }
      };
    p('gbar.up.sl', Jc, i);
    p('gbar.up.spl', function (a, b, c, d) {
      Jc(a, b, c, 'tpt=' + d.join(','));
    }, i);
    G('up', {
      init: function (a) {
        Ic = a.sp;
        F.up.tp();
      }
    });
    var Lc = function (a) {
        __called[94] = true;
        this.B = {};
        gc.g = v(this.nb, this);
        gc.h = v(this.mb, this);
        for (var b = this.B, a = a.p.split(':'), c = 0, d; d = a[c]; ++c)
          if (d = d.split(','), 5 == d.length) {
            var e = {};
            e.id = d[0];
            e.key = d[1];
            e.A = d[2];
            e.Jb = gc.c(d[3], 0);
            e.Kb = gc.c(d[4], 0);
            b[e.A] = e;
          }
        for (var f in this.B)
          if (this.B.hasOwnProperty(f) && (b = this.B[f], -1 == Hc.get('OGP', '').indexOf('-' + b.key))) {
            if (a = Kc[b.A])
              (a = document.getElementById(a)) && Tb(a, 'gbto');
            Jc(b.id, b.A, 'i');
          }
      }, Kc = {
        7: 'gbprc'
      };
    Lc.prototype.nb = function (a) {
      if (a = this.B[a])
        Mc(a), Jc(a.id, a.A, 'd', i, 1);
    };
    Lc.prototype.mb = function (a) {
      if (a = this.B[a])
        Mc(a), Jc(a.id, a.A, 'h', i, 1);
    };
    var Mc = function (a) {
      __called[95] = true;
      var b = Kc[a.A];
      b && (b = document.getElementById(b)) && M(b, 'gbto');
      b = a.key;
      (a = Hc.get('OGP', '')) && (a += ':');
      for (var a = a + ('-' + b), c; 50 < a.length && -1 != (c = a.indexOf(':'));)
        a = a.substring(c + 1);
      c = window.location.hostname;
      b = c.indexOf('.google.');
      c = 0 < b ? c.substring(b) : i;
      50 >= a.length && c && Hc.set('OGP', a, 2592000, '/', c);
    };
    G('pm', {
      init: function (a) {
        new Lc(a);
      }
    });
    var Nc = function (a) {
        this.v = a;
        this.a = 0;
        this.G = m;
        this.Ya = j;
        this.D = this.w = l;
      }, S = function (a) {
        return 5 == a.a || 4 == a.a;
      };
    Nc.prototype.isEnabled = function () {
      return this.Ya;
    };
    var Oc = function (a, b) {
      __called[96] = true;
      var c = b || {}, d = v(a.cb, a);
      c.fc = d;
      d = v(a.jb, a);
      c.rc = d;
      d = v(a.kb, a);
      c.sc = d;
      d = v(a.Y, a);
      c.hc = d;
      d = v(a.X, a);
      c.cc = d;
      d = v(a.ib, a);
      c.os = d;
      d = v(a.$, a);
      c.or = d;
      d = v(a.gb, a);
      c.oh = d;
      d = v(a.eb, a);
      c.oc = d;
      d = v(a.fb, a);
      c.oe = d;
      d = v(a.hb, a);
      c.oi = d;
      return c;
    };
    var Pc = function (a, b, c) {
      this.F = a || {};
      this.Z = b || 0;
      this.Xa = c || 0;
      this.pb = Oc(this);
    };
    n = Pc.prototype;
    n.jb = function (a, b, c) {
      __called[97] = true;
      try {
        a += b != l ? '_' + b : '', c.sm(this.pb, a), this.F[a] = new Nc(c);
      } catch (d) {
        return m;
      }
      return j;
    };
    n.cb = function (a, b) {
      var c = this.F[a + (b != l ? '_' + b : '')];
      return c ? c.v : l;
    };
    n.kb = function (a) {
      __called[98] = true;
      var b = W(this, a);
      if (b && (2 == b.a || 3 == b.a) && b.isEnabled() && !b.G) {
        try {
          a.sh();
        } catch (c) {
          Qc(c, 'am', 'shc');
        }
        b.G = j;
      }
    };
    n.Y = function (a) {
      __called[99] = true;
      var b = W(this, a);
      if (b && (2 == b.a || 3 == b.a || S(b)) && b.G) {
        try {
          a.hi();
        } catch (c) {
          Qc(c, 'am', 'hic');
        }
        b.G = m;
      }
    };
    n.X = function (a) {
      __called[100] = true;
      var b = W(this, a);
      if (b && 5 != b.a) {
        try {
          this.Y(a), a.cl();
        } catch (c) {
          Qc(c, 'am', 'clc');
        }
        this.O(b);
      }
    };
    n.ib = function (a) {
      if ((a = W(this, a)) && 0 == a.a)
        Rc(this, a), a.a = 1;
    };
    var Rc = function (a, b) {
        __called[101] = true;
        if (a.Z) {
          var c = setTimeout(v(function () {
              S(b) || (Sc(b, 6), Tc(this, b));
            }, a), a.Z);
          b.D = c;
        } else
          Tc(a, b);
      }, Tc = function (a, b) {
        __called[102] = true;
        var c = a.Xa - a.Z;
        0 < c && (c = setTimeout(v(function () {
          S(b) || (Sc(b, 7), b.a = 4, this.X(b.v));
        }, a), c), b.D = c);
      }, Uc = function (a) {
        a.D != l && (clearTimeout(a.D), a.D = l);
      };
    n = Pc.prototype;
    n.$ = function (a) {
      if ((a = W(this, a)) && !S(a))
        Sc(a, 5), 1 == a.a && (Uc(a), a.a = 3);
    };
    n.gb = function (a) {
      if ((a = W(this, a)) && !S(a))
        a.G = m;
    };
    n.eb = function (a) {
      var b = W(this, a);
      if (b && !S(b)) {
        try {
          this.Y(a);
        } catch (c) {
          Qc(c, 'am', 'oc');
        }
        this.O(b);
      }
    };
    n.fb = function (a, b, c, d, e, f) {
      if ((a = W(this, a)) && !S(a))
        Qc(c, d, e, a, b, f), a.a = 4, this.X(a.v);
    };
    n.hb = function (a, b, c, d) {
      if ((a = W(this, a)) && !S(a))
        Sc(a, b, c, d), 2 <= b && 4 >= b && !S(a) && (Uc(a), a.a = 2);
    };
    n.O = function (a) {
      Uc(a);
      a.a = 5;
      var b = this.F, c;
      for (c in b)
        b[c] == a && delete b[c];
    };
    var W = function (a, b) {
      return a.F[b.n];
    };
    var Vc, Wc, Xc, Yc, Zc = function (a, b, c) {
        Pc.call(this, a, b, c);
      };
    (function () {
      function a() {
      }
      a.prototype = Pc.prototype;
      Zc.wa = Pc.prototype;
      Zc.prototype = new a();
    }());
    var Qc = function (a, b, c, d, e, f) {
        f = f || {};
        d && (f._wg = d.v.n);
        e !== i && -1 != e && (f._c = e);
        E(a, b, c, f);
      }, Sc = function (a, b, c, d) {
        d = d || {};
        d._wg = a.v.n;
        d._c = b;
        c && (d._m = c);
        F.logger.il(25, d);
      };
    Zc.prototype.$ = function (a, b) {
      Zc.wa.$.call(this, a, b);
      F.wg.owrd && F.wg.owrd(a);
    };
    Zc.prototype.O = function (a) {
      Zc.wa.O.call(this, a);
      var b = this.F, c;
      for (c in b)
        b[c] == a && F.wg.owcl && F.wg.owcl(a);
    };
    G('wg', {
      init: function (a) {
        Vc = new Zc(F.wg.rg, a.tiw, a.tie);
        Oc(Vc, F.wg);
      }
    });
    var $c = 'xec,clkc,xc,rqd,rt,te'.split(','), ad = function () {
        this.f = this.Q = l;
      }, bd = function (a, b, c) {
        var d = a.f[b], a = a.Q[b];
        d != l && a != l && c.push([
          b,
          '~',
          d - a
        ].join(''));
      }, cd = function (a, b) {
        __called[103] = true;
        var c;
        if (b) {
          c = new ad();
          c.Q = {};
          var d = c.Q;
          d.t = new Date().getTime();
          for (var e = 0, f; f = $c[e]; ++e)
            d[f] = 0;
        } else
          c = l;
        a.w = c;
      }, dd = function (a) {
        return 3 == a.a && !(!a.w);
      }, ed = 0, fd = l, gd = 0, hd = 0, id = m, jd = function (a, b) {
        __called[104] = true;
        id || (fd == l && 1000 <= b ? (gd = new Date().getTime(), fd = setTimeout(function () {
          fd = l;
          0 < hd && new Date().getTime() - gd < b * hd && (id = j);
          a();
        }, b)) : E(Error(''), 'wm', 'shmt'));
      }, kd = function () {
        fd != l && (clearTimeout(fd), fd = l);
      }, ld = m, nd = function () {
        __called[105] = true;
        try {
          var a = [], b = F.wg.rg, c;
          for (c in b) {
            var d = b[c];
            if (dd(d)) {
              var e = d.w, f = '';
              if (e.f != l) {
                var g = [];
                bd(e, 't', g);
                for (var h = 0, k; k = $c[h]; ++h)
                  bd(e, k, g);
                f = g.join(',');
              } else
                f = '_h~0';
              a.push([
                c,
                '~{',
                f,
                '}'
              ].join(''));
              f = e;
              f.f && (f.Q = f.f, f.f = l);
            }
          }
          if (0 < a.length) {
            var q = {
                ogw: a.join(','),
                _cn: ed++
              };
            id && (q._tmfault = '1');
            F.logger.il(26, q);
          }
          ld = m;
          md();
        } catch (r) {
          E(r, 'wm', 'shr');
        }
      }, od = function (a, b) {
        __called[106] = true;
        try {
          a.f = {};
          var c = a.f;
          c.t = new Date().getTime();
          for (var d = 0, e; e = $c[d]; ++d)
            c[e] = b[e];
          var c = j, f = F.wg.rg, g;
          for (g in f) {
            var h = f[g];
            if (dd(h) && !h.w.f) {
              c = m;
              break;
            }
          }
          c && (kd(), nd());
        } catch (k) {
          E(k, 'wm', 'ovr');
        }
      }, pd = function () {
        __called[107] = true;
        try {
          var a = F.wg.rg, b;
          for (b in a)
            try {
              var c = a[b];
              dd(c) && c.v.vr('base', ea(od, c.w));
            } catch (d) {
              E(d, 'wm', 'dhcw');
            }
          ld = j;
          jd(nd, Wc);
        } catch (e) {
          E(e, 'wm', 'dhc');
        }
      }, md = function () {
        __called[108] = true;
        if ((0 < Xc || 0 < Yc) && !ld) {
          kd();
          var a = 0, b = m, c = F.wg.rg, d;
          for (d in c) {
            var e = c[d];
            dd(e) ? ++a : 3 == e.a && (cd(e, j), b = j, ++a);
          }
          0 < a && (a = b && 0 < Xc ? Xc : Yc, 0 < a && jd(pd, a));
        }
      }, qd = function () {
        md();
      }, rd = function (a) {
        dd(a) && (!ld || !a.w.f) && cd(a, m);
      };
    G('wm', {
      init: function (a) {
        Xc = a.thi || 0;
        Yc = a.thp || 0;
        Wc = a.tho || 0;
        hd = a.tet || 0;
        F.wg.owrd = qd;
        F.wg.owcl = rd;
        md();
      }
    });
    var sd = function () {
      this.Ba = m;
      this.Ba || (K(window, 'resize', v(this.Cb, this), j), this.Ba = j);
    };
    sd.prototype.S = 0;
    sd.prototype.Bb = function () {
      F.elg();
      this.S = 0;
    };
    sd.prototype.Cb = function () {
      __called[109] = true;
      F.elg();
      this.S && window.clearTimeout(this.S);
      this.S = window.setTimeout(v(this.Bb, this), 1500);
    };
    G('el', {
      init: function () {
        new sd();
      }
    });
    var td = function () {
      __called[110] = true;
      this.va = m;
      if (!F.sg.c) {
        var a = document.getElementById('gbqfq'), b = document.getElementById('gbqfqwb'), c = document.getElementById('gbqfqw'), d = document.getElementById('gbqfb');
        if (!this.va) {
          a && b && (K(a, 'focus', v(this.R, this, c)), K(a, 'blur', v(this.da, this, c)), K(b, 'click', v(this.ca, this, a)));
          d && (K(d, 'click', ea(Tb, d, 'gbqfb-no-focus')), K(d, 'blur', ea(M, d, 'gbqfb-no-focus')));
          var a = document.getElementById('gbqfqb'), b = document.getElementById('gbqfwd'), c = document.getElementById('gbqfwc'), d = document.getElementById('gbqfqc'), e = document.getElementById('gbqfwf'), f = document.getElementById('gbqfwe');
          a && b && d && e && (K(a, 'focus', v(this.R, this, c)), K(a, 'blur', v(this.da, this, c)), K(b, 'click', v(this.ca, this, a)), K(d, 'focus', v(this.R, this, f)), K(d, 'blur', v(this.da, this, f)), K(e, 'click', v(this.ca, this, d)));
          this.va = j;
        }
        a = document.getElementById('gbqfqw');
        document.activeElement == document.getElementById('gbqfq') && this.R(a);
      }
      a = v(this.ob, this);
      p('gbar.qfhi', a, i);
    };
    td.prototype.R = function (a) {
      try {
        a && Tb(a, 'gbqfqwf');
      } catch (b) {
        E(b, 'sf', 'stf');
      }
    };
    td.prototype.da = function (a) {
      try {
        a && M(a, 'gbqfqwf');
      } catch (b) {
        E(b, 'sf', 'stb');
      }
    };
    td.prototype.ca = function (a) {
      try {
        a && a.focus();
      } catch (b) {
        E(b, 'sf', 'sf');
      }
    };
    td.prototype.ob = function (a) {
      __called[111] = true;
      var b = document.getElementById('gbqffd');
      if (b && (b.innerHTML = '', a))
        for (var c in a) {
          var d = document.createElement('input');
          d.name = c;
          d.value = a[c];
          d.type = 'hidden';
          b.appendChild(d);
        }
    };
    G('sf', {
      init: function () {
        new td();
      }
    });
    var ud, vd, yd = function () {
        __called[112] = true;
        wd();
        xd(j);
        setTimeout(function () {
          document.getElementById('gbbbc').style.display = 'none';
        }, 1000);
        ud = i;
      }, zd = function (a) {
        __called[113] = true;
        for (var b = a[0], c = [], d = 1; 3 >= d; d++) {
          var e;
          e = (e = /^(.*?)\$(\d)\$(.*)$/.exec(b)) ? {
            index: parseInt(e[2], 10),
            Ca: e[1],
            Db: e[3]
          } : l;
          if (!e)
            break;
          if (3 < e.index)
            throw Error();
          e.Ca && c.push(e.Ca);
          c.push(jb('A', {
            href: '#gbbb' + e.index
          }, a[e.index]));
          b = e.Db;
        }
        b && c.push(b);
        for (a = document.getElementById('gbbbc'); b = a.firstChild;)
          a.removeChild(b);
        kb(a, c);
      }, Ad = function (a) {
        __called[114] = true;
        var b = a.target || a.srcElement;
        3 == b.nodeType && (b = b.parentNode);
        if (b = b.hash)
          b = parseInt(b.charAt(b.length - 1), 10), ud && ud(b), a.preventDefault && a.preventDefault(), a.returnValue = m, a.cancelBubble = j;
      }, wd = function () {
        vd && (clearTimeout(vd), vd = i);
      }, xd = function (a) {
        __called[115] = true;
        var b = document.getElementById('gbbbb').style;
        a ? (b.WebkitTransition = 'opacity 1s, -webkit-transform 0 linear 1s', b.MozTransition = 'opacity 1s, -moz-transform 0s linear 1s', b.OTransition = 'opacity 1s, -o-transform 0 linear 1s', b.Da = 'opacity 1s, transform 0 linear 1s') : (b.WebkitTransition = b.MozTransition = b.Da = '', b.OTransition = 'all 0s');
        b.opacity = '0';
        b.filter = 'alpha(opacity=0)';
        b.WebkitTransform = b.MozTransform = b.OTransform = b.transform = 'scale(.2)';
      }, Bd = function () {
        __called[116] = true;
        var a = document.getElementById('gbbbb').style;
        a.WebkitTransition = a.MozTransition = a.OTransition = a.Da = 'all 0.218s';
        a.opacity = '1';
        a.filter = 'alpha(opacity=100)';
        a.WebkitTransform = a.MozTransform = a.OTransform = a.transform = 'scale(1)';
      };
    p('gbar.bbs', function (a, b, c) {
      __called[117] = true;
      try {
        document.getElementById('gbbbc').style.display = 'inline', zd(a), ud = b, wd(), xd(m), setTimeout(Bd, 0), 0 < c && (vd = setTimeout(yd, 1000 * c));
      } catch (d) {
        E(d, 'bb', 's');
      }
    }, i);
    p('gbar.bbr', function (a, b, c) {
      __called[118] = true;
      try {
        zd(a), ud = b || ud, c && (wd(), 0 < c && (vd = setTimeout(yd, 1000 * c)));
      } catch (d) {
        E(d, 'bb', 'r');
      }
    }, i);
    p('gbar.bbh', yd, i);
    G('bub', {
      init: function () {
        __called[119] = true;
        var a = document.getElementById('gbbbb').style;
        a.WebkitBorderRadius = a.MozBorderRadius = a.Mb = '2px';
        a.WebkitBoxShadow = a.Lb = a.Nb = '0px 2px 4px rgba(0,0,0,0.2)';
        xd(m);
        a.display = 'inline-block';
        K(document.getElementById('gbbbc'), 'click', Ad);
      }
    });
    var Cd = function (a) {
      __called[120] = true;
      this.ra = L('gbd');
      this.z = L('gbmmb');
      this.N = L('gbmm');
      a.s && this.ra && this.N && this.z && (this.b = new hc(this.z, this.N), F.adh('gbd', v(this.lb, this)));
    };
    Cd.prototype.lb = function () {
      __called[121] = true;
      try {
        var a = gc.j('Height'), b = bc(this.N).y;
        this.N.style.maxHeight = a - 2 * b + 'px';
        Zb(this.ra);
        this.b.k();
      } catch (c) {
        E(c, 'mm', 'oo');
      }
    };
    G('mm', {
      init: function (a) {
        new Cd(a);
      }
    });
    var Dd = function () {
        var a = v(this.Gb, this);
        p('gbar.tsl', a, i);
        a = v(this.Hb, this);
        p('gbar.tst', a, i);
      }, Ed = [
        'gbx1',
        'gbi4t',
        'gbgs4d'
      ];
    Dd.prototype.Gb = function (a, b, c, d) {
      __called[122] = true;
      try {
        var e = document.getElementById('gbqld');
        if (e)
          e.src = a, b && (e.alt = b), c && (e.width = c), d && (e.height = d);
        else {
          var f = document.getElementById('gbqlw');
          if (f) {
            Yb(f);
            var g = jb('img', {
                id: 'gbqld',
                src: a,
                'class': 'gbqldr'
              });
            b && (g.alt = b);
            c && (g.width = c);
            d && (g.height = d);
            f.appendChild(g);
          }
        }
      } catch (h) {
        E(h, 't', 'tsl');
      }
    };
    Dd.prototype.Hb = function (a) {
      __called[123] = true;
      try {
        var b = '', c = '';
        switch (a) {
        case 'default':
          b = 'gbthc';
          c = [
            'gbtha',
            'gbthb'
          ];
          break;
        case 'light':
          b = 'gbtha';
          c = [
            'gbthc',
            'gbthb'
          ];
          break;
        case 'dark':
          b = 'gbthb';
          c = [
            'gbthc',
            'gbtha'
          ];
          break;
        default:
          return;
        }
        for (a = 0; a < Ed.length; a++) {
          var d = document.getElementById(Ed[a]);
          if (d) {
            var e = d, f = c, g = b, h = Wa(e);
            if (u(f)) {
              var k = h, q = ma(k, f);
              0 <= q && w.splice.call(k, q, 1);
            } else
              'array' == s(f) && (h = Za(h, f));
            u(g) && !(0 <= ma(h, g)) ? h.push(g) : 'array' == s(g) && Xa(h, g);
            e.className = h.join(' ');
          }
        }
      } catch (r) {
        E(r, 't', 'tst');
      }
    };
    G('t', {
      init: function () {
        new Dd();
      }
    });
    var Fd = {
        ta: 'v4_img_dt',
        sa: 'v6exp3-v4.metric.gstatic.com'
      }, Gd = {
        ta: 'ds_img_dt',
        sa: 'v6exp3-ds.metric.gstatic.com'
      }, Hd = function (a, b) {
        __called[125] = true;
        function c(a) {
          e != l && (d = Math.abs(new Date() - e), (a || m) && (d *= -1));
        }
        var d = -1, e = l;
        this.$a = function () {
          __called[124] = true;
          var b = new Image(0, 0);
          b.onload = function () {
            c();
          };
          b.onerror = b.onabort = function () {
            c(j);
          };
          e = new Date();
          b.src = a;
        };
        this.pa = function () {
          return b;
        };
        this.ab = function () {
          return d;
        };
        this.Za = function () {
          return [
            b,
            d
          ].join('=');
        };
      }, Id = function (a, b, c) {
        __called[126] = true;
        this.H = '' + a;
        'p' != this.H.charAt(0) && (this.H = 'p' + this.H);
        this.qa = b;
        this.oa = c;
        this.M = Math.floor(900000 * Math.random());
        this.M += 100000;
      }, Jd = function (a) {
        __called[128] = true;
        for (var b = [
              'i1',
              'i2'
            ], c = [], c = 0.5 <= Math.random() ? [
              Gd,
              Fd
            ] : [
              Fd,
              Gd
            ], d = [], e = 0; e < b.length; e++) {
          var f = new Hd([
              '//',
              [
                [
                  a.H,
                  a.qa,
                  a.oa,
                  a.M
                ].join('-'),
                b[e],
                c[e].sa
              ].join('-'),
              '/v6exp3/6.gif'
            ].join(''), c[e].ta);
          f.$a();
          d.push(f);
        }
        setTimeout(function () {
          __called[127] = true;
          for (var b = [
                '/gen_204?ipv6exp=3',
                'sentinel=1'
              ], c = {
                bb: []
              }, e = 0; e < d.length; e++)
            b.push(d[e].Za()), c[d[e].pa()] = d[e].ab(), c.bb.push(d[e].pa());
          b = [
            '//',
            [
              [
                a.H,
                a.qa,
                a.oa,
                a.M
              ].join('-'),
              's1-v6exp3-v4.metric.gstatic.com'
            ].join('-'),
            b.join('&')
          ].join('');
          new Image(0, 0).src = b;
        }, 30000);
      }, Ld = function () {
        __called[129] = true;
        var a = Kd[0], b = Kd[1], c = Kd[2];
        if ('https:' != document.location.protocol) {
          var d = new Id(a, b, c);
          setTimeout(function () {
            Jd(d);
          }, 10000);
        }
      };
    a:
      if (F && F.v6b) {
        for (var Md = [
              'p',
              'rnd',
              'hmac'
            ], Pd = 0; Pd < Md.length; Pd++)
          if (!F.v6b[Md[Pd]])
            break a;
        var Qd = F.v6b.p + '-' + F.v6b.rnd + '-' + F.v6b.hmac + '-if-v6exp3-v4.metric.gstatic.com';
        try {
          var Rd = Qd || window.location.hostname, Kd = [], Sd = Rd.indexOf('.metric.');
          (Kd = -1 < Sd ? Rd.substring(0, Sd).split('-') : Rd.split('.')) && 3 <= Kd.length && Ld();
        } catch (Td) {
          F.logger.ml(Td);
        }
      }
    ;
    var Ud = window, Vd = document, Wd = Ud.location, Xd = function () {
      }, Yd = /\[native code\]/, X = function (a, b, c) {
        return a[b] = a[b] || c;
      }, Zd = function (a) {
        for (var b = 0; b < this.length; b++)
          if (this[b] === a)
            return b;
        return -1;
      }, $d = function (a) {
        __called[130] = true;
        for (var a = a.sort(), b = [], c = i, d = 0; d < a.length; d++) {
          var e = a[d];
          e != c && b.push(e);
          c = e;
        }
        return b;
      }, Y = function () {
        __called[131] = true;
        var a;
        if ((a = Object.create) && Yd.test(a))
          a = a(l);
        else {
          a = {};
          for (var b in a)
            a[b] = i;
        }
        return a;
      }, ae = function (a, b) {
        for (var c = 0; c < b.length && a; c++)
          a = a[b[c]];
        return a;
      }, be = X(Ud, 'gapi', {});
    var ce = function (a, b, c) {
      __called[132] = true;
      var d = RegExp('([?#].*&|[?#])' + b + '=([^&#]*)', 'g');
      if (a = a && (RegExp('([#].*&|[#])' + b + '=([^&#]*)', 'g').exec(a) || d.exec(a)))
        try {
          c = decodeURIComponent(a[2]);
        } catch (e) {
        }
      return c;
    };
    var Z;
    Z = X(Ud, '___jsl', Y());
    X(Z, 'I', 0);
    X(Z, 'hel', 10);
    var de = function () {
        var a = Wd.href;
        return !Z.dpo ? ce(a, 'jsh', Z.h) : Z.h;
      }, ee = function (a) {
        return X(X(Z, 'H', Y()), a, Y());
      }, fe = function (a) {
        __called[133] = true;
        var b = X(Z, 'us', []);
        b.push(a);
        var c = /^https:(.*)$/.exec(a);
        c && b.push('http:' + c[1]);
        X(Z, 'u', a);
      };
    var ge = X(Z, 'perf', Y());
    X(ge, 'g', Y());
    X(ge, 'i', Y());
    X(ge, 'r', []);
    Y();
    Y();
    var he = Y(), ie = [], $;
    $ = {
      Aa: 'callback',
      ub: 'sync',
      rb: 'config',
      ea: '_c',
      sb: 'h',
      Rb: 'platform',
      fa: 'jsl',
      TIMEOUT: 'timeout',
      tb: 'ontimeout'
    };
    ie.push([
      $.fa,
      function (a) {
        for (var b in a)
          if (Object.prototype.hasOwnProperty.call(a, b)) {
            var c = a[b];
            'object' == typeof c ? Z[b] = X(Z, b, []).concat(c) : X(Z, b, c);
          }
        (a = a.u) && fe(a);
      }
    ]);
    var je = decodeURI('%73cript');
    he.m = function (a) {
      __called[134] = true;
      var b = Z.ms || 'https://apis.google.com', a = a[0];
      if (!a || 0 <= a.indexOf('..'))
        throw 'Bad hint';
      return b + '/' + a.replace(/^\//, '');
    };
    var ke = function (a) {
        return a.join(',').replace(/\./g, '_').replace(/-/g, '_');
      }, le = function (a, b) {
        for (var c = [], d = 0; d < a.length; ++d) {
          var e = a[d];
          e && 0 > Zd.call(b, e) && c.push(e);
        }
        return c;
      }, me = function () {
        var a = de();
        if (!a)
          throw 'Bad hint';
        return a;
      }, ne = function (a) {
        var b = a.split(';'), c = he[b.shift()], b = c && c(b);
        if (!b)
          throw 'Bad hint:' + a;
        return b;
      }, oe = /[@"'<>#\?&%]/, pe = /^https?:\/\/[^\/\?#]+\.google\.com(:\d+)?\/[^\?#]+$/, qe = /\/cb=/g, re = function (a) {
        var b = a.match(qe);
        return !(!b) && 1 === b.length && pe.test(a) && !oe.test(a);
      }, te = function (a) {
        'loading' != Vd.readyState ? se(a) : Vd.write('<' + je + ' src="' + encodeURI(a) + '"></' + je + '>');
      }, se = function (a) {
        __called[135] = true;
        var b = Vd.createElement(je);
        b.setAttribute('src', a);
        b.async = 'true';
        a = Vd.getElementsByTagName(je)[0];
        a.parentNode.insertBefore(b, a);
      }, ue = function (a, b) {
        __called[136] = true;
        var c = b && b[$.ea];
        if (c)
          for (var d = 0; d < ie.length; d++) {
            var e = ie[d][0], f = ie[d][1];
            f && Object.prototype.hasOwnProperty.call(c, e) && f(c[e], a, b);
          }
      }, we = function (a, b) {
        ve(function () {
          var c;
          c = b === de() ? X(be, '_', Y()) : Y();
          c = X(ee(b), '_', c);
          a(c);
        });
      }, xe = function () {
        return m;
      }, ye = function (a, b) {
        __called[139] = true;
        var c = b || {};
        'function' == typeof b && (c = {}, c[$.Aa] = b);
        if (!xe || !xe(c)) {
          ue(a, c);
          var d = c[$.sb] || me(), e = c[$.Aa], f = c[$.rb], g = c[$.TIMEOUT], h = c[$.tb], k = l, q = m;
          if (g && !h || !g && h)
            throw 'Timeout requires both the timeout parameter and ontimeout parameter to be set';
          var r = X(ee(d), 'r', []).sort(), t = X(ee(d), 'L', []).sort(), A = function (a) {
              __called[137] = true;
              if (q)
                return 0;
              Ud.clearTimeout(k);
              t.push.apply(t, B);
              var b = ((be || {}).config || {}).update;
              b ? b(f) : f && X(Z, 'cu', []).push(f);
              a && we(a, d);
              e && e();
              return 1;
            };
          0 < g && (k = Ud.setTimeout(function () {
            q = j;
            h();
          }, g));
          var g = a ? $d(a.split(':')) : [], B = le(g, t);
          if (!B.length)
            return A();
          var B = le(g, r), y = X(Z, 'CP', []), z = y.length;
          y[z] = function (a) {
            __called[138] = true;
            if (!a)
              return 0;
            var b = function () {
              y[z] = l;
              return A(a);
            };
            if (0 < z && y[z - 1])
              y[z] = b;
            else
              for (b(); (b = y[++z]) && b(););
          };
          if (!B.length)
            return y[z](Xd);
          var D = 'loaded_' + Z.I++;
          be[D] = function (a) {
            y[z](a);
            be[D] = l;
          };
          g = ne(d);
          g = g.replace('__features__', ke(B)).replace(/\/$/, '') + (r.length ? '/ed=1/exm=' + ke(r) : '') + ('/cb=gapi.' + D);
          if (!re(g))
            throw 'Bad URL ' + g;
          r.push.apply(r, B);
          c[$.ub] || Ud.___gapisync ? te(g) : se(g);
        }
      };
    var ve = function (a) {
      __called[140] = true;
      if (Z.hee && 0 < Z.hel)
        try {
          return a();
        } catch (b) {
          Z.hel--, ye('debug_error', function () {
            window.___jsl.hefn(b);
          });
        }
      else
        return a();
    };
    be.load = function (a, b) {
      return ve(function () {
        return ye(a, b);
      });
    };
    var ze = function (a, b) {
      __called[141] = true;
      var c = a.replace(/\:\d+$/, '').replace(/^https?\:\/\//, '');
      if (b) {
        if (!/^[0-9a-zA-Z.-]+$/.test(c))
          return m;
        for (var d = b.split(','), e = 0, f = d.length; e < f; ++e) {
          var g = d[e], h = c.lastIndexOf(g);
          if (0 <= h && (0 == h || '.' == g.charAt(0) || '.' == c.charAt(h - 1)) && c.length - g.length == h)
            return j;
        }
      }
      return m;
    };
    he.n = function (a) {
      if (2 == a.length) {
        var b = a[0].replace(/\/$/, '');
        if (ze(b, Z.m))
          return b + a[1];
      }
    };
    var Ae = /([^\/]*\/\/[^\/]*)(\/js\/.*)$/, xe = function (a) {
        __called[142] = true;
        var b = ae(a, [
            $.ea,
            $.fa,
            'u'
          ]), c = Ae.exec(b);
        if (Z.dpo || !b || !c)
          return m;
        var d = c[1], c = c[2], e = ce(b, 'nr'), f = ce(Ud.location.href, '_bsh'), a = ae(a, [
            $.ea,
            $.fa,
            'm'
          ]);
        if (f && (!a || !ze(f, a)))
          throw 'Bad hint';
        if (e == i && f && f != d)
          return d = f + c + (0 <= c.indexOf('?') ? '&' : '?') + 'nr=' + encodeURIComponent(b), a = Vd.getElementsByTagName(je), a = a[a.length - 1].src, (b && b.replace(/^.*:/, '')) == (a && a.replace(/^.*:/, '')) ? te(d) : se(d), j;
        /^http/.test(e) && fe(decodeURIComponent('' + e));
        return m;
      };
    var Be = function (a) {
      __called[143] = true;
      var b = window.gapi.load;
      p('dgl', b, F);
      try {
        var c = {
            isPlusUser: a.isPlusUser || a.pu
          }, d = a.socialhost || a.sh;
        d && (c.iframes = {
          ':socialhost:': d
        });
        b && b('', {
          config: c
        });
      } catch (e) {
        E(e, 'gl', 'init');
      }
    };
    gc.o && G('gl', {
      init: Be
    });
    vb(sb.Ib);
    (function () {
      __called[145] = true;
      vb(sb.xb);
      var a, b;
      for (a = 0; (b = F.bnc[a]) && !('m' == b[0]); ++a);
      b && !b[1].l && (a = function () {
        __called[144] = true;
        for (var a = F.mdc, d = F.mdi || {}, e = 0, f; f = tb[e]; ++e) {
          var g = f[0], h = a[g], k = d[g], q;
          if (q = h) {
            if (k = !k) {
              var r;
              a: {
                k = g;
                if (q = F.mdd)
                  try {
                    if (!ub) {
                      ub = {};
                      var t = q.split(/;/);
                      for (q = 0; q < t.length; ++q)
                        ub[t[q]] = j;
                    }
                    r = ub[k];
                    break a;
                  } catch (A) {
                    F.logger && F.logger.ml(A);
                  }
                r = m;
              }
              k = !r;
            }
            q = k;
          }
          if (q) {
            vb(sb.zb, g);
            try {
              f[1].init(h), d[g] = j;
            } catch (B) {
              F.logger && F.logger.ml(B);
            }
            vb(sb.yb, g);
          }
        }
        if (a = F.qd.m) {
          F.qd.m = [];
          for (d = 0; e = a[d]; ++d)
            try {
              e();
            } catch (y) {
              F.logger && F.logger.ml(y);
            }
        }
        b[1].l = j;
        vb(sb.wb);
        a: {
          for (a = 0; d = F.bnc[a]; ++a)
            if ((d[1].auto || 'm' == d[0]) && !d[1].l) {
              a = m;
              break a;
            }
          a = j;
        }
        a && vb(sb.vb);
      }, !b[1].libs || F.agl && F.agl(b[1].libs) ? a() : b[1].i = a);
    }());
  } catch (e) {
    window.gbar && gbar.logger && gbar.logger.ml(e, {
      '_sn': 'm.init',
      '_mddn': gbar.mddn ? gbar.mddn() : '0'
    });
  }
})();
