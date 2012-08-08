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
  const ThisExpression = T.ThisExpression;
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
    this.numVars = 0;
    this.isClosure = false;
    this.needsStub = false;
    this.needsStubF = false;
  }

  function stubConstructor(scope) {
    var thisId = scope.freshTemp();
    var strId = scope.freshTemp();
    var funcId = scope.freshTemp();
    var iterId = scope.freshTemp();
    var argsId = scope.freshTemp();

    var lazyMeta = new Identifier("_$l");

    return new FunctionDeclaration(
      new Identifier("stub"),
      [thisId, strId, funcId, argsId],
      new BlockStatement([
        new IfStatement(
          new BinaryExpression(
            "===",
            new UnaryExpression(
              "typeof",
              new MemberExpression(
                lazyMeta,
                strId,
                true
              )
            ),
            new Literal("string")
          ),
          new BlockStatement([
            new ExpressionStatement(
              new AssignmentExpression(
                new MemberExpression(
                  lazyMeta,
                  funcId,
                  true
                ), "=",
                new CallExpression(
                  new Identifier("eval"),
                  [new MemberExpression(
                    lazyMeta,
                    strId,
                    true
                  )]
                )
              )
            ),
            new ExpressionStatement(
              new AssignmentExpression(
                new MemberExpression(
                  new MemberExpression(
                    lazyMeta,
                    funcId,
                    true
                  ),
                  new Identifier("prototype"),
                  false,
                  "."
                ),
                "=",
                new MemberExpression(
                  thisId,
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
                      new MemberExpression(
                        lazyMeta,
                        funcId,
                        true
                      ),
                      iterId,
                      true
                    ), "=",
                    new MemberExpression(
                      new MemberExpression(
                        lazyMeta,
                        funcId,
                        true
                      ),
                      iterId,
                      true
                    )
                  )
                )
              ])
            ),
            new ExpressionStatement(
              new AssignmentExpression(
                new MemberExpression(
                  lazyMeta,
                  strId,
                  true
                ), "=", new Identifier("null")
              )
            ),
            new ReturnStatement(
              new CallExpression(
                new MemberExpression(
                  new MemberExpression(
                    lazyMeta,
                    funcId,
                    true
                  ),
                  new Identifier("apply"),
                  false, "."
                ),
                [thisId, argsId]
              )
            )
          ])
        ),
        new ReturnStatement(
          new CallExpression(
            new MemberExpression(
              new MemberExpression(
                lazyMeta,
                funcId,
                true
              ),
              new Identifier("apply"),
              false, "."
            ),
            [thisId, argsId]
          )
        )
      ])
    );
  }


  function stubFConstructor(scope) {
    var thisId = scope.freshTemp();
    var strId = scope.freshTemp();
    var funcId = scope.freshTemp();
    var argsId = scope.freshTemp();
    var paramsId = scope.freshTemp();

    var lazyMeta = new Identifier("_$l");
    var iterId = scope.freshTemp();

    return new FunctionDeclaration(
      new Identifier("stubF"),
      [thisId, strId, funcId, argsId, paramsId],
      new BlockStatement([
        new IfStatement(
          new BinaryExpression(
            "===",
            new UnaryExpression(
              "typeof",
              new MemberExpression(
                lazyMeta,
                strId,
                true
              )
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
                [new MemberExpression(
                  lazyMeta,
                  strId,
                  true
                )]
              )
            ),
            new ExpressionStatement(
              new AssignmentExpression(
                new MemberExpression(
                  lazyMeta,
                  funcId,
                  true
                ), "=",
                new CallExpression(
                  new MemberExpression(
                    new Identifier("Function"),
                    new Identifier("apply"),
                    false, "."
                  ),
                  [
                    thisId,
                    paramsId
                  ]
                )
              )
            ),
            new ExpressionStatement(
              new AssignmentExpression(
                new MemberExpression(
                  new MemberExpression(
                    lazyMeta,
                    funcId,
                    true
                  ),
                  new Identifier("prototype"),
                  false,
                  "."
                ),
                "=",
                new MemberExpression(
                  thisId,
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
                      new MemberExpression(
                        lazyMeta,
                        funcId,
                        true
                      ),
                      iterId,
                      true
                    ), "=",
                    new MemberExpression(
                      new MemberExpression(
                        lazyMeta,
                        funcId,
                        true
                      ),
                      iterId,
                      true
                    )
                  )
                )
              ])
            ),
            new ExpressionStatement(
              new AssignmentExpression(
                new MemberExpression(
                  lazyMeta,
                  strId,
                  true
                ), "=", new Identifier("null")
              )
            ),
            new ReturnStatement(
              new CallExpression(
                new MemberExpression(
                  new MemberExpression(
                    lazyMeta,
                    funcId,
                    true
                  ),
                  new Identifier("apply"),
                  false, "."
                ),
                [thisId, argsId]
              )
            )
          ])
        ),
        new ReturnStatement(
          new CallExpression(
            new MemberExpression(
              new MemberExpression(
                lazyMeta,
                funcId,
                true
              ),
              new Identifier("apply"),
              false, "."
            ),
            [thisId, argsId]
          )
        )
      ])
    );
  }
        

  function stub(id, str, memo, stubName, scope, params) {
    var memoId = new MemberExpression(
      new Identifier("_$l"),
      new Literal(memo),
      true
    );
    var strId = new MemberExpression(
      new Identifier("_$l"),
      new Literal(str),
      true
    );

    var tempId = scope.freshTemp();

    var stubParams = [new ThisExpression(), new Literal(str), new Literal(memo), new Identifier("arguments")];

    if (stubName === "stubF") {
      var paramArray = [];
      for (var i = 0, l = params.length; i < l; i++) {
        paramArray.push(new Literal(params[i].name));
      }
      stubParams.push(new ArrayExpression(paramArray));
    }

    return new BlockStatement([
      new VariableDeclaration(
        "var", [
        new VariableDeclarator(
          tempId,
          new CallExpression(
            new Identifier(stubName),
            stubParams
          )
        )
      ]),
      new IfStatement(
        new BinaryExpression(
          "===",
          id,
          new ThisExpression()
        ),
        new ExpressionStatement(
          new AssignmentExpression(
            id, "=", memoId
          )
        )
      ),
      new ReturnStatement(
        tempId
      )
    ]);
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

    var strDeclaration;
    for (var name in o.laziness.functionStrings) {
      strDeclaration = new ExpressionStatement(
        new AssignmentExpression(
          new MemberExpression(
            new Identifier("_$l"),
            new Literal(name),
            true
          ), "=",
          new Literal(o.laziness.functionStrings[name]))
      );
      this.body.unshift(strDeclaration);
    }

    if (o.laziness.needsStub) {
      this.body.unshift(stubConstructor(o.scope));
    }
    if (o.laziness.needsStubF) {
      this.body.unshift(stubFConstructor(o.scope));
    }


    if (o.laziness.numVars > 0) {
      var decl = new VariableDeclaration("var", [new VariableDeclarator(
        new Identifier('_$l'),
        new CallExpression(
          new MemberExpression(
            new Identifier("Object"),
            new Identifier("create"),
            false, "."
          ),
          [new Identifier("null")]
        )
      )]);
      this.body.unshift(decl);
    }

    return this;
  };

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

    var strDeclaration;
    for (var name in childOpts.laziness.functionStrings) {
      strDeclaration = new ExpressionStatement(
        new AssignmentExpression(
          new MemberExpression(
            new Identifier("_$l"),
            new Literal(name),
            true
          ), "=",
          new Literal(childOpts.laziness.functionStrings[name]))
      );
      if (this.body instanceof BlockStatement) {
        this.body.body.unshift(strDeclaration);
      } else {
        this.body = new BlockStatement([strDeclaration, this.body]);
      }
    }

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
      stubNode = stubFConstructor(o.scope);
      if (this.body instanceof BlockStatement) {
        this.body.body.unshift(stubNode);
      } else {
        this.body = new BlockStatement([stubNode, this.body]);
      }
    }

    if (childOpts.laziness.isClosure) {
      o.laziness.isClosure = true;
    }

    if (childOpts.laziness.numVars > 0) {
      var decl = new VariableDeclaration("var", [new VariableDeclarator(
        new Identifier('_$l'),
        new CallExpression(
          new MemberExpression(
            new Identifier("Object"),
            new Identifier("create"),
            false, "."
          ),
          [new Identifier("null")]
        )
      )]);
      if (this.body instanceof BlockStatement) {
        this.body.body.unshift(decl);
      } else {
        this.body = new BlockStatement([decl, this.body]);
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

        var id = o.laziness.numVars++;
        var memo = o.laziness.numVars++;
        if (childOpts.laziness.isClosure) {
          o.laziness.functionStrings[id] = '(' + functionString + ')';
          this.body = stub(this.id, id, memo, "stub", o.scope);
          o.laziness.needsStub = true;
        } else {
          functionString = stringifyNode(this.body);
          o.laziness.functionStrings[id] = functionString;
          this.body = stub(this.id, id, memo, "stubF", o.scope, this.params);
          o.laziness.needsStubF = true;
        }

        o.laziness.functionMap[this.id.name] = {mangled: id.name, isClosure: childOpts.laziness.isClosure, params: this.params};

        return new BlockStatement([
          this,
          new ExpressionStatement(
            new AssignmentExpression(
              new MemberExpression(
                new Identifier("_$l"),
                new Literal(memo),
                true
              ), "=", this.id
            )
          )
        ]);
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
        var id = o.laziness.numVars++;

        var thisId = new Identifier("this");
        if (this.left instanceof MemberExpression &&
            (!thisId instanceof MemberExpression && thisId.property instanceof Identifier && thisId.property.name == "prototype")) {
          // We just use this if assigning to a prototype
          thisId = this.left.object;
        }

        numReplacements++;

        var memo = o.laziness.numVars++;
        if (this.right.isClosure) {
          o.laziness.functionStrings[id] = '(' + functionString + ')';
          this.right.body = stub(this.left, id, memo, "stub", o.scope);
          o.laziness.needsStub = true;
        } else {
          o.laziness.functionStrings[id] = stringifyNode(this.right.body);
          this.right.body = stub(this.left, id, memo, "stubF", o.scope, this.right.params);
          o.laziness.needsStubF = true;
        }

        var funcName;
        if (this.left instanceof Identifier) {
          funcName = this.left.name;
        } else {
          funcName = id.name;
        }
        o.laziness.functionMap[funcName] = {mangled: id.name, isClosure: this.right.isClosure, params: this.right.params};

        return new SequenceExpression([
          this,
          new AssignmentExpression(
            new MemberExpression(
              new Identifier("_$l"),
              new Literal(memo),
              true
            ), "=", this.left
          )
        ]);
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

  exports.report = function() {
    print("Number of lazy loads: " + numReplacements);
  };

}).call(this, typeof exports === "undefined" ? (lazyParse = {}) : exports);
