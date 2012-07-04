(function (exports) {

  if (typeof process !== "undefined") {
    var util = require("./util.js");
    var T = require("./estransform.js");
    var escodegen = require("./escodegen.js");
  } else {
    var util = this.util;
    var T = estransform;
    var escodegen = this.escodegen;
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

  function stub(id, strName, params) {
    var tempId = new Identifier("t");
    return new BlockStatement([
      new VariableDeclaration(
        "var", [
          new VariableDeclarator(
            tempId,
            new CallExpression(
              new Identifier("eval"),
              [new Identifier(strName)]
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
            id,
            new Identifier("prototype"),
            false,
            "."
          )
        )
      ),
      new ExpressionStatement(
        new AssignmentExpression(
          id, "=",
          tempId
        )
      ),
      new ReturnStatement(
        new CallExpression(
          new MemberExpression(
            tempId,
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
    o.functionStrings = Object.create(null);

    this.body = passOverList(this.body, 'lazyParsePass', o);

    var strId, strDeclaration;
    for (var name in o.functionStrings) {
      strId = new Identifier(name, "variable");
      strDeclaration = new VariableDeclaration(
        "var",
        [new VariableDeclarator(strId, new Literal(o.functionStrings[name]), undefined)]
      );
      this.body.unshift(strDeclaration);
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
    var childO = extend(o);
    childO.scope = this.frame;
    childO.functionStrings = Object.create(null);
    this.body = this.body.lazyParsePass(childO);

    var strId, strDeclaration;
    for (var name in childO.functionStrings) {
      strId = new Identifier(name, "variable");
      strDeclaration = new VariableDeclaration(
        "var",
        [new VariableDeclarator(strId, new Literal(childO.functionStrings[name]), undefined)]
      );
      prepend(strDeclaration, this.body);
    }


    if (this instanceof FunctionDeclaration) {
      var id = o.scope.freshTemp();
      var functionString = escodegen.generate(this, {format: {indent: { style: '', base: 0}}});
      o.functionStrings[id.name] = '(' + functionString + ')';
      this.body = stub(this.id, id.name, this.params);
      return this;
    } else {
      return this;
    }
  }

  AssignmentExpression.prototype.lazyParseNode = function (o) {
    if (this.right instanceof FunctionExpression) {
      var id = o.scope.freshTemp();
      var functionString = escodegen.generate(this.right, {format: {indent: { style: '', base: 0}}});
      o.functionStrings[id.name] = '(' + functionString + ')';

      this.right.body = stub(this.left, id.name, this.right.params);
    }

    return this;
  }

}).call(this, typeof exports === "undefined" ? (lazyParse = {}) : exports);
