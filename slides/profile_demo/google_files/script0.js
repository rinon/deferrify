window.google = {
  kEI: 'ohBAUN6DFYbiigKrsoGIDw',
  getEI: function (a) {
    __called[214] = true;
    var b;
    while (a && !(a.getAttribute && (b = a.getAttribute('eid'))))
      a = a.parentNode;
    return b || google.kEI;
  },
  https: function () {
    return window.location.protocol == 'https:';
  },
  kEXPI: '17259,20782,23628,23670,32690,33900,35704,37102,38034,38449,38466,38650,39156,39332,39523,39976,40069,40114,40333,4000042,4000115,4000179,4000229,4000241,4000260,4000303,4000308,4000352,4000354,4000367,4000401,4000424,4000433,4000472,4000476,4000553,4000593,4000616',
  kCSI: {
    e: '17259,20782,23628,23670,32690,33900,35704,37102,38034,38449,38466,38650,39156,39332,39523,39976,40069,40114,40333,4000042,4000115,4000179,4000229,4000241,4000260,4000303,4000308,4000352,4000354,4000367,4000401,4000424,4000433,4000472,4000476,4000553,4000593,4000616',
    ei: 'ohBAUN6DFYbiigKrsoGIDw'
  },
  authuser: 0,
  ml: function () {
  },
  pageState: '#',
  kHL: 'en',
  time: function () {
    return new Date().getTime();
  },
  log: function (a, b, c, e) {
    __called[215] = true;
    var d = new Image(), h = google, i = h.lc, f = h.li, j = '';
    d.onerror = d.onload = d.onabort = function () {
      delete i[f];
    };
    i[f] = d;
    if (!c && b.search('&ei=') == -1)
      j = '&ei=' + google.getEI(e);
    var g = c || '/gen_204?atyp=i&ct=' + a + '&cad=' + b + j + '&zx=' + google.time();
    var k = /^http:/i;
    if (k.test(g) && google.https()) {
      google.ml(new Error('GLMM'), false, {
        src: g
      });
      delete i[f];
      return;
    }
    d.src = g;
    h.li = f + 1;
  },
  lc: [],
  li: 0,
  j: {
    en: 1,
    l: function () {
      google.fl = true;
    },
    e: function () {
      google.fl = true;
    },
    b: location.hash && location.hash != '#',
    bv: 21,
    cf: '',
    pm: 'p',
    pl: [],
    mc: 0,
    sc: 0.5,
    u: 'c9c918f0'
  },
  Toolbelt: {},
  y: {},
  x: function (a, b) {
    google.y[a.id] = [
      a,
      b
    ];
    return false;
  }
};
(function () {
  __called[216] = true;
  var a = google.j;
  window.onpopstate = function () {
    a.psc = 1;
  };
  for (var b = 0, c; c = [
      'ad',
      'bc',
      'is',
      'p',
      'pa',
      'ac',
      'pc',
      'pah',
      'ph',
      'sa',
      'sifp',
      'slp',
      'spf',
      'spn',
      'xx',
      'zc',
      'zz'
    ][b++];)
    (function (e) {
      a[e] = function () {
        a.pl.push([
          e,
          arguments
        ]);
      };
    }(c));
}());
if (!window.chrome)
  window.chrome = {};
window.chrome.sv = 2;
if (!window.chrome.searchBox)
  window.chrome.searchBox = {};
window.chrome.searchBox.onsubmit = function () {
  __called[218] = true;
  google.x({
    id: 'psyapi'
  }, function () {
    __called[217] = true;
    var a = encodeURIComponent(window.chrome.searchBox.value);
    google.nav.search({
      q: a,
      sourceid: 'chrome-psyapi2'
    });
  });
};
