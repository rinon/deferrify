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
    this.newVars = [];
    this.isClosure = false;
    this.needsStub = false;
    this.needsStubF = false;
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
          ])
        ),
        new ReturnStatement(
          funcId
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
          ])
        ),
        new ReturnStatement(
          funcId
        )
      ])
    );
  }
        

  function stub(id, strId, memoId, stubName, thisId, params) {
    var stubParams = [strId, memoId];

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

    return new BlockStatement([
      new ExpressionStatement(
        new AssignmentExpression(
          memoId, "=",
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
        new CallExpression(
          new MemberExpression(
            memoId,
            new Identifier("apply"),
            false,
            "."
          ),
          [thisId, new Identifier("arguments")]
        )
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
      this.body.unshift(stubConstructor(o.scope));
    }
    if (o.laziness.needsStubF) {
      this.body.unshift(stubFConstructor(o.scope));
    }


    if (o.laziness.newVars.length > 0) {
      var decl = new VariableDeclaration("var", o.laziness.newVars);
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

    var strId, strDeclaration;
    for (var name in childOpts.laziness.functionStrings) {
      strId = new Identifier(name, "variable");
      strDeclaration = new VariableDeclaration(
        "var",
        [new VariableDeclarator(strId, new Literal(childOpts.laziness.functionStrings[name]), undefined)]
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
      // Just propagate up and let program add it only once
      o.laziness.needsStubF = true;
    }

    if (childOpts.laziness.isClosure) {
      o.laziness.isClosure = true;
    }

    if (childOpts.laziness.newVars.length > 0) {
      var decl = new VariableDeclaration("var", childOpts.laziness.newVars);
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

        var id = o.scope.freshTemp();
        var memo = o.scope.freshTemp();
        if (childOpts.laziness.isClosure) {
          o.laziness.functionStrings[id.name] = '(' + functionString + ')';
          this.body = stub(this.id, id, memo, "stub");
          o.laziness.needsStub = true;
        } else {
          functionString = stringifyNode(this.body);
          o.laziness.functionStrings[id.name] = functionString;
          this.body = stub(this.id, id, memo, "stubF", null, this.params);
          o.laziness.needsStubF = true;
        }

        o.laziness.functionMap[this.id.name] = {mangled: id.name, isClosure: childOpts.laziness.isClosure, params: this.params};

        o.laziness.newVars.push(new VariableDeclarator(memo));

        return new BlockStatement([
          this,
          new ExpressionStatement(
            new AssignmentExpression(
              memo, "=", this.id
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
        var thisId = new Identifier("this");
        if (this.left instanceof MemberExpression &&
            (!thisId instanceof MemberExpression && thisId.property instanceof Identifier && thisId.property.name == "prototype")) {
          // We just use this if assigning to a prototype
          thisId = this.left.object;
        }

        numReplacements++;

        var id = o.scope.freshTemp();
        var memo = o.scope.freshTemp();
        if (this.right.isClosure) {
          o.laziness.functionStrings[id.name] = '(' + functionString + ')';
          this.right.body = stub(this.left, id, memo, "stub", thisId);
          o.laziness.needsStub = true;
        } else {
          o.laziness.functionStrings[id.name] = stringifyNode(this.right.body);
          this.right.body = stub(this.left, id, memo, "stubF", thisId, this.right.params);
          o.laziness.needsStubF = true;
        }

        var funcName;
        if (this.left instanceof Identifier) {
          funcName = this.left.name;
        } else {
          funcName = id.name;
        }
        o.laziness.functionMap[funcName] = {mangled: id.name, isClosure: this.right.isClosure, params: this.right.params};

        o.laziness.newVars.push(new VariableDeclarator(memo));

        return new SequenceExpression([
          this,
          new AssignmentExpression(
            memo, "=", this.left
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
