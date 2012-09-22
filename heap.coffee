class window.Heap
  metric = (x) -> x

  parentIndex = (x) -> Math.floor ((x+1)/2) - 1
  leftChildIndex = (x) -> Math.floor 2*x + 1
  rightChildIndex = (x) -> Math.floor 2*x + 2 

  bubbleUp: (pos) ->
    pos = @heap.length - 1 if pos == undefined
    until pos == 0
      element = @heap[pos]
      parentPosition = parentIndex(pos)
      parent = @heap[parentPosition]
      if metric(parent) < metric(element)
        @heap[parentPosition] = element
        @heap[pos] = parent
        pos = parentPosition
      else
        break

  sinkDown: (pos = 0) ->
    until pos == @heap.length - 1
      element = @heap[pos]
      leftChildPosition = leftChildIndex(pos)
      rightChildPosition = rightChildIndex(pos)
      swapPosition = null
      if leftChildPosition <= (@heap.length - 1) and metric(@heap[leftChildPosition]) > metric(element)
        swapPosition = leftChildPosition
      if rightChildPosition <= (@heap.length - 1) and metric(@heap[rightChildPosition]) > metric(element)
        if swapPosition == null or metric(@heap[rightChildPosition]) > metric(@heap[leftChildPosition])
          swapPosition = rightChildPosition

      unless swapPosition == null
        @heap[pos] = @heap[swapPosition]
        @heap[swapPosition] = element
        pos = swapPosition
      else
        break

  constructor: (func = (x) -> x) ->
    metric = func
    @heap = []

  push: (x) ->
    x.v = metric(x)
    @heap.push(x)
    @bubbleUp()

  pop: () ->
    return null if @heap.length == 0
    top = @heap[0]
    last = @heap.pop()
    if @heap.length > 0
      @heap[0] = last
      @sinkDown()
    top
  
  top: () -> return @heap[0]

  size: () -> return @heap.length
  debug: () -> return @heap
