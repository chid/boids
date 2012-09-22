(function() {
  var displayOnButtonClick, initializeCheckboxes, initializeSliders, setActiveButton, setOption, sliderArguments;

  $(document).ready(function() {
    window.renderer = new Boids2DRenderer($("canvas")[0]);
    window.simulation = new Boids(window.renderer);
    window.simulation.start();
    displayOnButtonClick("#options-button", "#options", "#info");
    displayOnButtonClick("header", "#info", "#options");
    $("header").hover(function() {
      return $("#instruction").slideDown(500);
    }, function() {
      return $("#instruction").slideUp(500);
    });
    $("#play").click(function() {
      window.simulation.start();
      return setActiveButton("play");
    });
    $("#pause").click(function() {
      window.simulation.pause();
      return setActiveButton("pause");
    });
    $("#stop").click(function() {
      window.simulation.stop();
      return setActiveButton("stop");
    });
    window.goalSet = false;
    $("#sim").click(function(e) {
      if (window.goalSet) {
        window.simulation.unsetGoal();
        return window.goalSet = false;
      } else {
        window.simulation.setGoal(e.pageX, e.pageY);
        return window.goalSet = true;
      }
    });
    $("#sim").mousemove(function(e) {
      if (window.clicking) return window.simulation.setGoal(e.pageX, e.pageY);
    });
    initializeCheckboxes();
    initializeSliders();
    return $(window).resize(function() {
      return window.renderer.handleResize();
    });
  });

  displayOnButtonClick = function(button, div, hide) {
    return $("" + button).click(function() {
      if (hide) if ($("" + hide).is(":visible")) $("" + hide).slideUp(1000);
      if ($("" + div).is(':visible')) {
        return $("" + div).slideUp(1000);
      } else {
        return $("" + div).slideDown(1000);
      }
    });
  };

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
    if (max == null) max = 20;
    if (step == null) step = 1;
    value = window.simulation.get(option);
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
    window.simulation.set(option, value);
    $("#" + option + " > .value").html(value);
    if (value === 0) {
      return $("#" + option + " > .value").addClass('zero');
    } else {
      return $("#" + option + " > .value").removeClass('zero');
    }
  };

  initializeCheckboxes = function() {
    var option, options, _i, _len, _results;
    options = ["showAveragePosition", "showVelocityVectors"];
    _results = [];
    for (_i = 0, _len = options.length; _i < _len; _i++) {
      option = options[_i];
      console.log(option);
      console.log(window.renderer.get(option));
      $("#" + option + " > input").prop("checked", window.renderer.get(option));
      _results.push($("#" + option + " > input").change(function() {
        return window.renderer.set($(this).parent().attr('id'), $(this).is(":checked"));
      }));
    }
    return _results;
  };

}).call(this);
