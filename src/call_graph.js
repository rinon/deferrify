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

  function FunctionNode(name) {
    this.name = name;
    this.visited = false;
    this.calls = [];
  }

  var prefix = "";
  function traverseCallGraph(callGraph) {
    print(prefix + callGraph.name);
    print(prefix + " called? " + callGraph.called);
    prefix += "  ";
    for (var name in callGraph.children) {
      traverseCallGraph(callGraph.children[name]);
    }
    prefix = prefix.substr(2);
  }

  /**
   * Begin analysis pass
   */
  Node.prototype.callGraph = T.makePass("callGraph", "callGraphNode");

  Program.prototype.callGraph = function (o) {
    o = extend(o);
    o.scope = this.frame;
    var callGraph = new FunctionNode("Program");
    callGraph.called = true;
    o.scope.callGraph = callGraph;

    this.body = passOverList(this.body, 'callGraph', o);

    var callQueue = [];
    for (var i=0, l=callGraph.calls.length; i<l; i++) {
      callQueue.push({
        scope: o.scope,
        name: callGraph.calls[i]
      });
    }

    while (callQueue.length > 0) {
      var cur = callQueue.shift();
      var curVar = cur.scope.getVariable(cur.name);
      if (curVar.innerScope.callGraph.visited) {
        continue;
      }
      var curCall = curVar.innerScope.callGraph;
      curCall.visited = true;
      curVar.called = true;
      for (var i=0, l=curCall.calls.length; i<l; i++) {
        callQueue.push({
          scope: curVar.innerScope,
          name: curCall.calls[i]
        });
      }
    }


    //traverseCallGraph(o.callGraph);
    print(o.scope);
    print(this);
    print();

    return this;
  };

  CallExpression.prototype.callGraphNode = function (o) {
    if (this.callee instanceof Identifier) {
      var name = this.callee.name;

      var callee = o.scope.getVariable(name);
      // o.scope.calls.push(name);

      // var functionNode;
      // if (typeof o.callGraph.children[name] !== "undefined") {
      //   functionNode = new FunctionNode(name);
      //   o.callGraph.children[name] = functionNode;
      // } else {
      //   functionNode = o.callGraph.children[name];
      // }
      // functionNode.called = true;
      o.scope.callGraph.calls.push(name);
    }

    return this;
  };

  FunctionDeclaration.prototype.callGraph = function (o) {
    var node = new FunctionNode("");
    var childOpts = extend(o);
    childOpts.scope = this.frame;
    childOpts.scope.callGraph = node;
    this.body = this.body.callGraph(childOpts);

    node.name = this.id.name;
    var functionVariable = o.scope.getVariable(this.id.name);
    functionVariable.innerScope = this.frame;
    functionVariable.called = false;

    return this;
  };

  FunctionExpression.prototype.callGraph = function (o) {
    var node = new FunctionNode("anonymous");
    var childOpts = extend(o);
    childOpts.scope = this.frame;
    childOpts.scope.callGraph = node;
    this.body = this.body.callGraph(childOpts);

    return this;
  };

}).call(this, typeof exports === "undefined" ? (callGraph = {}) : exports);

