# Contains code that makes use of jquery to interact with the user, manage the UI and start the application.

$(document).ready ->
  window.boids = new Boids(new Boids2DRenderer($("canvas")[0]))
  window.boids.start()

  $("#options-button").click ->
    if $("#options").is(':visible')
      $("#options").slideUp(1000)
    else
      $("#options").slideDown(1000)

  $("#play").click -> 
    window.boids.start()
    setActiveButton("play")
  $("#pause").click ->
    window.boids.pause()
    setActiveButton("pause")
  $("#stop").click ->
    window.boids.stop()
    setActiveButton("stop")

  $(".slider-box > .slider").slider()

setActiveButton = (btn) ->
  $("#play").removeClass("active")
  $("#stop").removeClass("active")
  $("#pause").removeClass("active")
  $("##{btn}").addClass("active")
