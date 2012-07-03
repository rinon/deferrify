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

  /**
   * Import utilities.
   */
  const extend = util.extend;

  var logger;

  exports.initialize = function (o) {
    logger = o.logger;
  }

  /**
   * Begin rewrite pass
   */

  function stub(strName) {
    return new CallExpression(
      new Identifier("eval"),
      [new Identifier(strName)]
    );
  }

  function mangle(name) {
    return "_" + name;
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
      strId = new Identifier(mangle(name), "variable");
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
      strId = new Identifier(mangle(name), "variable");
      strDeclaration = new VariableDeclaration(
        "var",
        [new VariableDeclarator(strId, new Literal(childO.functionStrings[name]), undefined)]
      );
      prepend(strDeclaration, this.body);
    }

    var id = o.scope.freshTemp();
    var functionString = escodegen.generate(this, {format: {indent: { style: '', base: 0}}});
    var stubExpr = stub(mangle(id.name));
    o.functionStrings[id.name] = '(' + functionString + ')';
    if (this instanceof FunctionExpression) {
      return stubExpr;
    } else {
      callId = new Identifier(this.id.name + ".call");
      this.body = new BlockStatement([
        new ExpressionStatement(new AssignmentExpression(this.id, "=", stubExpr)),
        new ReturnStatement(new CallExpression(callId, [new Identifier("this")].concat(this.params)))
      ]);
      return this;
    }
  }

}).call(this, typeof exports === "undefined" ? (lazyParse = {}) : exports);
