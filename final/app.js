(function() {
  var displayOnButtonClick, initializeCheckboxes, initializeSliders, rand, setActiveButton, setOption, sliderArguments;

  $(document).ready(function() {
    window.renderer = new Boids2DRenderer($("canvas")[0]);
    window.boids = new Boids(window.renderer);
    displayOnButtonClick("#options-button", "#options", "#info");
    displayOnButtonClick("header", "#info", "#options");
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

  rand = function(l) {
    if (l == null) l = 100;
    return Math.floor(Math.random() * l);
  };

  window.testKDTree = function() {
    var arr, i, j, tree, x, _i, _len;
    arr = [];
    tree = new window.KDTree();
    for (i = 1; i <= 10; i++) {
      for (j = 1; j <= 10; j++) {
        arr.push({
          x: i,
          y: j
        });
      }
    }
    for (_i = 0, _len = arr.length; _i < _len; _i++) {
      x = arr[_i];
      tree.add(x);
    }
    return tree;
  };

}).call(this);
