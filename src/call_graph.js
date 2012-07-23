(function (exports) {

  if (typeof process !== "undefined") {
    var util = require("./util.js");
    var T = require("./estransform.js");
    var Types = require("./types.js");
  } else {
    var util = this.util;
    var T = estransform;
    var Types = this.Types;
  }

  /**
   * Import AST nodes
   */
  const Node = T.Node;
  const Program = T.Program;
  const FunctionDeclaration = T.FunctionDeclaration;
  const FunctionExpression = T.FunctionExpression;
  const CallExpression = T.CallExpression;
  const Identifier = T.Identifier;

  /**
   * Import utilities.
   */
  const extend = util.extend;
  const assert = util.assert;

  var logger;

  exports.initialize = function (o) {
    logger = o.logger;
  };

  function passOverList(list, passFunction, o) {
    return list.map(function (node) {
      return node[passFunction](o);
    }).filter(function (node) {
      return node !== null;
    });
  }


  function FunctionNode(name) {
    this.name = name;
    this.called = false;
    this.visited = false;
    this.children = Object.create(null);
  }

  var prefix = "";
  function traverseCallGraph(callGraph) {
    print(prefix + callGraph.name);
    print(prefix + "called? " + callGraph.called);
    prefix += "  ";
    for (var name in callGraph.children) {
      if (callGraph.children[name].called) {
        traverseCallGraph(callGraph.children[name]);
      }
    }
  }

  /**
   * Begin analysis pass
   */
  Node.prototype.callGraph = T.makePass("callGraph", "callGraphNode");

  Program.prototype.callGraph = function (o) {
    o.callGraph = new FunctionNode("Program");
    o.callGraph.called = true;
    o.called = [];

    this.body = passOverList(this.body, 'callGraph', o);

    var callQueue = o.called;
    var callGraph = o.callGraph;

    while (callQueue.length > 0) {
      var curCall = callQueue.shift();
      curCall.visited = true;
      for (var call in curCall.children) {
        if (!(call.visited)) {
          callQueue.push(call);
        }
      }
    }

    traverseCallGraph(o.callGraph);
    print();

    return this;
  };

  CallExpression.prototype.callGraphNode = function (o) {
    if (this.callee instanceof Identifier) {
      var name = this.callee.name;
      var functionNode;
      if (typeof o.callGraph.children[name] !== "undefined") {
        functionNode = new FunctionNode(name);
        o.callGraph.children[name] = functionNode;
      } else {
        functionNode = o.callGraph.children[name];
      }
      functionNode.called = true;
      o.called.push(functionNode);
    }
  };

  FunctionDeclaration.prototype.callGraph = function (o) {
    var childOpts = extend(o);
    var node = new FunctionNode("");
    childOpts.callGraph = node;
    this.body = this.body.lazyParsePass(o);
    if (typeof o.callGraph.children[this.id.name] === "undefined") {
      node.name = this.id.name;
      o.callGraph.children[this.id.name] = node;
    } else {
      // ERROR - existing function with the same name
    }
  };


}).call(this, typeof exports === "undefined" ? (callGraph = {}) : exports);

