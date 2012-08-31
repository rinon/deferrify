(function () {
  __called[150] = true;
  'use strict';
  var h = null, j = this;
  var m = 'undefined' != typeof navigator && /Macintosh/.test(navigator.userAgent);
  var o = /\s*;\s*/, q = function (g) {
      __called[149] = true;
      var c = p;
      if (!c.h.hasOwnProperty(g)) {
        var n;
        n = function (b) {
          __called[147] = true;
          var a;
          a: {
            a = g;
            'click' == a && (m && b.metaKey || !m && b.ctrlKey) && (a = 'clickmod');
            for (var s = b.srcElement || b.target, d = s; d && d != this; d = d.parentNode) {
              var D = d, t, e = D;
              t = a;
              var u = e.__jsaction;
              if (!u) {
                var u = e.__jsaction = {}, k = h;
                e.getAttribute && (k = e.getAttribute('jsaction'));
                if (e = k)
                  for (var e = e.split(o), k = 0, n = e ? e.length : 0; k < n; k++) {
                    var i = e[k];
                    if (i) {
                      var f = i.indexOf(':'), l = -1 != f, v = l ? i.substr(0, f).replace(/^\s+/, '').replace(/\s+$/, '') : 'click', i = l ? i.substr(f + 1).replace(/^\s+/, '').replace(/\s+$/, '') : i;
                      u[v] = i;
                    }
                  }
              }
              if (t = u[t]) {
                a = {
                  eventType: a,
                  event: b,
                  targetElement: s,
                  action: t,
                  actionElement: D
                };
                break a;
              }
            }
            a = h;
          }
          a && ((b.stopPropagation ? b.stopPropagation() : b.cancelBubble = !0, 'A' == a.actionElement.tagName && 'click' == g && (b.preventDefault ? b.preventDefault() : b.returnValue = !1), c.d) ? c.d(a) : (s = a, b = (d = j.document) && !d.createEvent && d.createEventObject ? d.createEventObject(b) : b, s.event = b, c.c.push(a)));
        };
        var f;
        f = function (b) {
          __called[148] = true;
          var a = g, c = n, d = !1;
          if (b.addEventListener) {
            if ('focus' == a || 'blur' == a)
              d = !0;
            b.addEventListener(a, c, d);
          } else if (b.attachEvent) {
            'focus' == a ? a = 'focusin' : 'blur' == a && (a = 'focusout');
            var f = c, c = function (a) {
                a || (a = window.event);
                return f.call(b, a);
              };
            b.attachEvent('on' + a, c);
          }
          return {
            i: a,
            k: c,
            capture: d
          };
        };
        c.h[g] = n;
        c.g.push(f);
        for (var l = 0; l < c.a.length; ++l) {
          var v = c.a[l];
          v.c.push(f.call(h, v.a));
        }
      }
    }, w = function () {
      this.a = r;
      this.c = [];
    };
  var p = new function () {
      this.g = [];
      this.a = [];
      this.h = {};
      this.d = h;
      this.c = [];
    }(), x = p, r = window.document.documentElement, y;
  a: {
    for (var z = 0; z < x.a.length; z++) {
      for (var A = x.a[z].a, B = r; A != B && B.parentNode;)
        B = B.parentNode;
      if (A == B) {
        y = !0;
        break a;
      }
    }
    y = !1;
  }
  if (!y) {
    for (var C = new w(), E = 0; E < x.g.length; ++E)
      C.c.push(x.g[E].call(h, C.a));
    x.a.push(C);
  }
  q('click');
  q('clickmod');
  q('focus');
  q('focusin');
  q('blur');
  q('focusout');
  var F = function (g) {
      var c = p;
      c.d = g;
      c.c && (0 < c.c.length && g(c.c), c.c = h);
    }, G = [
      'google',
      'jsad'
    ], H = j;
  !(G[0] in H) && H.execScript && H.execScript('var ' + G[0]);
  for (var I; G.length && (I = G.shift());)
    !G.length && void 0 !== F ? H[I] = F : H = H[I] ? H[I] : H[I] = {};
}.call(window));
