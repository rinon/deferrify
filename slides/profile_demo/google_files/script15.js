(function () {
  __called[18] = true;
  var b, d, e, f;
  function g(a, c) {
    __called[16] = true;
    if (a.removeEventListener) {
      a.removeEventListener('load', c, false);
      a.removeEventListener('error', c, false);
    } else {
      a.detachEvent('onload', c);
      a.detachEvent('onerror', c);
    }
  }
  function h(a) {
    f = new Date().getTime();
    ++d;
    a = a || window.event;
    var c = a.target || a.srcElement;
    g(c, h);
  }
  var i = document.getElementsByTagName('img');
  b = i.length;
  d = 0;
  for (var j = 0, k; j < b; ++j) {
    k = i[j];
    if (k.complete || typeof k.src != 'string' || !k.src)
      ++d;
    else if (k.addEventListener) {
      k.addEventListener('load', h, false);
      k.addEventListener('error', h, false);
    } else {
      k.attachEvent('onload', h);
      k.attachEvent('onerror', h);
    }
  }
  e = b - d;
  function l() {
    __called[17] = true;
    if (!google.timers.load.t)
      return;
    google.timers.load.t.ol = new Date().getTime();
    google.timers.load.t.iml = f;
    google.kCSI.imc = d;
    google.kCSI.imn = b;
    google.kCSI.imp = e;
    if (google.stt !== undefined)
      google.kCSI.stt = google.stt;
    google.timers.load.t.xjs && google.report && google.report(google.timers.load, google.kCSI);
  }
  if (window.addEventListener)
    window.addEventListener('load', l, false);
  else if (window.attachEvent)
    window.attachEvent('onload', l);
  google.timers.load.t.prt = f = new Date().getTime();
}());
