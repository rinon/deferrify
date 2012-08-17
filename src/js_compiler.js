(function (exports) {
  var util, jsFrontend, lazyParse, T, Types, LLJS;
  if (typeof process !== "undefined") {
    util = require("./util.js");
    jsFrontend = require("./js_frontend.js");
    T = require("./estransform.js");
    Types = require("./types.js");
    LLJS = require("./compiler.js");
  } else {
    util = this.util;
    T = this.estransform;
    load("./types.js");
    Types = this.Types;
    load("./scope.js");
    load("./js_frontend.js");
    jsFrontend = this.jsFrontend;
    load("./compiler.js");
    LLJS = this.compiler;
  }

  function warningOptions(options) {
    var warn = {};
    for (var p in options) {
      if (p.charAt(0) === "W") {
        warn[p.substr(1)] = true;
      }
    }
    return warn;
  }

  var logger;

  function compile(node, name, _logger, options) {
    // The logger is closed over by all the functions.
    logger = _logger;

    var o = { name: name, logger: _logger, warn: warningOptions(options), jsInput: true, memcheck: options.memcheck, compiler: "js", "lazy-minimum": options["lazy-minimum"] };

    LLJS.initialize(o);
    jsFrontend.initialize(o);

    // Lift into constructors.
    node = T.lift(node);

    // Pass 1.
    var types = LLJS.resolveAndLintTypes(node, util.clone(Types.builtinTypes));
    o.types = types;

    // Pass 1.5 - lifting vars into frame level lets
    node.jsRewrite(o);

    // Pass 2.
    node.scan(o);

    // Pass 2.5 - include externs for all undeclared global vars
    node.externPass(o);

    if (options["lazy-minimum"] !== "") {
      node.lazyParsePass(o);
    }

    return T.flatten(node);
  }

  exports.compile = compile;

})(typeof exports === 'undefined' ? (JSCompiler = {}) : exports);
