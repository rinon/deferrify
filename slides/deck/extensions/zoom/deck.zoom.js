/*!
Deck JS - deck.zoom
Copyright (c) 2011 Grayside
Dual licensed under the MIT license and GPL license.
https://github.com/imakewebthings/deck.js/blob/master/MIT-license.txt
https://github.com/imakewebthings/deck.js/blob/master/GPL-license.txt
*/

/*
This module allows to reach the start or end of the presentation immediately by
pressing the 'home' or 'end' keys.
*/
(function($, deck, undefined) {
	var $d = $(document);
	
	$.extend(true, $[deck].defaults, {
		keys: {
                        // home
                        first: [36],
                        // end
                        last: [35],
			// b
			mark: [66],
			// r
			zoom: [82]
		}
	});

        /*
        jQuery.deck('zoomToStart')
        Switches to the first slide in the deck.
        */
        $[deck]('extend', 'zoomToStart', function() {
          $[deck]('go', 0);
        });

        /*
        jQuery.deck('zoomToEnd')
        Switches to the first slide in the deck.
        */
        $[deck]('extend', 'zoomToEnd', function() {
          $[deck]('go', $[deck]('getSlides').length -1);
        });

        /*
        jQuery.deck('markSlide')
        Switches to the first slide in the deck.
        */
        $[deck]('extend', 'markSlide', function() {
	  $[deck]['zoom.mark'] =  $[deck]('getSlide').attr('id');
        });

        /*
        jQuery.deck('zoomToMark')
        Switches to the first slide in the deck.
        */
        $[deck]('extend', 'zoomToMark', function() {
          $[deck]('go', $[deck]['zoom.mark']);
        });

	/*
	jQuery.deck('Init')
	*/
	$d.bind('deck.init', function() {
		// Bind key events
		$d.unbind('keydown.deckzoom').bind('keydown.deckzoom', function(e) {
			var key = $[deck]('getOptions').keys.first;
			if (e.which === key || $.inArray(e.which, key) > -1) {
				e.preventDefault();
				$[deck]('zoomToStart');
			}

			var key = $[deck]('getOptions').keys.last;			
			if (e.which === key || $.inArray(e.which, key) > -1) {
				e.preventDefault();
				$[deck]('zoomToEnd');
			}

			var key = $[deck]('getOptions').keys.mark;			
			if (e.which === key || $.inArray(e.which, key) > -1) {
				e.preventDefault();
				$[deck]('markSlide');
			}

			var key = $[deck]('getOptions').keys.zoom;			
			if (e.which === key || $.inArray(e.which, key) > -1) {
				e.preventDefault();
				$[deck]('zoomToMark');
			}
		});

	});
})(jQuery, 'deck');

