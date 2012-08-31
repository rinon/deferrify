(function () {
  __called[20] = true;
  var _j = 1250;
  var _t = false;
  var _tl = 847;
  var _th = 980;
  try {
    var _c = document.getElementById('cnt');
    var _s = document.getElementById('searchform');
    var _w = document['body'] && document.body['offsetWidth'];
    var _n = '';
    if (gbar.elr) {
      var _m = gbar.elr().mo;
      _n = _m == 'md' ? ' mdm' : _m == 'lg' ? ' big' : '';
      if (_t) {
        _n = _m == 'ut' ? ' tmlo' : _m == 'ty' ? ' tmhi' : _n;
      }
    } else {
      if (_w && _w >= _j) {
        _n = ' big';
      }
    }
    _c && (_c.className += _n);
    _s && (_s.className += _n);
  } catch (e) {
  }
}());
