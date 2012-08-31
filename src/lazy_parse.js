(function (exports) {
  var util, T, escodegen, Types, esprima;
  if (typeof process !== "undefined") {
    util = require("./util.js");
    T = require("./estransform.js");
    escodegen = require("./escodegen.js");
    Types = require("./types.js");
    esprima = require("../lib/esprima.js");

    snarf = require('fs').readFileSync;
  } else {
    util = this.util;
    T = this.estransform;
    escodegen = this.escodegen;
    Types = this.Types;
    esprima = this.esprima;
  }

  /**
   * Import AST nodes
   */
  const Node = T.Node;
  const Program = T.Program;
  const Literal = T.Literal;
  const Identifier = T.Identifier;
  const FunctionDeclaration = T.FunctionDeclaration;
  const FunctionExpression = T.FunctionExpression;
  const AssignmentExpression = T.AssignmentExpression;
  const ExpressionStatement = T.ExpressionStatement;
  const CallExpression = T.CallExpression;
  const VariableDeclaration = T.VariableDeclaration;
  const VariableDeclarator = T.VariableDeclarator;
  const BlockStatement = T.BlockStatement;
  const ReturnStatement = T.ReturnStatement;
  const MemberExpression = T.MemberExpression;
  const IfStatement = T.IfStatement;
  const BinaryExpression = T.BinaryExpression;
  const UnaryExpression = T.UnaryExpression;
  const SequenceExpression = T.SequenceExpression;
  const ArrayExpression = T.ArrayExpression;
  const ForInStatement = T.ForInStatement;
  const ThisExpression = T.ThisExpression;
  const NewExpression = T.NewExpression;
  const Statement = T.Statement;

  /**
   * Import utilities.
   */
  const extend = util.extend;
  const assert = util.assert;

  var logger;
  var minReplaceLength;
  var callGraphAvailable;
  var callProfiling;
  var numReplacements = 0;
  var splitStrings = false;
  var splitStringsFilename;
  var useRequire = true;
  var useStubF;
  var numTopLevelFunctions = 0;
  var curTopLevelFunction;

  exports.initialize = function (o, cmdLineOpts) {
    logger = o.logger;
    if (cmdLineOpts["lazy-minimum"] === true) {
      minReplaceLength = 0;
    } else {
      minReplaceLength = cmdLineOpts["lazy-minimum"];
    }

    callGraphAvailable = cmdLineOpts["call-graph"];

    if (cmdLineOpts["read-profile"] !== "") {
      var profileStr = snarf(cmdLineOpts["read-profile"]);
      callProfiling = new Uint8Array(JSON.parse(profileStr));
    }

    if (cmdLineOpts["split-strings"] !== "") {
      splitStrings = [];
      splitStringsFilename = cmdLineOpts["split-strings"];
    }

    if (cmdLineOpts["load-instead"]) {
      useRequire = false;
    }

    useStubF = cmdLineOpts["new-function"];
  };

  var functionStrings;
  function newVarId(id) {
    //return new Identifier("_l$" + curVarId++);
    return new MemberExpression(
      new Identifier("_l$"),
      new Literal(id),
      true
    );
  }

  function stringifyNode(node) {
    var s = escodegen.generate(node, {format: {indent: { style: '', base: 0}, compact: true}});
    return s;
  }

  /**
   * Begin rewrite pass
   */

  function shouldLazify(functionNode, length) {
    return (length >= minReplaceLength &&
            (!callGraphAvailable || !functionNode.called) &&
            (typeof callProfiling === "undefined" || !callProfiling[functionNode.idNumber]));
  }

  function Laziness() {
    // this.functionStrings = Object.create(null);
    this.functionStrings = [];
    this.functionMap = Object.create(null);
    // this.newVars = [];
    this.isClosure = false;
    this.needsStub = false;
    this.needsStubF = false;
    this.curVarId = 0;
  }

  function stubConstructor(scope) {
    var strId = scope.freshTemp();
    var funcId = scope.freshTemp();
    var tempId = scope.freshTemp();
    var iterId = scope.freshTemp();
    return new FunctionDeclaration(
      new Identifier("stub"),
      [strId, funcId],
      new BlockStatement([
        new IfStatement(
          new BinaryExpression(
            "===",
            new UnaryExpression(
              "typeof",
              strId
            ),
            new Literal("string")
          ),
          new BlockStatement([
            new VariableDeclaration(
              "var", [
                new VariableDeclarator(
                  tempId,
                  new CallExpression(
                    new Identifier("eval"),
                    [strId]
                  )
                )
              ]
            ),
            new ExpressionStatement(
              new AssignmentExpression(
                new MemberExpression(
                  tempId,
                  new Identifier("prototype"),
                  false,
                  "."
                ),
                "=",
                new MemberExpression(
                  funcId,
                  new Identifier("prototype"),
                  false,
                  "."
                )
              )
            ),
            new ForInStatement(
              new VariableDeclaration(
                "var", [
                  new VariableDeclarator(
                    iterId
                  )
                ]
              ),
              funcId,
              new BlockStatement([
                new ExpressionStatement(
                  new AssignmentExpression(
                    new MemberExpression(
                      tempId,
                      iterId,
                      true
                    ), "=",
                    new MemberExpression(
                      funcId,
                      iterId,
                      true
                    )
                  )
                )
              ])
            ),
            new ReturnStatement(
              tempId
            )
          ]),
          new ReturnStatement(
            strId
          )
        )
      ])
    );
  }


  function stubFConstructor(scope) {
    var strId = scope.freshTemp();
    var funcId = scope.freshTemp();
    var paramsId = scope.freshTemp();
    var tempId = scope.freshTemp();
    var iterId = scope.freshTemp();
    return new FunctionDeclaration(
      new Identifier("stubF"),
      [strId, funcId, paramsId],
      new BlockStatement([
        new IfStatement(
          new BinaryExpression(
            "===",
            new UnaryExpression(
              "typeof",
              strId
            ),
            new Literal("string")
          ),
          new BlockStatement([
            new ExpressionStatement(
              new CallExpression(
                new MemberExpression(
                  paramsId,
                  new Identifier("push"),
                  false, "."
                ),
                [strId]
              )
            ),
            new VariableDeclaration(
              "var", [
                new VariableDeclarator(
                  tempId,
                  new CallExpression(
                    new MemberExpression(
                      new Identifier("Function"),
                      new Identifier("apply"),
                      false, "."
                    ),
                    [
                      new Identifier("this"),
                      paramsId
                    ]
                  )
                )
              ]
            ),
            new ExpressionStatement(
              new AssignmentExpression(
                new MemberExpression(
                  tempId,
                  new Identifier("prototype"),
                  false,
                  "."
                ),
                "=",
                new MemberExpression(
                  funcId,
                  new Identifier("prototype"),
                  false,
                  "."
                )
              )
            ),
            new ForInStatement(
              new VariableDeclaration(
                "var", [
                  new VariableDeclarator(
                    iterId
                  )
                ]
              ),
              funcId,
              new BlockStatement([
                new ExpressionStatement(
                  new AssignmentExpression(
                    new MemberExpression(
                      tempId,
                      iterId,
                      true
                    ), "=",
                    new MemberExpression(
                      funcId,
                      iterId,
                      true
                    )
                  )
                )
              ])
            ),
            new ReturnStatement(
              tempId
            )
          ]),
          new ReturnStatement(
            strId
          )
        )
      ])
    );
  }
        

  function stub(id, strId, stubName, thisId, params) {
    var stubParams = [strId, new MemberExpression(
      new Identifier("arguments"),
      new Identifier("callee"),
      false, "."
    )];

    if (stubName === "stubF") {
      var paramArray = [];
      for (var i = 0, l = params.length; i < l; i++) {
        paramArray.push(new Literal(params[i].name));
      }
      stubParams.push(new ArrayExpression(paramArray));
    }

    if (!thisId) {
      thisId = new Identifier("this");
    }

    var statements = [
      new VariableDeclaration(
        "var",
        [new VariableDeclarator(
          new Identifier("_"),
          new AssignmentExpression(
            strId, "=",
            new CallExpression(
              new Identifier(stubName),
              stubParams
            )
          )
        )]
      ),
      new IfStatement(
        new BinaryExpression(
          "===",
          id,
          new MemberExpression(
            new Identifier("arguments"),
            new Identifier("callee"),
            false, "."
          )
        ),
        new ExpressionStatement(
          new AssignmentExpression(
            id, "=", new Identifier("_")
          )
        )
      ),
      new ReturnStatement(
        new CallExpression(
          new MemberExpression(
            new Identifier("_"),
            new Identifier("apply"),
            false,
            "."
          ),
          [thisId, new Identifier("arguments")]
        )
      )
    ];

    if (splitStrings !== false) {
      statements.unshift(new ExpressionStatement(
        new CallExpression(
          new Identifier("_l$sync"),
          []
        )
      ));
    }


    return new BlockStatement(statements);



//     fnString += "\
// " + memoId + " = stub(" + strId + ", " + memoId + ");\
// " + strId + " = null;\
// if (" + id + " === this)\
//   " + id + " = " + memoId + ";\
// return " + memoId + ".apply(" + memoId + ", arguments);\
// })";

//     return esprima.parse(fnString).body[0].expression.body;
  }

  function passOverList(list, passFunction, o) {
    return list.map(function (node) {
      return node[passFunction](o);
    }).filter(function (node) {
      return node !== null;
    });
  }

  Node.prototype.lazyParsePass = T.makePass("lazyParsePass", "lazyParseNode");

  Program.prototype.lazyParsePass = function (o) {
    o.scope = this.frame;
    o = extend(o);
    o.laziness = new Laziness();

    this.body = passOverList(this.body, 'lazyParsePass', o);

    if (splitStrings === false) {
      if (o.laziness.functionStrings.length > 0) {
        var decls = o.laziness.functionStrings.map(function(str) {
          return new Literal(str);
        });
        var strDeclaration = new VariableDeclaration(
          "var",
          [new VariableDeclarator(new Identifier("_l$"), new ArrayExpression(decls))]
        );
        this.body.unshift(strDeclaration);
      }
    } else {
      if (o.laziness.functionStrings.length > 0) {
        var node = esprima.parse("\
var _l$done = false;\
var _l$ = [];\
function _l$sync(async) {\
  if (! _l$done) {\
    var _l$Request = new XMLHttpRequest();\
    _l$Request.open('GET', '" + splitStringsFilename + "', async);\
    _l$Request.onreadystatechange = function () {\
      if (_l$Request.readyState === 4 && ! _l$done) {\
        _l$ = _l$Request.responseText.split('\\n');\
        _l$done = true;\
      }\
    };\
    _l$Request.send();\
  }\
}\
", {loc: false, jsInput: true});
        this.body.unshift(node);

        functionStrings = o.laziness.functionStrings;
      } else if (numTopLevelFunctions === 1) {
        curTopLevelFunction.splitStrings();
      }
    }

    if (o.laziness.needsStub) {
      this.body.unshift(stubConstructor(o.scope));
    }
    if (o.laziness.needsStubF) {
      this.body.unshift(stubFConstructor(o.scope));
    }

    // if (o.laziness.newVars.length > 0) {
    //   var decl = new VariableDeclaration("var", o.laziness.newVars);
    //   this.body.unshift(decl);
    // }

    return this;
  };

  var curId = 0;
  FunctionExpression.prototype.lazyParsePass = 
  FunctionDeclaration.prototype.lazyParsePass = function (o) {
    if (this.frame.parent.parent === null) {
      numTopLevelFunctions++;
      curTopLevelFunction = this;
    }

    var childOpts = extend(o);
    childOpts.scope = this.frame;
    childOpts.laziness = new Laziness();
    this.body = this.body.lazyParsePass(childOpts);
    this.idNumber = curId++; // NOTE: this is AFTER parsing children
                             // (as is the post-order traversal in
                             // callGraph)


    var stubNode;
    if (childOpts.laziness.needsStub) {
      stubNode = stubConstructor(o.scope);
      if (this.body instanceof BlockStatement) {
        this.body.body.unshift(stubNode);
      } else {
        this.body = new BlockStatement([stubNode, this.body]);
      }
    }
    if (childOpts.laziness.needsStubF) {
      // Just propagate up and let program add it only once
      o.laziness.needsStubF = true;
    }

    if (childOpts.laziness.isClosure) {
      o.laziness.isClosure = true;
    }

    // if (childOpts.laziness.newVars.length > 0) {
    //   var decl = new VariableDeclaration("var", childOpts.laziness.newVars);
    //   if (this.body instanceof BlockStatement) {
    //     this.body.body.unshift(decl);
    //   } else {
    //     this.body = new BlockStatement([decl, this.body]);
    //   }
    // }


    if (childOpts.laziness.functionStrings.length > 0) {
      var decls = childOpts.laziness.functionStrings.map(function(str) {
        return new Literal(str);
      });
      var strDeclaration = new VariableDeclaration(
        "var",
        [new VariableDeclarator(new Identifier("_l$"), new ArrayExpression(decls))]
      );
      if (this.body instanceof BlockStatement) {
        this.body.body.unshift(strDeclaration);
      } else {
        this.body = new BlockStatement([strDeclaration, this.body]);
      }
    }

    if (this instanceof FunctionDeclaration) {
      var functionString = stringifyNode(this);
      if (shouldLazify(this, functionString.length)) {
        if (this.id instanceof Identifier && this.params) {
          for (var i = 0, l = this.params.length; i < l; i++) {
            var param = this.params[i];
            if (param instanceof Identifier && this.id.name === param.name) {
              return this;
            }
          }
        }

        numReplacements++;

        var id = newVarId(o.laziness.curVarId++);
        if (useStubF && !childOpts.laziness.isClosure) {
          functionString = stringifyNode(this.body);
          // o.laziness.functionStrings[id.name] = functionString;
          o.laziness.functionStrings.push(functionString);
          this.body = stub(this.id, id, "stubF", null, this.params);
          o.laziness.needsStubF = true;
        } else {
          // o.laziness.functionStrings[id.name] = '(' + functionString + ')';
          o.laziness.functionStrings.push('(' + functionString + ')');
          this.body = stub(this.id, id, "stub");
          o.laziness.needsStub = true;
        }

        o.laziness.functionMap[this.id.name] = {mangled: id.name, isClosure: childOpts.laziness.isClosure, params: this.params};

        // o.laziness.newVars.push(new VariableDeclarator(
        //   memo,
        //   this.id
        // ));

        return this;
      } else {
        return this;
      }
    } else {
      this.isClosure = childOpts.laziness.isClosure;
      return this;
    }
  }

  Identifier.prototype.lazyParseNode = function (o) {
    if (this.name === "eval") {
      o.laziness.isClosure = true;
      return this;
    }
    if (!o.laziness.isClosure &&
        this.kind === "variable") {
      var scope = o.scope;
      var variable = scope.variables[this.name];
      var parentVar = scope.getVariable(this.name);

      if (!parentVar) {
        // Should be the identifier for a catch clause
        return this;
      }

      if (!variable && !parentVar.external) {
        o.laziness.isClosure = true;
      }
    }
    return this;
  }

  AssignmentExpression.prototype.lazyParseNode = function (o) {
    if (this.right instanceof FunctionExpression) {
      var oldId = this.right.id;
      this.right.id = null;
      var functionString = stringifyNode(this.right);
      if (shouldLazify(this.right, functionString.length)) {
        var thisId = new Identifier("this");
        if (this.left instanceof MemberExpression &&
            (!thisId instanceof MemberExpression && thisId.property instanceof Identifier && thisId.property.name == "prototype")) {
          // We just use this if assigning to a prototype
          thisId = this.left.object;
        }

        numReplacements++;

        var id = newVarId(o.laziness.curVarId++);
        if (useStubF && !this.right.isClosure) {
          // o.laziness.functionStrings[id.name] = stringifyNode(this.right.body);
          o.laziness.functionStrings.push(stringifyNode(this.right.body));
          this.right.body = stub(this.left, id, "stubF", thisId, this.right.params);
          o.laziness.needsStubF = true;
        } else {
          // o.laziness.functionStrings[id.name] = '(' + functionString + ')';
          o.laziness.functionStrings.push('(' + functionString + ')');
          this.right.body = stub(this.left, id, "stub", thisId);
          o.laziness.needsStub = true;
        }

        var funcName;
        if (this.left instanceof Identifier) {
          funcName = this.left.name;
        } else {
          funcName = id.name;
        }
        o.laziness.functionMap[funcName] = {mangled: id.name, isClosure: this.right.isClosure, params: this.right.params};

        // o.laziness.newVars.push(new VariableDeclarator(memo));

        return this;
        // return new SequenceExpression([
        //   this,
        //   new AssignmentExpression(
        //     memo, "=", this.left
        //   )
        // ]);
      } else {
        this.right.id = oldId;
      }
    }
    // else if (this.right instanceof Identifier) {
    //   this.right = resolve(this.right, o);
    // }

    return this;
  };

  // CallExpression.prototype.lazyParseNode = function (o) {
  //   for (var i = 0, l = this.arguments.length; i < l; i++) {
  //     this.arguments[i] = resolve(this.arguments[i], o);
  //   }
  // }

  // function resolve(identifier, o) {
  //   if (identifier.variable && identifier.variable.type instanceof Types.ArrowType
  //      && o.laziness.functionMap[identifier.name]) {
  //     var functionEntry = o.laziness.functionMap[identifier.name];
  //     var strId = new Identifier(o.laziness.functionMap[identifier.name].mangled);

  //     var stubCall;
  //     if (functionEntry.isClosure) {
  //       stubCall = new CallExpression(
  //         new Identifier("stub"),
  //         [strId, identifier]
  //       );
  //     } else {
  //       var paramArray = [];
  //       for (var i = 0, l = functionEntry.params.length; i < l; i++) {
  //         paramArray.push(new Literal(functionEntry.params[i].name));
  //       }
  //       stubCall = new CallExpression(
  //         new Identifier("stubF"),
  //         [strId, identifier, new ArrayExpression(paramArray)]
  //       );
  //     }

  //     return new SequenceExpression([
  //       new AssignmentExpression(
  //         identifier, "=",
  //         stubCall
  //       ),
  //       new AssignmentExpression(
  //         strId, "=",
  //         new Identifier("null")
  //       ),
  //       identifier
  //     ]);
  //   } else {
  //     return identifier;
  //   }
  // }

  FunctionExpression.prototype.splitStrings = 
  FunctionDeclaration.prototype.splitStrings = function (o) {
    if (this.body instanceof BlockStatement
        && this.body.body[0] instanceof VariableDeclaration) {
      var decl = this.body.body[0];
      if (decl.declarations[0]
          && decl.declarations[0].id.name === "_l$") {
        var functions = decl.declarations[0].init.elements.map(function(literal) {
          return literal.value;
        });

        this.body.body.shift();

        if (functions.length > 0) {
          var node = esprima.parse("\
var _l$done = false;\
var _l$ = [];\
function _l$sync(async) {\
  if (! _l$done) {\
    var _l$Request = new XMLHttpRequest();\
    _l$Request.open('GET', '" + splitStringsFilename + "', async);\
    _l$Request.onreadystatechange = function () {\
      if (_l$Request.readyState === 4 && ! _l$done) {\
        _l$ = _l$Request.responseText.split('\\n');\
        _l$done = true;\
      }\
    };\
    _l$Request.send();\
  }\
}\
_l$sync(true);", {loc: false, jsInput: true});
          this.body.body.unshift(node);

          functionStrings = functions;
        }
      }
    }
  };

  exports.report = function() {
    print("Number of lazy loads: " + numReplacements);
  };

  function getFunctionStrings() {
    // Do not regen strings if they already are generated.
    // We might have a single element (stubF) at this point
    // if (splitStrings !== false && splitStrings.length <= 1) {
      // var decls = functionStrings.map(function(str) {
      //   return new Literal(str);
      // });
      // var strDeclaration = new VariableDeclaration(
      //   "var",
      //   [new VariableDeclarator(new Identifier("_l$"), new ArrayExpression(decls))]
      // );
      //splitStrings.push(strDeclaration);

      // for (var name in functionStrings) {
      //   var strId = new Identifier(name, "variable");
      //   var strDeclaration = new VariableDeclaration(
      //     "var",
      //     [new VariableDeclarator(strId, new Literal(functionStrings[name]), undefined)]
      //   );
      //   splitStrings.push(strDeclaration);
      // }
    // }
    //return splitStrings;
    if (functionStrings) {
      return functionStrings.join("\n");
    } else {
      return '';
    }
  };
  exports.getFunctionStrings = getFunctionStrings;

}).call(this, typeof exports === "undefined" ? (lazyParse = {}) : exports);
