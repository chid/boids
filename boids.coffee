$(document).ready ->
  window.boids = new Boids(new Boids2DRenderer($("canvas")[0]))
  window.boids.start()
  
#TODO: Generalize this to work with any number of dimensions
class Vector2
  # Instance variables
  dimensions = 2 

  # Public API
  constructor: (a, b) ->
    a = 0 if a == undefined
    b = 0 if b == undefined
    @d = [0, 0]
    @d[0] = a; @d[1] = b

  add: (otherVector) ->
    @d[i] += otherVector.d[i] for i in [0...dimensions]
    this

  substract: (otherVector) ->
    @d[i] -= otherVector.d[i] for i in [0...dimensions]
    this

  scalarDivide: (scalar) ->
    @d[i] = @d[i] / scalar for i in [0...dimensions]
    this

  scalarMultiply: (scalar) ->
    @d[i] = @d[i] * scalar for i in [0...dimensions]
    this

  # Propotionally limit the vector
  limit: (l) ->
    max = 0
    max = Math.max(max, Math.abs(@d[i])) for i in [0...dimensions]
    @scalarMultiply(l/max) if max > l
    this

  
  addX: (value) -> @d[0] += value; this
  addY: (value) -> @d[0] += value; this

  x: -> @d[0]
  y: -> @d[1]

  toString: -> "(#{@d[0]}, #{@d[1]})"

  clone: -> return new Vector2(@x(), @y())

class Boid
  constructor: (x = 0, y = 0) ->
    @position = new Vector2(x, y)
    @velocity = new Vector2(0, 0)

window.dist = (a, b) -> Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))

class Boids
  # Instance variables
  status = null
  loopInterval = 20 # Aim for 50 frames per second
  intervalHandle = null
  renderer = null
  boids = []
  lastRun = null
  center = null
  totalPosition = null
  totalVelocity = null
  tree = null

  # Private methods
  randomUpTo = (limit) -> Math.floor(Math.random() * limit) + 1

  time = ->
    new Date().getTime()

  velocitySum = ->
    sum = new Vector2
    sum.add b.velocity for b in boids
    sum

  positionSum = ->
    sum = new Vector2
    sum.add b.position for b in boids
    sum

  perceivedFlockVelocity = (boid) ->
    sum = totalVelocity.clone()
    sum.substract boid.velocity
    sum.scalarDivide(boids.length - 1)

  perceivedCenter = (boid) ->
    sum = totalPosition.clone()
    sum.substract boid.position
    sum.scalarDivide(boids.length - 1)

  averagePosition = ->
    sum = new Vector2
    for b in boids
      sum.add b.position
    sum.scalarDivide(boids.length)
    sum

  distance = (a, b) -> Math.sqrt(Math.pow(a.x() - b.x(), 2) + Math.pow(a.y() - b.y(), 2))

  avoidCollisions = (boid) ->
    vel = new Vector2
    points = tree.nearest({x: boid.position.x(), y: boid.position.y()}, 5)
    for p in points
      b = new Vector2(p.x, p.y)
      if b.x() != boid.position.x() and b.y() != boid.position.y()
        if distance(b, boid.position) < 20
          console.log "Moving away"
          vel.substract direction(boid.position, b)
          
    vel

  stayInBounds = (boid, width, height) ->
    vel = new Vector2
    vel.addX Math.pow(boid.position.x(), 10) if boid.position.x() <= 0
    vel.addY Math.pow(boid.position.y(), 10) if boid.position.y() <= 0
    vel.addX -Math.pow(boid.position.x()-width, 10) if boid.position.x() > width
    vel.addY -Math.pow(boid.position.y()-width, 10) if boid.position.y() > height
    vel

  direction = (from, to) ->
    goal = new Vector2(to.x(), to.y())
    goal.substract(from)

  initialize = ->
    lastRun = time()
    for [1..1000]
      boids.push new Boid(randomUpTo(renderer.width()), randomUpTo(renderer.height()))

  update = (delta) ->
    center = averagePosition()
    totalPosition = positionSum()
    totalVelocity = velocitySum()
    
    tree = new kdTree(boids.map( (b) ->
      {x: b.position.x(), y: b.position.y()}
    ) , window.dist, ["x", "y"])

    # Update velocities
    for b in boids
      vel = new Vector2
      vel.add direction(b.position, perceivedCenter(b)).scalarDivide(1000)
      vel.add avoidCollisions(b).scalarDivide(100)
      vel.add perceivedFlockVelocity(b)
      vel.add stayInBounds(b, renderer.width(), renderer.height()).scalarMultiply(5000000)
      vel.limit(0.2)
      b.velocity.add vel
      b.velocity.limit(0.2)

    # Update position
    for b in boids
      vel = b.velocity.clone()
      #vel.limit(0.4)
      vel.scalarMultiply(delta)
      b.position.add vel

  run = ->
    delta = time() - lastRun
    lastRun = time()

    update(delta)
    renderer.render(boids.map((b) -> b.position), center)
  
  # Public API
  constructor: (render_class) ->
    console.log("Initializing")
    renderer = render_class
    status = "stopped"

  start: ->
    console.log("Starting from status #{status}")
    intervalHandle = setInterval(run, loopInterval)
    initialize() if status == "stopped"
    status = "running"

  pause: ->
    console.log("Pausing")
    window.clearInterval(intervalHandle)
    status = "paused"

  stop: ->
    console.log("Stopping")

class Boids2DRenderer
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
    
  render: (boids, center) ->
    ctx.fillStyle = "black"
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for b in boids
      ctx.beginPath()
      ctx.arc(b.x(), b.y(), 3, 0, Math.PI*2, true)
      ctx.stroke()
      ctx.fill()

    ctx.fillStyle = "red"
    ctx.beginPath()
    ctx.arc(center.x(), center.y(), 3, 0, Math.PI*2, true)
    ctx.stroke()
    ctx.fill()
  
  width: -> canvas.width

  height: -> canvas.height


    




  
  



