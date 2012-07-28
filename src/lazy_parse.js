(function (exports) {
  var util, T, escodegen, Types, uglify;
  if (typeof process !== "undefined") {
    util = require("./util.js");
    T = require("./estransform.js");
    escodegen = require("./escodegen.js");
    Types = require("./types.js");
    uglify = require("uglify-js");

    snarf = require('fs').readFileSync;
  } else {
    util = this.util;
    T = estransform;
    escodegen = this.escodegen;
    Types = this.Types;
    uglify = load("./uglify-js.js");
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

  /**
   * Import utilities.
   */
  const extend = util.extend;
  const assert = util.assert;

  var logger;
  var minReplaceLength;
  var callGraphAvailable;
  var callProfiling;

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
  };


  function stringifyNode(node) {
    var s = escodegen.generate(node, {format: {indent: { style: '', base: 0}}});
    if (node instanceof BlockStatement) {
      return uglify('(function()' + s + ')')
        .replace(/^.*?\{/, '').replace(/\}\)$/, '');
    } else {
      return uglify('(' + s + ')')
        .replace(/^\(/, '').replace(/\)$/, '');
    }
  }

  /**
   * Begin rewrite pass
   */

  function shouldLazify(functionNode, length) {
    return (length > minReplaceLength &&
            (!callGraphAvailable || !functionNode.called) &&
            (typeof callProfiling === "undefined" || !callProfiling[functionNode.idNumber]));
  }

  function Laziness() {
    this.functionStrings = Object.create(null);
    this.functionMap = Object.create(null);
    this.isClosure = false;
    this.needsStub = false;
    this.needsStubF = false;
  }

  function stubConstructor(strId, funcId) {
    var tempId = new Identifier("t");
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
                    new Identifier("x")
                  )
                ]
              ),
              funcId,
              new BlockStatement([
                new ExpressionStatement(
                  new AssignmentExpression(
                    new MemberExpression(
                      tempId,
                      new Identifier("x"),
                      true
                    ), "=",
                    new MemberExpression(
                      funcId,
                      new Identifier("x"),
                      true
                    )
                  )
                )
              ])
            ),
            new ReturnStatement(
              tempId
            )
          ])
        ),
        new ReturnStatement(
          funcId
        )
      ])
    );
  }


  function stubFConstructor(strId, funcId, paramsId) {
    var tempId = new Identifier("t");
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
                    new Identifier("x")
                  )
                ]
              ),
              funcId,
              new BlockStatement([
                new ExpressionStatement(
                  new AssignmentExpression(
                    new MemberExpression(
                      tempId,
                      new Identifier("x"),
                      true
                    ), "=",
                    new MemberExpression(
                      funcId,
                      new Identifier("x"),
                      true
                    )
                  )
                )
              ])
            ),
            new ReturnStatement(
              tempId
            )
          ])
        ),
        new ReturnStatement(
          funcId
        )
      ])
    );
  }
        

  function stub(id, strName, stubName, params) {
    var tempId = new Identifier("t");
    var strId = new Identifier(strName);

    var stubParams = [strId, id];

    if (stubName === "stubF") {
      var paramArray = [];
      for (var i = 0, l = params.length; i < l; i++) {
        paramArray.push(new Literal(params[i].name));
      }
      stubParams.push(new ArrayExpression(paramArray));
    }
    return new BlockStatement([
      // new IfStatement(
      //   new BinaryExpression(
      //     "===",
      //     new UnaryExpression(
      //       "typeof",
      //       strId
      //     ),
      //     new Literal("string")
      //   ),
      //   new BlockStatement([
      //     new VariableDeclaration(
      //       "var", [
      //         new VariableDeclarator(
      //           tempId,
      //           new CallExpression(
      //             new Identifier("eval"),
      //             [strId]
      //           )
      //         )
      //       ]
      //     ),
      //     new ExpressionStatement(
      //       new AssignmentExpression(
      //         new MemberExpression(
      //           tempId,
      //           new Identifier("prototype"),
      //           false,
      //           "."
      //         ),
      //         "=",
      //         new MemberExpression(
      //           id,
      //           new Identifier("prototype"),
      //           false,
      //           "."
      //         )
      //       )
      //     ),
      //     new ExpressionStatement(
      //       new AssignmentExpression(
      //         id, "=",
      //         tempId
      //       )
      //     ),
      //     new ExpressionStatement(
      //       new AssignmentExpression(
      //         strId, "=", new Identifier("null")
      //       )
      //     )
      //   ])
      // ),
      new ExpressionStatement(
        new AssignmentExpression(
          id, "=",
          new CallExpression(
            new Identifier(stubName),
            stubParams
          )
        )
      ),
      new ExpressionStatement(
        new AssignmentExpression(
          strId, "=", new Identifier("null")
        )
      ),
      new ReturnStatement(
        new CallExpression(
          new MemberExpression(
            id,
            new Identifier("call"),
            false,
            "."
          ),
          [new Identifier("this")].concat(params)
        )
      )
    ]);


    // return new CallExpression(
    //   new Identifier("eval"),
    //   [new Identifier(strName)]
    // );
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

    var strId, strDeclaration;
    for (var name in o.laziness.functionStrings) {
      strId = new Identifier(name, "variable");
      strDeclaration = new VariableDeclaration(
        "var",
        [new VariableDeclarator(strId, new Literal(o.laziness.functionStrings[name]), undefined)]
      );
      this.body.unshift(strDeclaration);
    }

    if (o.laziness.needsStub) {
      this.body.unshift(stubConstructor(o.scope.freshTemp(), o.scope.freshTemp()));
    }
    if (o.laziness.needsStubF) {
      this.body.unshift(stubFConstructor(o.scope.freshTemp(), o.scope.freshTemp(), o.scope.freshTemp()));
    }


    return this;
  };

  function prepend(newStatement, body) {
  }

  var curId = 0;
  FunctionExpression.prototype.lazyParsePass = 
  FunctionDeclaration.prototype.lazyParsePass = function (o) {
    var childOpts = extend(o);
    childOpts.scope = this.frame;
    childOpts.laziness = new Laziness();
    this.body = this.body.lazyParsePass(childOpts);
    this.idNumber = curId++; // NOTE: this is AFTER parsing children
                             // (as is the post-order traversal in
                             // callGraph)

    var strId, strDeclaration;
    for (var name in childOpts.laziness.functionStrings) {
      strId = new Identifier(name, "variable");
      strDeclaration = new VariableDeclaration(
        "var",
        [new VariableDeclarator(strId, new Literal(childOpts.laziness.functionStrings[name]), undefined)]
      );
      prepend(strDeclaration, this.body);
      if (this.body instanceof BlockStatement) {
        this.body.body.unshift(strDeclaration);
      } else {
        this.body = new BlockStatement([strDeclaration, this.body]);
      }
    }

    if (childOpts.laziness.needsStub) {
      prepend(stubConstructor(o.scope.freshTemp(), o.scope.freshTemp()), this.body);
    }
    if (childOpts.laziness.needsStubF) {
      prepend(stubFConstructor(o.scope.freshTemp(), o.scope.freshTemp(), o.scope.freshTemp()), this.body);
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

        var id = o.scope.freshTemp();
        if (childOpts.laziness.isClosure) {
          o.laziness.functionStrings[id.name] = '(' + functionString + ')';
          this.body = stub(this.id, id.name, "stub", this.params);
          o.laziness.needsStub = true;
        } else {
          functionString = stringifyNode(this.body);
          o.laziness.functionStrings[id.name] = functionString;
          this.body = stub(this.id, id.name, "stubF", this.params);
          o.laziness.needsStubF = true;
        }

        o.laziness.functionMap[this.id.name] = {mangled: id.name, isClosure: childOpts.laziness.isClosure, params: this.params};
      }
      return this;
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
    if (typeof o.laziness.isClosure !== "undefined" &&
        !o.laziness.isClosure &&
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
        var id = o.scope.freshTemp();

        if (this.left instanceof Identifier && this.params) {
          for (var i = 0, l = this.params.length; i < l; i++) {
            var param = this.params[i];
            if (param instanceof Identifier && this.left.name === param.name) {
              return this;
            }
          }
        }
        //print('compressing function ' + id.name);

        if (this.right.isClosure) {
          o.laziness.functionStrings[id.name] = '(' + functionString + ')';
          this.right.body = stub(this.left, id.name, "stub", this.right.params);
          o.laziness.needsStub = true;
        } else {
          o.laziness.functionStrings[id.name] = stringifyNode(this.right.body);
          this.right.body = stub(this.left, id.name, "stubF", this.right.params);
          o.laziness.needsStubF = true;
        }

        var funcName;
        if (this.left instanceof Identifier) {
          funcName = this.left.name;
        } else {
          funcName = id.name;
        }
        o.laziness.functionMap[funcName] = {mangled: id.name, isClosure: this.right.isClosure, params: this.right.params};
      } else {
        this.right.id = oldId;
      }
    }
    // else if (this.right instanceof Identifier) {
    //   this.right = resolve(this.right, o);
    // }

    return this;
  }

  CallExpression.prototype.lazyParseNode = function (o) {
    for (var i = 0, l = this.arguments.length; i < l; i++) {
      this.arguments[i] = resolve(this.arguments[i], o);
    }
  }

  function resolve(identifier, o) {
    if (identifier.variable && identifier.variable.type instanceof Types.ArrowType
       && o.laziness.functionMap[identifier.name]) {
      var functionEntry = o.laziness.functionMap[identifier.name];
      var strId = new Identifier(o.laziness.functionMap[identifier.name].mangled);

      var stubCall;
      if (functionEntry.isClosure) {
        stubCall = new CallExpression(
          new Identifier("stub"),
          [strId, identifier]
        );
      } else {
        var paramArray = [];
        for (var i = 0, l = functionEntry.params.length; i < l; i++) {
          paramArray.push(new Literal(functionEntry.params[i].name));
        }
        stubCall = new CallExpression(
          new Identifier("stubF"),
          [strId, identifier, new ArrayExpression(paramArray)]
        );
      }

      return new SequenceExpression([
        new AssignmentExpression(
          identifier, "=",
          stubCall
        ),
        new AssignmentExpression(
          strId, "=",
          new Identifier("null")
        ),
        identifier
      ]);
    } else {
      return identifier;
    }
  }

}).call(this, typeof exports === "undefined" ? (lazyParse = {}) : exports);
