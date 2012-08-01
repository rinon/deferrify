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
  const AssignmentExpression = T.AssignmentExpression;
  const MemberExpression = T.MemberExpression;
  const NewExpression = T.NewExpression;
  const ThisExpression = T.ThisExpression;
  const BinaryExpression = T.BinaryExpression;
  const LogicalExpression = T.LogicalExpression;
  const Literal = T.Literal;
  const ObjectExpression = T.ObjectExpression;
  const ArrayExpression = T.ArrayExpression;
  const SequenceExpression = T.SequenceExpression;
  const UnaryExpression = T.UnaryExpression;
  const UpdateExpression = T.UpdateExpression;
  const ConditionalExpression = T.ConditionalExpression;
  const BlockStatement = T.BlockStatement;
  const ExpressionStatement = T.ExpressionStatement;
  const VariableDeclaration = T.VariableDeclaration;
  const VariableDeclarator = T.VariableDeclarator;

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

  function DummyFunction() {
    this.realFunction = null;
    this.methods = Object.create(null);
    this.calls = [];
    this.called = false;
  }

  /**
   * Begin analysis pass
   */

  var resolved;

  Identifier.prototype.resolveSymbol = function(symbolTable, thisMethods) {
    if (resolved[this.name]) {
      return []; // circular
    }
    resolved[this.name] = true;
    var symbol = symbolTable[this.name];
    if (symbol === undefined) {
      symbolTable[this.name] = new DummyFunction();
      return [symbolTable[this.name]];
    } else {
      return symbol.resolveSymbol(symbolTable, thisMethods);
    }
  };

  DummyFunction.prototype.resolveSymbol =
  ThisExpression.prototype.resolveSymbol =
  FunctionDeclaration.prototype.resolveSymbol =
  FunctionExpression.prototype.resolveSymbol = function(symbolTable, thisMethods) {
    return [this];
  };

  MemberExpression.prototype.resolveSymbol = function(symbolTable, thisMethods) {
    if (this.object instanceof ThisExpression) {
      var symbol = thisMethods[name];
      if (symbol === undefined)
        return [];
      else
        return symbol.resolveSymbol(symbolTable, thisMethods);
    }

    var objects = this.object.resolveSymbol(symbolTable, thisMethods);
    if (objects === [])
      return [];

    var name = this.property.name;

    return objects.reduce(function (results, object) {
      if (object.methods === undefined)
        return results;
      var symbol = object.methods[name];
      if (symbol === undefined)
        return results;
      else
        return results.concat(symbol.resolveSymbol(symbolTable, thisMethods));
    }, []);
  };

  NewExpression.prototype.resolveSymbol = function(symbolTable, thisMethods) {
    return this.callee.resolveSymbol(symbolTable, thisMethods);
  };

  CallExpression.prototype.resolveSymbol = function(symbolTable, thisMethods) {
    var symbols = this.callee.resolveSymbol(symbolTable, thisMethods);
    if (symbols === [])
      return [];

    return symbols.reduce(function (results, symbol) {
      return results.concat(symbol.resolveSymbol(symbolTable, thisMethods));
    }, []);
  };

  LogicalExpression.prototype.resolveSymbol =
  BinaryExpression.prototype.resolveSymbol = function(symbolTable, thisMethods) {
    return this.left.resolveSymbol(symbolTable, thisMethods).concat(this.right.resolveSymbol(symbolTable, thisMethods));
  };

  UnaryExpression.prototype.resolveSymbol = function(symbolTable, thisMethods) {
    return this.argument.resolveSymbol(symbolTable, thisMethods);
  };

  AssignmentExpression.prototype.resolveSymbol = function(symbolTable, thisMethods) {
    return this.right.resolveSymbol(symbolTable, thisMethods);
  };

  ConditionalExpression.prototype.resolveSymbol = function(symbolTable, thisMethods) {
    return this.test.resolveSymbol(symbolTable, thisMethods).concat(
      this.consequent.resolveSymbol(symbolTable, thisMethods),
      this.alternate.resolveSymbol(symbolTable, thisMethods)
    );
  };

  ArrayExpression.prototype.resolveSymbol =
  SequenceExpression.prototype.resolveSymbol =
  UpdateExpression.prototype.resolveSymbol =
  ObjectExpression.prototype.resolveSymbol =
  Literal.prototype.resolveSymbol = function(symbolTable, thisMethods) {
    return [];
  };

  Node.prototype.callGraph = T.makePass("callGraph", "callGraphNode");

  Program.prototype.callGraph = function (o) {
    o = extend(o);
    o.scope = this.frame;
    o.calls = [];
    o.methods = Object.create(null);
    o.symbolTable = Object.create(null);

    this.body = passOverList(this.body, 'callGraph', o);

    var callQueue = [];
    for (var i=0, l=o.calls.length; i<l; i++) {
      callQueue.push(o.calls[i]);
    }

    while (callQueue.length > 0) {
      var curCallee = callQueue.shift();
      if (curCallee instanceof DummyFunction) {
        if (curCallee.realFunction === null)
          continue;
        curCallee = curCallee.realFunction;
      }
      if (curCallee.visited)
        continue;
      curCallee.visited = true;
      curCallee.called = true;

      for (var i=0, l=curCallee.calls.length; i<l; i++) {
        callQueue.push(curCallee.calls[i]);
      }
    }

    passOverList(this.body, 'callGraphCleanup', o);

    return this;
  };

  NewExpression.prototype.callGraphNode =
  CallExpression.prototype.callGraphNode = function (o) {
    resolved = Object.create(null);
    //print(this.callee);
    var callees = this.callee.resolveSymbol(o.symbolTable, o.methods);

    if (callees !== null) {
      for (var i=0; i < callees.length; i++) {
        o.calls.push(callees[i]);
      }
    }

    return this;
  };

  FunctionExpression.prototype.callGraph =
  FunctionDeclaration.prototype.callGraph = function (o) {
    if (this.id) {
      if (o.symbolTable[this.id.name] !== undefined) {
        var oldEntry = o.symbolTable[this.id.name];
      }
      o.symbolTable[this.id.name] = this;
    }

    var childOpts = extend(o);
    childOpts.scope = this.frame;
    childOpts.symbolTable = util.clone(o.symbolTable);
    if (oldEntry && oldEntry instanceof DummyFunction) {
      oldEntry.realFunction = this;
      childOpts.calls = oldEntry.calls;
      childOpts.methods = oldEntry.methods;
      this.called = oldEntry.called;
    } else {
      childOpts.calls = [];
      childOpts.methods = Object.create(null);
    }
    this.body = this.body.callGraph(childOpts);
    if (this.called === undefined) {
      this.called = false;
    }

    this.methods = childOpts.methods;
    this.calls = childOpts.calls;

    // copy out any dummy function entries
    for (var symbol in childOpts.symbolTable) {
      if (childOpts.symbolTable[symbol] instanceof DummyFunction &&
          o.symbolTable[symbol] === undefined) {
        o.symbolTable[symbol] = childOpts.symbolTable[symbol];
      }
    }

    return this;
  };

  AssignmentExpression.prototype.callGraphNode = function (o) {
    if (this.left instanceof Identifier) {
      o.symbolTable[this.left.name] = this.right;
    } else if (this.left instanceof MemberExpression) {
      if (this.left.object instanceof ThisExpression &&
          this.left.property instanceof Identifier) {
        o.methods[this.left.property.name] = this.right;
      } else if (this.left.object instanceof MemberExpression &&
                 this.left.property instanceof Identifier &&
                 this.left.object.object instanceof Identifier &&
                 this.left.object.property instanceof Identifier &&
                 this.left.object.property.name === "prototype") {
        var baseName = this.left.object.object.name;
        var base = o.symbolTable[baseName];
        var bases;
        if (base === undefined) {
          o.symbolTable[baseName] = new DummyFunction();
          bases = [o.symbolTable[baseName]];
        } else {
          bases = base.resolveSymbol(o.symbolTable, o.methods);
        }
        if (bases === []) {
          o.symbolTable[baseName] = new DummyFunction();
          bases = [o.symbolTable[baseName]];
        }
        for (var i=0; i < bases.length; i++) {
          bases[i].methods[this.left.property.name] = this.right;
        }
      }
    }

    return this;
  };


  /*
   * Cleanup
   */
  Node.prototype.callGraphCleanup = T.makePass("callGraphCleanup", "callGraphCleanupNode");

  FunctionExpression.prototype.callGraphCleanupNode =
  FunctionDeclaration.prototype.callGraphCleanupNode = function (o) {
    delete this.calls;
    delete this.methods;
    delete this.visited;

    return this;
  };

  /*
   * Print details
   */
  Node.prototype.callGraphPrint = T.makePass("callGraphPrint", "callGraphPrintNode");

  FunctionExpression.prototype.callGraphPrintNode =
  FunctionDeclaration.prototype.callGraphPrintNode = function (o) {
    print((this.id ? this.id.name : "anonymous")
          + ": "
          + (this.called ? "called" : "not called"));

    return this;
  };


  /*
   * Call instrumentation pass
   */

  var id = 0;
  var globalArrayId = new Identifier("__called");
  function instrumentationCode() {
    return new ExpressionStatement(
      new AssignmentExpression(
        new MemberExpression(
          globalArrayId,
          new Literal(id++),
          true
        ),
        "=",
        new Identifier("true")
      )
    );
  }

  var epilogue = 'var outStr = "[";\
for (var i=0,l=__called.length-1; i<l; i++) {\
  outStr += __called[i] + ",";\
}\
outStr += __called[__called.length-1] + "]";\
\
if (typeof process != "undefined") {\
  var fs = require("fs");\
  fs.writeFileSync("calls.profile", outStr);\
} else if (typeof window !== "undefined") {\
  document.open("data:text/plain;charset=utf-8," + outStr);\
}';  

  Node.prototype.instrumentCalls = T.makePass("instrumentCalls", "instrumentCallNode");

  Program.prototype.instrumentCallNode = function (o) {
    this.body.unshift(new VariableDeclaration(
      "var", [
        new VariableDeclarator(
          globalArrayId,
          new NewExpression(
            new Identifier("Uint8Array"),
            [new Literal(id)]
          )
        )
      ]));

    this.body.push(new ExpressionStatement(
      new CallExpression(
        new Identifier("eval"),
        [new Literal(epilogue)]
      )
    ));

    return this;
  };

  FunctionExpression.prototype.instrumentCallNode = 
  FunctionDeclaration.prototype.instrumentCallNode = function (o) {
    var instrumentation = instrumentationCode();
    if (this.body instanceof BlockStatement) {
      this.body.body.unshift(instrumentation);
    } else {
      this.body = new BlockStatement([instrumentation, this.body]);
    }

    return this;
  };
  

}).call(this, typeof exports === "undefined" ? (callGraph = {}) : exports);

