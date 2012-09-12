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
  addY: (value) -> @d[1] += value; this

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
    points = tree.nearest({x: boid.position.x(), y: boid.position.y()}, 10)
    for p in points
      b = new Vector2(p[0].x, p[0].y)
      if b.x() != boid.position.x() and b.y() != boid.position.y()
        dist = distance(b, boid.position)
        if dist < 50
          vel.substract direction(boid.position, b)
          
    vel

  stayInBounds = (boid, lx, ly, hx, hy, p = 2) ->
    vel = new Vector2
    vel.addX Math.pow(lx - boid.position.x(), p) if boid.position.x() < lx
    vel.addY Math.pow(ly - boid.position.y(), p) if boid.position.y() < ly
    vel.addX -Math.pow(hx - boid.position.x(), p) if boid.position.x() > hx
    vel.addY -Math.pow(hy - boid.position.y(), p) if boid.position.y() > hy
    vel

  direction = (from, to) ->
    goal = new Vector2(to.x(), to.y())
    goal.substract(from)

  initialize = ->
    lastRun = time()
    for [1..50]
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
      vel.add direction(b.position, perceivedCenter(b)).scalarMultiply(1)
      vel.add avoidCollisions(b).scalarMultiply(1)
      vel.add perceivedFlockVelocity(b).scalarMultiply(10)
      vel.add stayInBounds(b, 50, 50, renderer.width() - 50, renderer.height() - 50, 2).scalarMultiply(8)
      vel.limit(1)

      b.velocity.add vel.scalarMultiply(0.05)
      b.velocity.limit(1)

    # Update position
    for b in boids
      vel = b.velocity.clone()
      #vel.limit(0.4)
      vel.scalarMultiply(delta/5)
      b.position.add vel

  run = ->
    delta = time() - lastRun
    lastRun = time()

    update(delta)
    renderer.render(boids, center)
  
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


    




  
  



