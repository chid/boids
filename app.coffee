# Contains code that makes use of jquery to interact with the user, manage the UI and start the application.

$(document).ready ->
  window.renderer = new Boids2DRenderer($("canvas")[0])
  window.simulation = new Boids(window.renderer)
  window.simulation.start()

  
  displayOnButtonClick("#options-button", "#options", "#info")
  displayOnButtonClick("header", "#info", "#options")

  $("header").hover( ->
      $("#instruction").slideDown(500)
    , ->
      $("#instruction").slideUp(500)
  )


  $("#play").click -> 
    window.simulation.start()
    setActiveButton("play")
  $("#pause").click ->
    window.simulation.pause()
    setActiveButton("pause")
  $("#stop").click ->
    window.simulation.stop()
    setActiveButton("stop")

  window.goalSet = false
  $("#sim").click (e) ->
    if window.goalSet
      window.simulation.unsetGoal()
      window.goalSet = false
    else
      window.simulation.setGoal(e.pageX, e.pageY)
      window.goalSet = true

  $("#sim").mousemove (e) ->
    window.simulation.setGoal(e.pageX, e.pageY) if window.clicking
    


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
  value = window.simulation.get(option)
  setOption(option, value)
  value: value
  min: min
  max: max
  step: step
  slide: (event, ui) -> setOption(option, ui.value) 

setOption = (option, value) ->
  window.simulation.set(option, value)
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


