/*
  This modules adds code mirror code rendering to items on the page that
  contain code. To enable it on your elements add the classname:
  .deck-codemirror to your container and the classname 'codemirror-item'
  to any block that you wish to codemirrorify.
*/
(function($, deck, undefined, jsc) {

  var $d = $(document);
  
  /*
  Extends defaults/options.
  
  options.classes.codemirror
    This class is added to the deck container when there is code in the 
    slide that should be 
    
  options.selectors.codemirror-item
    This class should be added to the element containing code that should
    be highlighted.
  */
  $.extend(true, $[deck].defaults, {
    classes: {
      codemirror: 'deck-codemirror',
      codemirrorresult: 'deck-codemirror-result'
    },
    
    selectors: {
      codemirroritem: '.code',
    },

    data : {
      codemirrorified: 'codemirrorified'
    },
    codemirror : {
      lineNumbers : true,
      theme : "default",
      mode : "javascript",
      theme : "default",
      indentUnit : 1,
      indentWithTabs : false,
      runnable : false
    },
    jscOptions: {
      'profile-calls': false,
      'min-len': '0',
      output: 'output.js',
      'only-parse': false,
      'emit-ast': false,
      'pretty-print': false,
      bare: false,
      'load-instead': false,
      warn: true,
      null: false,
      'simple-log': false,
      trace: false,
      help: false,
      nowarn: true,
      minify: false,
      'lazy-minimum': '0',
      'new-function': false,
      'split-strings': '',
      'call-graph': false,
      'read-profile': '',
      'no-loc': false
    }
  });
  
  // flag to indicate that we are currently in the editor. Required to stop keypress
  // propagation to all other extensions.
  var inEditor = false;

  // a helper private function that can be used to "codemirror" a slide if that slide
  // has any elements with the proper classname.
  var codemirrorify = function(slide) {
    var $container = $[deck]('getContainer'),
        opts = $[deck]('getOptions'),
        codeblocks = $(slide).find(opts.selectors.codemirroritem),
        hiddenScripts  = [],
        cleanupScripts = [];

    // Seek out and cache all hidden scripts
    $("script[type=codemirror]").each(function() {
      hiddenScripts.push({
        selector: $(this).data("selector"),
        src: this.innerHTML
      });
    });
    
    // Seek out and cache all cleanup scripts
    $("script[type=\"codemirror/cleanup\"]").each(function() {
      cleanupScripts.push({
        selector: $(this).data("selector"),
        src: this.innerHTML
      });
    });



    // go through all code blocks
    $.each(codeblocks, codemirrorifyBlock);
    function codemirrorifyBlock(i, codeblock) {

      // if codeblock hasn't been codemirrorified yet
      if (!$.data(codeblock, opts.data.codemirrorified)) {

        $(codeblock).wrap('<div class="code-wrap"/>').wrap('<div class="code-box"/>');

        // initialize defaults.
        var codeblock = $(codeblock),
            editor    = null,
            options   = $.extend(opts.codemirror,
              {
                mode : !!codeblock.attr('mode') ? codeblock.attr('mode') : opts.codemirror.mode,
                theme : !!codeblock.attr('theme') ? codeblock.attr('theme') : opts.codemirror.theme,
                onFocus : function(e) {
                  inEditor = true;
                },
                onBlur : function(e) {
                  inEditor = false;
                }
              }
            );

        // if this is a textarea just use the codemirror shorthand.
        if (codeblock.get(0).nodeName.toUpperCase() === "TEXTAREA") {
          editor = CodeMirror.fromTextArea(codeblock[0], options);
        } else {
          // else codemirror the element's content and attach to element parent. 
          var parent  = codeblock.parent();
          codeblock.hide();
          editor      = CodeMirror(parent[0], 
            $.extend(options, {
              value : codeblock.html()
            })
          );
        }

        // mark that this code block has been codemirrored.
        $.data(codeblock[0], opts.data.codemirrorified, 'true');

        // attach a listener to this event to make sure that all other keybindings
        // don't trigger on keypress.
        $(editor.getWrapperElement()).keydown(function(e) {
          e.stopPropagation();
        });

        var wrapper = editor.getWrapperElement();

        if (codeblock.attr("compilable") || opts.codemirror.runnable || codeblock.attr("runnable")) {
          var output = $('<div>', {
                "class" : opts.classes.codemirrorresult
              }).appendTo($(wrapper).parent());
        }


        function makeCompilable() {
          var compileButton  = $('<span>', {
                "class" : "button",
                text : "Compile"
              }).prependTo(wrapper);
          //     newCodeBlock = $('<div id="test" class="code" mode="javascript" style="display:none;" runnable="true"/>').appendTo($(wrapper).parent());

          // newCodeBlock.id = 'compiled' + codeblock.id;
          // newCodeBlock = codemirrorifyBlock(0, newCodeBlock);

          compileButton.click(function(event) {
            output.html('');

            // save the default logging behavior.
            var real_console_log = console.log;

            print = console.log = function() {
              var messages = [];
              // Convert all arguments to Strings (Objects will be JSONified).
              for (var i = 0; i < arguments.length; i++) {
                var value = arguments[i];
                messages.push(typeof(value) == 'object' ? JSON.stringify(value) : String(value));
              }
              var msg = messages.join(" ");
              if (output.html() !== "") {
                output.append("<br />" + msg);
              } else {
                output.html(msg);
              }
            };

            var compiledCode = jsc.compile(codeblock.id, codeblock.id, codeblock.text(), opts.jscOptions);

            // set the old logging behavior back.
            console.log = real_console_log;

            editor.setValue(compiledCode);

            compileButton.remove();
          });
        }

        function makeRunnable() {
          // make the code runnable
          var button  = $('<span>', {
                "class" : "button",
                text : "Run"
              }).prependTo(wrapper);

          button.click(function(editor, output){
            return function(event) {
              output.html('');

              // save the default logging behavior.
              var real_console_log = console.log;
              
              // save the default logging behavior.
              // Following Dean Edward's fantastic sandbox code:
              // http://dean.edwards.name/weblog/2006/11/sandbox/+evaluating+js+in+an+iframe
              // create an iframe sandbox for this element.
              var iframe = $("<iframe>")
                .css("display", "none")
                .appendTo($d.find('body'));

              // Overwrite the default log behavior to pipe to an output element.

              // Overwrite the default log behavior to pipe to an output element.
              console.log = function() {
                var messages = [];
                // Convert all arguments to Strings (Objects will be JSONified).
                for (var i = 0; i < arguments.length; i++) {
                  var value = arguments[i];
                  messages.push(typeof(value) == 'object' ? JSON.stringify(value) : String(value));
                }
                var msg = messages.join(" ");
                if (output.html() !== "") {
                  output.append("<br />" + msg);
                } else {
                    output.html(msg);
                }
              };

              var sandBoxMarkup = "<script>"+
                "var MSIE/*@cc_on =1@*/;"+ // sniff
                "console={ log: parent.console.log };" +
                "parent.sandbox=MSIE?this:{eval:function(s){return eval(s)}}<\/script>";

              var exposeGlobals;
              if (exposeGlobals = $(codeblock).attr("globals")) {
                exposeGlobals = exposeGlobals.split(",");

                $.each(exposeGlobals, function(prop, val) {
                  val = $.trim(val);
                  iframe[0].contentWindow[val] = window[val];
                });
              }

              // write a script into the <iframe> and create the sandbox
              frames[frames.length - 1].document.write(sandBoxMarkup);

              var combinedSource = "";

              // Prepend all setup scripts
              $.each(hiddenScripts, function() {
                if ($(codeblock).is(this.selector)) {
                  combinedSource += this.src + "\n";
                }
              });
              
              combinedSource += editor.getValue();
              
              // Append all cleanup scripts
              $.each(cleanupScripts, function() {
                if ($(codeblock).is(this.selector)) {
                  combinedSource = combinedSource + this.src + "\n";
                }
              });

              // eval in the sandbox.
              sandbox.eval(combinedSource);

              // get rid of the frame. New Frame for every context.
              iframe.remove();
              
              // set the old logging behavior back.
              console.log = real_console_log;
            };
          }(editor, output));
        }

        if (codeblock.attr("compilable")) {
          // make the code compilable
          makeRunnable();
          makeCompilable();
        }

        if (opts.codemirror.runnable || codeblock.attr("runnable")) {
          makeRunnable();
        }
      }
      return editor;
    }
  };

  $d.bind('deck.init', function() {
    var length = $[deck]('getSlides').length;
    for (var i=0; i < length; i++) {
      codemirrorify($.deck('getSlide', i));
    }
  });

  // $d.bind('deck.init', function() {
  //   // codemirrorify current and next slide, since we're in the beginning.
  //   codemirrorify($.deck('getSlide', 0));
  //   codemirrorify($.deck('getSlide', 1));
  // });

  // $d.bind('deck.change', function(event, from, to) {
  //   var $slides    = $[deck]('getSlides');
  //   // codemirrorify previous slide
  //   if (to > 0) {
  //     codemirrorify($.deck('getSlide', to - 1));
  //   } 
    
  //   // codemirrorify current slide
  //   codemirrorify($.deck('getSlide', to));

  //   // codemirrorify next slide
  //   if (to+1 < $slides.length) {
  //     codemirrorify($.deck('getSlide', to + 1));
  //   }
  // });
})(jQuery, 'deck', this, jsc);



