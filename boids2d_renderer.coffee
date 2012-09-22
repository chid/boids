class @Boids2DRenderer
  # Instance variables
  canvas = null
  ctx = null
  options =
    showVelocityVectors: true
    showAveragePosition: false

  # Private methods
 
  getContext = ->
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx = canvas.getContext('2d')

  # Public API
  constructor: (el) ->
    canvas = el
    getContext()
    
  clearScreen: -> ctx.clearRect(0, 0, canvas.width, canvas.height)

  render: (boids, center, goal) ->
    ctx.fillStyle = "black"
    ctx.strokeStyle = "#333"
    @clearScreen()

    for b in boids
      ctx.beginPath()
      ctx.arc(b.position.x(), b.position.y(), 3, 0, Math.PI*2, true)
      ctx.stroke()
      ctx.fill()
      ctx.closePath()

      if options['showVelocityVectors']
        ctx.beginPath()
        ctx.moveTo(b.position.x(), b.position.y())
        ctx.lineTo(b.position.x() - b.velocity.x() * 10, b.position.y() - b.velocity.y() * 10)
        ctx.stroke()
        ctx.closePath()

    if options['showAveragePosition']
      ctx.fillStyle = "red"
      ctx.beginPath()
      ctx.arc(center.x(), center.y(), 3, 0, Math.PI*2, true)
      ctx.stroke()
      ctx.fill()

    if goal
      ctx.fillStyle = "rgba(230, 230, 55, 0.5)"
      ctx.strokeStyle = "#F0C44D"
      ctx.beginPath()
      ctx.arc(goal.x(), goal.y(), 10, 0, Math.PI*2, true)
      ctx.stroke()
      ctx.fill()

  
  width: -> canvas.width
  height: -> canvas.height

  handleResize: -> getContext()


  get: (option) -> options[option]
  set: (option, value) -> console.log "#{option} = #{value}"; options[option] = value

