class window.KDTree
  # Node class for the tree
  class Node
    constructor: (@obj) ->
      @left = null
      @right = null

  # Instance variables
  dimensions = []
  k = 0
  metric = undefined

  distance2 = (a, b) -> Math.pow(a.x - b.x) + Math.pow(a.y - b.y)
  distanceMetric = (a, b) ->
      sum = 0
      sum += Math.pow(a[d] - b[d], 2) for d in dimensions
      sum
  distanceReal = (a, b) -> Math.sqrt(distanceMetric(a, b))

  buildTree = (points, depth) ->
    

  best = null # A max-heap containing the best points found in the search

  save = (node, query, n) ->
    x = node.obj
    if best.size() >= n 
      return if distanceMetric(x, query) > distanceMetric(best.top(), query)

    best.push(x)
    best.pop() if best.size() > n

    

  nearestSearch = (cur, query, n, depth = 0) ->
    # If we have reached a leaf
    if cur.left == null and cur.right == null
      # Try saving this point and return
      save(cur, query, n)
      return

    # Find the best and second-best child
    bestChild = null
    otherChild = null
    d = dimensions[depth % k]
    if cur.left != null and (cur.right == null or query[d] < cur.obj[d])
      bestChild = cur.left
      otherChild = cur.right
    else
      bestChild = cur.right
      otherChild = cur.left

    # Search the side closest to the query point first
    nearestSearch(bestChild, query, n, depth + 1)
    # Try saving this point
    save(cur, query, n)


    minDist = Math.abs(query[d] - cur.obj[d]) # A point on the second-best half can't be closer than this
    worstOfBest = distanceReal(best.top(), query) # The "worst best" point we've found till now

    # If it's still possible to find better points on the second-best half
    if otherChild != null and (minDist < worstOfBest or best.size() < n)
      nearestSearch(otherChild, query, n, depth + 1)
        
  constructor: (p = [], d = ["x", "y"], m = distance2) ->
    points = p; dimensions = d; m = m
    @root = null
    k = dimensions.length
    for point in points
      @add(point)

  nearest: (query, n = 1) ->
    # Initialize best to a max-heap of points sorted by the distance to the query point
    best = new Heap( (x) -> 
      sum = 0
      sum += Math.pow(query[d] - x[d], 2) for d in dimensions
      sum
    )
    nearestSearch(@root, query, n)
    arr = []
    arr.push(best.pop()) until best.size() == 0
    arr

  add: (point) ->
    cur = @root
    parent = null
    depth = 0
    until cur == null
      parent = cur
      d = dimensions[depth % k]
      if point[d] < cur.obj[d]
        cur = cur.left
      else
        cur = cur.right

      depth += 1

    depth -= 1
    d = dimensions[depth % k]
    cur = new Node(point)
    if parent == null
      @root = cur
    else
      if point[d] < parent.obj[d]
        parent.left = cur 
      else
        parent.right = cur
    return @root

