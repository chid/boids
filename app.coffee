# Contains code that makes use of jquery to interact with the user, manage the UI and start the application.

$(document).ready ->
  window.renderer = new Boids2DRenderer($("canvas")[0])
  window.boids = new Boids(window.renderer)
  window.boids.start()

  
  displayOnButtonClick("#options-button", "#options", "#info")
  displayOnButtonClick("header", "#info", "#options")

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

  initializeCheckboxes()
  initializeSliders()

  $(window).resize -> window.renderer.handleResize()

displayOnButtonClick = (button, div, hide) ->
  $("#{button}").click ->
    if hide
      $("#{hide}").slideUp(1000) if $("#{hide}").is(":visible")
    if $("#{div}").is(':visible')
      $("#{div}").slideUp(1000)
    else
      $("#{div}").slideDown(1000)

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

sliderArguments = (option, min = 0, max = 20, step = 1) ->
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

initializeCheckboxes = ->
  options = ["showAveragePosition", "showVelocityVectors"]
  for option in options
    console.log option
    console.log window.renderer.get(option)
    $("##{option} > input").prop("checked", window.renderer.get(option))
    $("##{option} > input").change -> window.renderer.set($(this).parent().attr('id'), $(this).is(":checked"))

rand = (l = 100) -> Math.floor(Math.random() * l)

window.testKDTree = ->
  arr = []; tree = new window.KDTree()
  for i in [1..10]
    for j in [1..10]
      arr.push {x: i, y: j}
  tree.add(x) for x in arr
  tree
