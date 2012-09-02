Deferrify automatically transforms existing JavaScript into code with deferred parsing and/or loading.

For a quick intro, check out this [presentation](http://deferrify.com/slides/).


Why defer?
----------

Most of a site's JavaScript is actually never executed during page loading! Consequently, your browser is fetching (over a comparatively slow network connection) and parsing code long before it needs to, slowing the page down. Splitting an application or site's JavaScript into code that is used to load the page and code that is called later is a fairly common practice. You can even take this idea one step further by fetching JavaScript as a quickly parsed structure, such as a [string](http://blog.sproutcore.com/faster-loading-through-eval/) or [comment](http://googlecode.blogspot.com/2009/09/gmail-for-mobile-html5-series-reducing.html) and creating functions lazily from these strings or comments, as needed. This saves parsing time, since the browser never needs to parse code that is never executed.

So where does Deferrify come in?
--------------------------------

Unfortunately splitting code for deferred loading currently requires developers to manually split their code into "during page load" and "later" parts. This often requires an intimate understanding of the code in order to determine which functions are really needed during page loading. Deferrify can automatically determine which code is required during load, and split everything else into strings to defer parsing, and optionally into a separate file for deferred loading.


Installation
------------

Deferrify is written in pure JavaScript, and uses [Esprima](http://esprima.org/) and [Escodegen](Constellation/escodegen). This should allow Deferrify to run on any JavaScript engine (tested on JS shell, Firefox 14+, and Node.js.

The easiest way to get started with Deferrify is using [Node.js](http://nodejs.org/). If you already have Node installed, simply execute the deferrify script, found in the root of the source tree.

If you prefer using the SpiderMonkey JS shell, you can run deferrify with

    js src/deferrify.js

Deferrify can also run in the browser, although setting this up is a bit more complicated. See the sources of this [presentation](http://deferrify.com/slides/) for more details.


Examples
--------

For detailed usage instructions, check out

    deferrify --help

Compile input.js to output.js, deferring parsing of all functions larger than 100 bytes:

    deferrify -Z 100 -o output.js input.js

Now split all deferred strings into a new file, split.js, as well:

    deferrify -Z 100 -Zs split.js -o output.js input.js

Instrument with profiling code (no deferring yet):

    deferrify -Zi -o output.js input.js

Once the code has been instrumented, load it in the browser. When the page has finished loading, hit the "Show Profile" link, and save the resulting profile (for example, as calls.profile). Deferrify can now read this profile and optimize the deferred code to not defer anything called as part of the page load:

    deferrify -Z 100 -Zp calls.profile -o output.js input.js
