class @Boids2DRenderer
  # Instance variables
  canvas = null
  ctx = null

  # Private methods

  # Public API
  constructor: (el) ->
    canvas = el
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx = canvas.getContext('2d')
    radius = 3
    console.log("Running render at #{canvas.width}x#{canvas.height}")
    
  clearScreen: -> ctx.clearRect(0, 0, canvas.width, canvas.height)

  render: (boids, center) ->
    ctx.fillStyle = "black"
    @clearScreen()

    for b in boids
      ctx.beginPath()
      ctx.arc(b.position.x(), b.position.y(), 3, 0, Math.PI*2, true)
      ctx.stroke()
      ctx.fill()
      ctx.closePath()

      ctx.beginPath()
      ctx.moveTo(b.position.x(), b.position.y())
      ctx.lineTo(b.position.x() - b.velocity.x() * 10, b.position.y() - b.velocity.y() * 10)
      ctx.stroke()
      ctx.closePath()

    ctx.fillStyle = "red"
    ctx.beginPath()
    ctx.arc(center.x(), center.y(), 3, 0, Math.PI*2, true)
    ctx.stroke()
    ctx.fill()
  
  width: -> canvas.width

  height: -> canvas.height

