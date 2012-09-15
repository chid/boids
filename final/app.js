(function() {
  var initializeSliders, setActiveButton, setOption, sliderArguments;

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
    $("header").hover(function() {
      return $("#instruction").slideDown(500);
    }, function() {
      return $("#instruction").slideUp(500);
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
    return initializeSliders();
  });

  setActiveButton = function(btn) {
    $("#play").removeClass("active");
    $("#stop").removeClass("active");
    $("#pause").removeClass("active");
    return $("#" + btn).addClass("active");
  };

  initializeSliders = function() {
    var option, options, _i, _len, _results;
    $("#boidsNumber > .slider").slider(sliderArguments('boidsNumber', 10, 500, 10));
    $("#flockSize > .slider").slider(sliderArguments('flockSize', 5, 500, 5));
    options = ["simulationSpeed", "acceleration", "perceivedCenterWeight", "perceivedVelocityWeight", "collisionAvoidanceWeight", "stayInBoundsWeight"];
    _results = [];
    for (_i = 0, _len = options.length; _i < _len; _i++) {
      option = options[_i];
      _results.push($("#" + option + " > .slider").slider(sliderArguments(option)));
    }
    return _results;
  };

  sliderArguments = function(option, min, max, step) {
    var value;
    if (min == null) min = 0;
    if (max == null) max = 10;
    if (step == null) step = 1;
    value = window.boids.get(option);
    setOption(option, value);
    return {
      value: value,
      min: min,
      max: max,
      step: step,
      slide: function(event, ui) {
        return setOption(option, ui.value);
      }
    };
  };

  setOption = function(option, value) {
    window.boids.set(option, value);
    $("#" + option + " > .value").html(value);
    if (value === 0) {
      return $("#" + option + " > .value").addClass('zero');
    } else {
      return $("#" + option + " > .value").removeClass('zero');
    }
  };

}).call(this);
