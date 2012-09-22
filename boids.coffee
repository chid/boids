
# Represents a single boid
class Boid
  constructor: (x = 0, y = 0) ->
    @position = new Vector2(x, y)
    @velocity = new Vector2(0, 0)

window.dist = (a, b) -> Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))

# Boids simulation class
class @Boids
  # Instance variables
  loopInterval = 20 # Aim for 50 frames per second
  lastRun = null
  center = null
  totalPosition = null
  totalVelocity = null
  tree = null
  options =
    simulationSpeed: 15
    boidsNumber: 100
    acceleration: 2
    perceivedCenterWeight: 10
    perceivedVelocityWeight: 10
    collisionAvoidanceWeight: 5
    stayInBoundsWeight: 8
    flockSize: 10
    minCollisionAvoidanceDistance: 50
    stayInBoundsPower: 2

  # Private methods
  randomUpTo = (limit) -> Math.floor(Math.random() * limit) + 1

  time = ->
    new Date().getTime()

  velocitySum: ->
    sum = new Vector2
    sum.add b.velocity for b in @boids
    sum

  positionSum: ->
    sum = new Vector2
    sum.add b.position for b in @boids
    sum

  perceivedFlockVelocity: (boid) ->
    sum = new Vector2
    points = tree.nearest({x: boid.position.x(), y: boid.position.y()}, Math.min(@boids.length, options['flockSize']))
    for p in points
      pos = new Vector2(p.x, p.y)
      sum.add p.velocity unless pos.x() == boid.position.x() and pos.y() == boid.position.y()
    sum.scalarDivide(points.length - 1)

  perceivedCenter: (boid) ->
    sum = new Vector2
    points = tree.nearest({x: boid.position.x(), y: boid.position.y()}, Math.min(@boids.length, options['flockSize']))
    for p in points
      pos = new Vector2(p.x, p.y)
      sum.add pos unless pos.x() == boid.position.x() and pos.y() == boid.position.y()
    sum.scalarDivide(points.length - 1)

  averagePosition: ->
    sum = new Vector2
    for b in @boids
      sum.add b.position
    sum.scalarDivide(@boids.length)
    sum

  distance: (a, b) -> Math.sqrt(Math.pow(a.x() - b.x(), 2) + Math.pow(a.y() - b.y(), 2))

  avoidCollisions: (boid) ->
    vel = new Vector2
    points = tree.nearest({x: boid.position.x(), y: boid.position.y()}, Math.min(@boids.length, options['flockSize']))
    for p in points
      b = new Vector2(p.x, p.y)
      if b.x() != boid.position.x() and b.y() != boid.position.y()
        dist = @distance(b, boid.position)
        if dist < options['minCollisionAvoidanceDistance']
          vel.substract @direction(boid.position, b)
          
    vel

  stayInBounds: (boid, lx, ly, hx, hy, p = 2) ->
    vel = new Vector2
    vel.addX Math.pow(lx - boid.position.x(), p) if boid.position.x() < lx
    vel.addY Math.pow(ly - boid.position.y(), p) if boid.position.y() < ly
    vel.addX -Math.pow(hx - boid.position.x(), p) if boid.position.x() > hx
    vel.addY -Math.pow(hy - boid.position.y(), p) if boid.position.y() > hy
    vel

  direction: (from, to) ->
    goal = new Vector2(to.x(), to.y())
    goal.substract(from)

  initialize: ->
    lastRun = time()
    @boids = []
    @goal = null
    @setBoidsCount(options['boidsNumber'])

  setBoidsCount: (number) ->
    return if number == @boids.length
    if number > @boids.length
      until number == @boids.length
        @boids.push new Boid(randomUpTo(@renderer.width()), randomUpTo(@renderer.height()))
    if number < @boids.length
      until number == @boids.length
        @boids.pop()

  update: (delta) ->
    center = @averagePosition()
    totalPosition = @positionSum()
    totalVelocity = @velocitySum()
    
    tree = new KDTree(@boids.map( (b) ->
      {x: b.position.x(), y: b.position.y(), velocity: b.velocity}
    ))

    # Update velocities
    for b in @boids
      vel = new Vector2
      vel.add @direction(b.position, @perceivedCenter(b)).scalarMultiply(options['perceivedCenterWeight'])
      vel.add @avoidCollisions(b).scalarMultiply(options['collisionAvoidanceWeight'])
      vel.add @perceivedFlockVelocity(b).scalarMultiply(options['perceivedVelocityWeight'])
      vel.add @stayInBounds(b, 50, 50, @renderer.width() - 50, @renderer.height() - 50, options['stayInBoundsPower']).scalarMultiply(options['stayInBoundsWeight'])
      vel.add @direction(b.position, @goal).scalarMultiply(5) if @goal

      vel.limit(1)

      b.velocity.add vel.scalarMultiply(options['acceleration']/100)
      b.velocity.limit(1)

    # Update position
    for b in @boids
      vel = b.velocity.clone()
      #vel.limit(0.4)
      vel.scalarMultiply(delta/(20-options['simulationSpeed']+1))
      b.position.add vel

  run: =>
    delta = time() - lastRun
    lastRun = time()

    @setBoidsCount(options['boidsNumber'])
    @update(delta)
    @renderer.render(@boids, center, @goal)
  
  # Public API
  constructor: (render_class) ->
    console.log("Initializing")
    @boids = []
    @renderer = render_class
    @status = "stopped"

  start: ->
    lastRun = time() if @status == "paused"
    @initialize() if @status == "stopped"

    @intervalHandle = setInterval(@run, loopInterval)
    @status = "running"

  pause: ->
    window.clearInterval(@intervalHandle)
    @status = "paused"

  stop: ->
    window.clearInterval(@intervalHandle)
    @renderer.clearScreen()
    @status = "stopped"

  setGoal: (x, y) ->
    @goal = new Vector2(x, y)

  unsetGoal: () ->
    @goal = null

  get: (option) -> options[option]
  set: (option, value) -> options[option] = value
 
