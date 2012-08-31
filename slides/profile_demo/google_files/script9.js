(function () {
  __called[219] = true;
  var c4 = 1088;
  var c5 = 1176;
  try {
    var w = document.body.offsetWidth, n = 3;
    if (w >= c4)
      n = w < c5 ? 4 : 5;
    document.getElementById('rhs_block').className += ' rhstc' + n;
  } catch (e) {
  }
}());
