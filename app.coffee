# Contains code that makes use of jquery to interact with the user, manage the UI and start the application.

$(document).ready ->
  window.boids = new Boids(new Boids2DRenderer($("canvas")[0]))
  window.boids.start()

  $("#options-button").click ->
    if $("#options").is(':visible')
      $("#options").slideUp(1000)
    else
      $("#options").slideDown(1000)

  $("header").hover( ->
      $("#instruction").slideDown(500)
    , ->
      $("#instruction").slideUp(500)
  )


  $("#play").click -> 
    window.boids.start()
    setActiveButton("play")
  $("#pause").click ->
    window.boids.pause()
    setActiveButton("pause")
  $("#stop").click ->
    window.boids.stop()
    setActiveButton("stop")

  initializeSliders()

setActiveButton = (btn) ->
  $("#play").removeClass("active")
  $("#stop").removeClass("active")
  $("#pause").removeClass("active")
  $("##{btn}").addClass("active")

initializeSliders = ->
  $("#boidsNumber > .slider").slider sliderArguments('boidsNumber', 10, 500, 10)
  $("#flockSize > .slider").slider sliderArguments('flockSize', 5, 500, 5)
  options = ["simulationSpeed", "acceleration", "perceivedCenterWeight", "perceivedVelocityWeight", "collisionAvoidanceWeight", "stayInBoundsWeight"]
  for option in options
    $("##{option} > .slider").slider sliderArguments(option)

sliderArguments = (option, min = 0, max = 10, step = 1) ->
  value = window.boids.get(option)
  setOption(option, value)
  value: value
  min: min
  max: max
  step: step
  slide: (event, ui) -> setOption(option, ui.value) 

setOption = (option, value) ->
  window.boids.set(option, value)
  $("##{option} > .value").html(value)
  if value == 0
    $("##{option} > .value").addClass('zero')
  else
    $("##{option} > .value").removeClass('zero')
