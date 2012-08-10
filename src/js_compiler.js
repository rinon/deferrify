(function (exports) {
  var util, jsFrontend, lazyParse, T, Types, LLJS, callGraph, escodegen;
  if (typeof process !== "undefined") {
    util = require("./util.js");
    jsFrontend = require("./js_frontend.js");
    T = require("./estransform.js");
    Types = require("./types.js");
    LLJS = require("./compiler.js");
    callGraph = require("./call_graph.js");
    lazyParse = require("./lazy_parse.js");
    escodegen = require("./escodegen.js");
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
    load("./call_graph.js");
    callGraph = this.callGraph;
    load("./lazy_parse.js");
    lazyParse = this.lazyParse;
    escodegen = this.escodegen;
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

    var o = { name: name,
              logger: _logger,
              warn: warningOptions(options),
              jsInput: true,
              memcheck: options.memcheck,
              compiler: "js"
            };

    LLJS.initialize(o);
    jsFrontend.initialize(o);
    lazyParse.initialize(o, options);
    callGraph.initialize(o);

    // Lift into constructors.
    node = T.lift(node);

    // Pass 1.
    var types = LLJS.resolveAndLintTypes(node, util.clone(Types.builtinTypes));
    o.types = types;

    // Pass 1.5 - lifting vars into frame level lets
    node.jsRewrite(o);

    // Pass 2.
    node.scan(o);

    if (options["call-graph"]) {
      node.callGraph(o);
    }
    // o now contains global call graph

    // Pass 2.5 - include externs for all undeclared global vars
    node.externPass(o);

    if (options["profile-calls"]) {
      node.instrumentCalls(o);
    }

    if (options["lazy-minimum"] !== "") {
      node.lazyParsePass(o);

      if (options["split-strings"] !== "" && typeof process !== "undefined") {
        require('fs').writeFileSync(options["split-strings"], escodegen.generate(new T.Program(lazyParse.getFunctionStrings()), { base: "", indent: "  ", comment: true}));
      }
    }
    lazyParse.report();


    return T.flatten(node);
  }

  exports.compile = compile;

})(typeof exports === 'undefined' ? (JSCompiler = {}) : exports);
