(function() {
  var setActiveButton;

  $(document).ready(function() {
    window.boids = new Boids(new Boids2DRenderer($("canvas")[0]));
    window.boids.start();
    $("#options-button").click(function() {
      if ($("#options").is(':visible')) {
        return $("#options").slideUp(1000);
      } else {
        return $("#options").slideDown(1000);
      }
    });
    $("#play").click(function() {
      window.boids.start();
      return setActiveButton("play");
    });
    $("#pause").click(function() {
      window.boids.pause();
      return setActiveButton("pause");
    });
    $("#stop").click(function() {
      window.boids.stop();
      return setActiveButton("stop");
    });
    return $(".slider-box > .slider").slider();
  });

  setActiveButton = function(btn) {
    $("#play").removeClass("active");
    $("#stop").removeClass("active");
    $("#pause").removeClass("active");
    return $("#" + btn).addClass("active");
  };

}).call(this);
