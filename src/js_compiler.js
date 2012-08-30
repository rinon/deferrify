(function (exports) {
  var util, jsFrontend, lazyParse, T, S, Types, LLJS, callGraph, escodegen;
  if (typeof process !== "undefined") {
    util = require("./util.js");
    jsFrontend = require("./js_frontend.js");
    T = require("./estransform.js");
    S = require("./scope.js");
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
    S = this.S;
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



  /**
   * Import nodes.
   */
  const Node = T.Node;
  const Literal = T.Literal;
  const Identifier = T.Identifier;
  const VariableDeclaration = T.VariableDeclaration;
  const VariableDeclarator = T.VariableDeclarator;
  const MemberExpression = T.MemberExpression;
  const BinaryExpression = T.BinaryExpression;
  const SequenceExpression = T.SequenceExpression;
  const CallExpression = T.CallExpression;
  const AssignmentExpression = T.AssignmentExpression;
  const ExpressionStatement = T.ExpressionStatement;
  const ReturnStatement = T.ReturnStatement;
  const Program = T.Program;
  const FunctionDeclaration = T.FunctionDeclaration;
  const FunctionExpression = T.FunctionExpression;
  const ConditionalExpression = T.ConditionalExpression;
  const ObjectExpression = T.ObjectExpression;
  const UnaryExpression = T.UnaryExpression;
  const NewExpression = T.NewExpression;
  const UpdateExpression = T.UpdateExpression;
  const ForStatement = T.ForStatement;
  const BlockStatement = T.BlockStatement;
  const CatchClause = T.CatchClause;
  const ThisExpression = T.ThisExpression;
  const TypeAliasDirective = T.TypeAliasDirective;
  const CastExpression = T.CastExpression;

  /**
   * Import utilities.
   */
  const assert = util.assert;
  const quote = util.quote;
  const clone = util.clone;
  const extend = util.extend;
  const cast = util.cast;
  const isInteger = util.isInteger;
  const isPowerOfTwo = util.isPowerOfTwo;
  const log2 = util.log2;
  const div4 = util.div4;
  const isAlignedTo = util.isAlignedTo;
  const alignTo = util.alignTo;
  const dereference = util.dereference;
  const realign = util.realign;

  /**
   * Import scopes.
   */
  const Variable = S.Variable;
  const Scope = S.Scope;
  const Frame = S.Frame;
  const getCachedLocal = S.getCachedLocal;

  /**
   * Import types.
   */
  const TypeAlias = Types.TypeAlias;
  const PrimitiveType = Types.PrimitiveType;
  const StructType = Types.StructType;
  const PointerType = Types.PointerType;
  const ArrowType = Types.ArrowType;




  /**
   * Misc utility functions.
   */

  function check(condition, message, warn) {
    if (!condition) {
      if (warn) {
        logger.warn(message);
      } else {
        logger.error(message);

        var e = new Error(message);
        var loc = logger.context[logger.context.length - 1].loc;
        if (loc) {
          e.lineNumber = loc.start.line;
        }
        e.logged = true;
        throw e;
      }
    }
  }


  /**
   * Pass 1: resolve type synonyms and do some type sanity checking
   */

  T.Type.prototype.reflect = function (o) {
    var ty = this.construct().resolve(o.types);
    if (ty !== undefined) {
      ty.lint();
    }
    return ty;
  };

  T.TypeIdentifier.prototype.construct = function () {
    var ty = new TypeAlias(this.name);
    ty.node = this;
    return ty;
  };

  T.PointerType.prototype.construct = function () {
    var ty = new PointerType(this.base.construct());
    ty.node = this;

    if (this.arraySize) {
      ty.arraySize = this.arraySize;
    }
    return ty;
  };

  T.StructType.prototype.construct = function () {
    var ty = new StructType(this.id ? this.id.name : undefined);
    ty.node = this;
    ty.fields = this.fields.map(function (f) {
      return { name: f.id.name, type: f.decltype.construct() };
    });
    ty.isUnion = this.isUnion;
    return ty;
  };

  T.ArrowType.prototype.construct = function () {
    return new ArrowType(this.params.map(function (p) { return p.construct(); }),
                         this.return.construct());
  };

  function startResolving(ty) {
    if (ty._resolving) {
      console.error("infinite type");
    }
    ty._resolving = true;
  };

  function finishResolving(ty) {
    delete ty._resolving;
    ty._resolved = true;
  };

  PrimitiveType.prototype.resolve = function () {
    return this;
  };

  TypeAlias.prototype.resolve = function (types, inPointer) {
    startResolving(this);
    check(this.name in types, "unable to resolve type name " + quote(this.name));
    var ty = types[this.name];
    finishResolving(this);
    if (inPointer && ty instanceof TypeAlias) {
      ty = ty.resolve(types, inPointer);
    }
    return ty;
  };

  PointerType.prototype.resolve = function (types) {
    if (this._resolved) {
      return this;
    }

    startResolving(this);
    this.base = this.base.resolve(types, true);
    if (this.arraySize) {
      this.size = this.base.size*this.arraySize;
    }
    finishResolving(this);
    return this;
  };

  StructType.prototype.resolve = function (types) {
    if (this._resolved) {
      return this;
    }

    startResolving(this);
    var field, fields = this.fields;
    for (var i = 0, j = fields.length; i < j; i++) {
      field = fields[i];
      if (field.type) {
        field.type = field.type.resolve(types);
        if (field.type instanceof ArrowType) {
          field.type.paramTypes.unshift(new PointerType(this));
        }
      }
    }
    finishResolving(this);
    return this;
  };

  ArrowType.prototype.resolve = function (types) {
    if (this._resolved) {
      return this;
    }

    var paramTypes = this.paramTypes;
    for (var i = 0, j = paramTypes.length; i < j; i++) {
      if (paramTypes[i]) {
        paramTypes[i] = paramTypes[i].resolve(types);
      }
    }
    if (this.returnType) {
      this.returnType = this.returnType.resolve(types);
    }
    return this;
  };

  PointerType.prototype.lint = function () {
    check(this.base, "pointer without base type");
    check(this.base.size, "cannot take pointer of size 0 type " + quote(Types.tystr(this.base, 0)));
  };

  StructType.prototype.lint = function () {
    var maxAlignSize = 1;
    var maxAlignSizeType = Types.u8ty;
    var fields = this.fields;
    var field, type;
    var prev = { offset: 0, type: { size: 0 } };
    for (var i = 0, j = fields.length; i < j; i++) {
      if (fields[i].type instanceof ArrowType) {
        // Ignore member functions.
        continue;
      }

      field = fields[i];
      type = field.type;

      if (type instanceof StructType) {
        // Recursively lint inline structs
        type.lint();
      }

      check(type, "cannot have untyped field");
      check(type.size, "cannot have fields of size 0 type " + quote(Types.tystr(type, 0)));

      if (type.align.size > maxAlignSize) {
        maxAlignSize = type.align.size;
        maxAlignSizeType = type.align;
      }

      if (this.isUnion) {
        field.offset = 0;
      } else {
        field.offset = alignTo(prev.offset + prev.type.size, type.size);
        prev = field;
      }
    }
    this.size = alignTo(field.offset + type.size, maxAlignSize);
    this.align = maxAlignSizeType;
  };

  ArrowType.prototype.lint = function () {
    var paramTypes = this.paramTypes;
    for (var i = 0, j = paramTypes.length; i < j; i++) {
      if (paramTypes[i]) {
        paramTypes[i].lint();
      }
    }
    if (this.returnType) {
      this.returnType.lint();
    }
  };

  function resolveAndLintTypes(root, types) {
    var s, stmts = root.body;
    var alias, aliases = [];
    var ty;
    for (var i = 0, j = stmts.length; i < j; i++) {
      s = stmts[i];
      if (s instanceof TypeAliasDirective) {
        alias = s.alias.name;
        if ((s.original instanceof T.StructType) && s.original.id) {
          types[alias] = types[s.original.id.name] = s.original.construct();
          aliases.push(s.original.id.name);
        } else {
          types[alias] = s.original.construct();
        }
        aliases.push(alias);
      } else if ((s instanceof T.StructType) && s.id) {
        types[s.id.name] = s.construct();
        aliases.push(s.id.name);
      }
    }

    for (var i = 0, j = aliases.length; i < j; i++) {
      ty = types[aliases[i]];
      logger.push(ty.node);
      ty = ty.resolve(types);
      ty.lint();
      types[aliases[i]] = ty;
      logger.pop();
    }

    return types;
  }

  /**
   * Pass 2: build scope information and lint inline types
   */

  function isNull(node) {
    return node instanceof Literal && (node.value === null || node.value === 0);
  }

  Node.prototype.scan = T.makePass("scan", "scanNode");

  function scanList(list, o) {
    for (var i = 0, j = list.length; i < j; i++) {
      list[i].scan(o);
    }
  }

  T.Type.prototype.scan = function (o) {
    return this;
  };

  Program.prototype.scan = function (o) {
    o = extend(o);

    var types = o.types;
    var scope = new Frame(null, "Program");
    o.scope = this.frame = scope;

    scope.addVariable(new Variable("exports"), true);
    scope.addVariable(new Variable("require"), true);
    scope.addVariable(new Variable("load"), true);

    logger.push(this);
    scanList(this.body, o);
    logger.pop();

    return this;
  };

  TypeAliasDirective.prototype.scan = function (o) {
    if (this.original instanceof T.StructType) {
      var thisTy = new PointerType(o.types[this.original.id.name]);
      var scope = new Frame(o.scope, "Struct " + this.original.id.name);;
      var fields = this.original.fields;
      for (var i = 0; i < fields.length; i++) {
        if (fields[i] instanceof FunctionDeclaration) {
          o = extend(o, { thisTy: thisTy });
          o.scope = scope;
          fields[i].scan(o);
        }
      }
    }
    return this;
  };

  FunctionExpression.prototype.scan =
  FunctionDeclaration.prototype.scan = function (o) {
    logger.push(this);
    var scope = o.scope;

    var ty;
    if (this.decltype) {
      ty = this.decltype.reflect(o);
    }
    if (this.id) {
      logger.push(this.id);
      scope.addVariable(new Variable(this.id.name, ty));
      logger.pop();
    }

    if (!scope.getVariable('arguments', true)) {
      scope.addVariable(new Variable('arguments', undefined));
    }


    o = extend(o);
    scope = new Frame(scope, "Function " + (this.id ? this.id.name : "anonymous"));
    scope.returnType = ty.returnType;
    o.scope = this.frame = scope;

    if (o.thisTy) {
      scope.addVariable(new Variable("this", o.thisTy));
    }

    scope.addVariable(new Variable("arguments"), true);

    var params = this.params;
    var parameters = this.parameters = [];
    var variable;
    for (var i = 0, j = params.length; i < j; i++) {
      logger.push(params[i]);
      variable = new Variable(params[i].name, ty.paramTypes[i]);
      scope.addVariable(variable);
      parameters.push(variable);
      logger.pop();
    }

    assert(this.body instanceof BlockStatement);
    scanList(this.body.body, o);

    logger.pop();
    return this;
  };

  VariableDeclaration.prototype.scan = function (o) {
    logger.push(this);

    //check(this.kind === "let" || this.kind === "const" || this.kind === "extern",
    //"Only block scoped variable declarations are allowed, use the " + quote("let") + " keyword instead.");

    scanList(this.declarations, extend(o, { declkind: this.kind }));

    /* Only emit vars, we mangle names ourselves. */
    if (this.kind === "let") {
      this.kind = "var";
    }

    logger.pop();
    return this;
  };

  VariableDeclarator.prototype.scanNode = function (o) {
    var types = o.types;
    var scope = o.scope;

    var name = this.id.name;
    var ty = this.decltype ? this.decltype.reflect(o) : undefined;

    // check(!scope.getVariable(name, true),
    //       "Variable " + quote(name) + " is already declared in local scope.");
    if (!scope.getVariable(name, true))
      scope.addVariable(new Variable(name, ty), o.declkind === "extern");
  };

  ForStatement.prototype.scan = function (o) {
    o = extend(o);
    o.scope = this.scope = new Scope(o.scope, "ForStatement", "block");
    Node.prototype.scan.call(this, o);
    return this;
  };

  // Note: Does not handle conditional catch clauses
  // Then again, neither does esprima
  CatchClause.prototype.scan = function (o) {
    logger.push(this);

    this.body.scan(o);

    logger.push(this.param);
    this.body.scope.addVariable(new Variable(this.param.name, undefined));
    logger.pop();

    logger.pop();
    return this;
  };

  BlockStatement.prototype.scan = function (o) {
    o = extend(o);
    o.scope = this.scope = new Scope(o.scope, "BlockStatement", "block");
    scanList(this.body, o);
    return this;
  };






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

    //LLJS.initialize(o);
    jsFrontend.initialize(o, options);
    lazyParse.initialize(o, options);
    callGraph.initialize(o, options);

    // Lift into constructors.
    node = T.lift(node);

    // Pass 1.
    var types = resolveAndLintTypes(node, util.clone(Types.builtinTypes));
    o.types = types;

    // Pass 1.5 - lifting vars into frame level lets
    //node.jsRewrite(o);

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
