(function($, deck) {

  function makeCompilable(slide) {
    var compileBlocks = $(slide).find('.code[compilable]');
  }

  var $d = $(document);

  $d.bind('deck.init', function() {
    
    // makeCompilable current and next slide, since we're in the beginning.
    makeCompilable($.deck('getSlide', 0));
    makeCompilable($.deck('getSlide', 1));
  });

  $d.bind('deck.change', function(event, from, to) {
    var $slides    = $[deck]('getSlides');
    // makeCompilable previous slide
    if (to > 0) {
      makeCompilable($.deck('getSlide', to - 1));
    } 
    
    // makeCompilable current slide
    makeCompilable($.deck('getSlide', to));

    // makeCompilable next slide
    if (to+1 < $slides.length) {
      makeCompilable($.deck('getSlide', to + 1));
    }
  });

})(jQuery, 'deck');
