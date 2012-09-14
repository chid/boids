#TODO: Generalize this to work with any number of dimensions
class @Vector2
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

