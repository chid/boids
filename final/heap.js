(function() {

  window.Heap = (function() {
    var leftChildIndex, metric, parentIndex, rightChildIndex;

    metric = function(x) {
      return x;
    };

    parentIndex = function(x) {
      return Math.floor(((x + 1) / 2) - 1);
    };

    leftChildIndex = function(x) {
      return Math.floor(2 * x + 1);
    };

    rightChildIndex = function(x) {
      return Math.floor(2 * x + 2);
    };

    Heap.prototype.bubbleUp = function(pos) {
      var element, parent, parentPosition, _results;
      if (pos === void 0) pos = this.heap.length - 1;
      _results = [];
      while (pos !== 0) {
        element = this.heap[pos];
        parentPosition = parentIndex(pos);
        parent = this.heap[parentPosition];
        if (metric(parent) < metric(element)) {
          this.heap[parentPosition] = element;
          this.heap[pos] = parent;
          _results.push(pos = parentPosition);
        } else {
          break;
        }
      }
      return _results;
    };

    Heap.prototype.sinkDown = function(pos) {
      var element, leftChildPosition, rightChildPosition, swapPosition, _results;
      if (pos == null) pos = 0;
      _results = [];
      while (pos !== this.heap.length - 1) {
        element = this.heap[pos];
        leftChildPosition = leftChildIndex(pos);
        rightChildPosition = rightChildIndex(pos);
        swapPosition = null;
        if (leftChildPosition <= (this.heap.length - 1) && metric(this.heap[leftChildPosition]) > metric(element)) {
          swapPosition = leftChildPosition;
        }
        if (rightChildPosition <= (this.heap.length - 1) && metric(this.heap[rightChildPosition]) > metric(element)) {
          if (swapPosition === null || metric(this.heap[rightChildPosition]) > metric(this.heap[leftChildPosition])) {
            swapPosition = rightChildPosition;
          }
        }
        if (swapPosition !== null) {
          this.heap[pos] = this.heap[swapPosition];
          this.heap[swapPosition] = element;
          _results.push(pos = swapPosition);
        } else {
          break;
        }
      }
      return _results;
    };

    function Heap(func) {
      if (func == null) {
        func = function(x) {
          return x;
        };
      }
      metric = func;
      this.heap = [];
    }

    Heap.prototype.push = function(x) {
      x.v = metric(x);
      this.heap.push(x);
      return this.bubbleUp();
    };

    Heap.prototype.pop = function() {
      var last, top;
      if (this.heap.length === 0) return null;
      top = this.heap[0];
      last = this.heap.pop();
      if (this.heap.length > 0) {
        this.heap[0] = last;
        this.sinkDown();
      }
      return top;
    };

    Heap.prototype.top = function() {
      return this.heap[0];
    };

    Heap.prototype.size = function() {
      return this.heap.length;
    };

    Heap.prototype.debug = function() {
      return this.heap;
    };

    return Heap;

  })();

}).call(this);
