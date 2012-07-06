(function (exports) {

  if (typeof process !== "undefined") {
    var util = require("./util.js");
    var T = require("./estransform.js");
    var escodegen = require("./escodegen.js");
    var Types = require("./types.js");
  } else {
    var util = this.util;
    var T = estransform;
    var escodegen = this.escodegen;
    var Types = this.Types;
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

  exports.initialize = function (o) {
    logger = o.logger;
  }


  /**
   * Begin rewrite pass
   */

  function stubConstructor() {
    var tempId = new Identifier("t");
    var strId = new Identifier("s");
    return new FunctionDeclaration(
      new Identifier("stub"),
      [new Identifier("s"), new Identifier("f")],
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
                  new Identifier("f"),
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
              new Identifier("f"),
              new BlockStatement([
                new ExpressionStatement(
                  new AssignmentExpression(
                    new MemberExpression(
                      tempId,
                      new Identifier("x"),
                      true
                    ), "=",
                    new MemberExpression(
                      new Identifier("f"),
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
          new Identifier("f")
        )
      ])
    );
  }


  function stubFConstructor() {
    var tempId = new Identifier("t");
    var strId = new Identifier("s");
    var funcId = new Identifier("f");
    var paramsId = new Identifier("p");
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
                  new Identifier("f"),
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
              new Identifier("f"),
              new BlockStatement([
                new ExpressionStatement(
                  new AssignmentExpression(
                    new MemberExpression(
                      tempId,
                      new Identifier("x"),
                      true
                    ), "=",
                    new MemberExpression(
                      new Identifier("f"),
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
          new Identifier("f")
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
    o.laziness = {
      functionStrings: Object.create(null),
      functionMap: Object.create(null),
      isClosure: false
    };

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
    var needsStub = false, needsStubF = false;
    for (var name in o.laziness.functionMap) {
      if (o.laziness.functionMap[name].isClosure) {
        needsStub = true;
      } else {
        needsStubF = true;
      }
      if (needsStub && needsStubF) {
        break;
      }
    }

    if (needsStub) {
      this.body.unshift(stubConstructor());
    }
    if (needsStubF) {
      print("Can optimize constructor");
      this.body.unshift(stubFConstructor());
    }


    return this;
  };

  function prepend(newStatement, body) {
    if (body instanceof BlockStatement) {
      body.body.unshift(newStatement);
    } else {
      body = new BlockStatement([newStatement, this.body]);
    }
  }

  FunctionExpression.prototype.lazyParsePass = 
  FunctionDeclaration.prototype.lazyParsePass = function (o) {
    var childOpts = extend(o);
    childOpts.scope = this.frame;
    childOpts.laziness = {
      functionStrings: Object.create(null),
      functionMap: Object.create(null),
      isClosure: false
    };
    this.body = this.body.lazyParsePass(childOpts);

    var strId, strDeclaration;
    for (var name in childOpts.laziness.functionStrings) {
      strId = new Identifier(name, "variable");
      strDeclaration = new VariableDeclaration(
        "var",
        [new VariableDeclarator(strId, new Literal(childOpts.laziness.functionStrings[name]), undefined)]
      );
      prepend(strDeclaration, this.body);
    }
    var needsStub = false, needsStubF = false;
    for (var name in childOpts.laziness.functionMap) {
      if (childOpts.laziness.functionMap[name].isClosure) {
        needsStub = true;
      } else {
        needsStubF = true;
      }
      if (needsStub && needsStubF) {
        break;
      }
    }

    if (needsStub) {
      prepend(stubConstructor(), this.body);
    }
    if (needsStubF) {
      print("Can optimize constructor");
      prepend(stubFConstructor(), this.body);
    }



    if (this instanceof FunctionDeclaration) {
      var functionString = escodegen.generate(this, {format: {indent: { style: '', base: 0}}});
      if (functionString.length > o.options["lazy-minimum"]) {
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
        } else {
          functionString = escodegen.generate(this.body, {format: {indent: { style: '', base: 0}}});
          o.laziness.functionStrings[id.name] = functionString;
          this.body = stub(this.id, id.name, "stubF", this.params);
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

      if (!variable) {
        o.laziness.isClosure = true;
      }
    }
    return this;
  }

  AssignmentExpression.prototype.lazyParseNode = function (o) {
    if (this.right instanceof FunctionExpression) {
      var functionString = escodegen.generate(this.right, {format: {indent: { style: '', base: 0}}});
      if (functionString.length > o.options["lazy-minimum"]) {
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
        } else {
          o.laziness.functionStrings[id.name] = escodegen.generate(this.right.body, {format: {indent: { style: '', base: 0}}});
          this.right.body = stub(this.left, id.name, "stubF", this.right.params);
        }

        var funcName;
        if (this.left instanceof Identifier) {
          funcName = this.left.name;
        } else {
          funcName = id.name;
        }
        o.laziness.functionMap[this.left.name] = {mangled: id.name, isClosure: this.right.isClosure, params: this.right.params}; // TODO - fix closures here
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
