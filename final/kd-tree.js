(function() {

  window.KDTree = (function() {
    var Node, best, buildTree, dimensions, distance2, distanceMetric, distanceReal, k, metric, nearestSearch, save;

    Node = (function() {

      function Node(obj) {
        this.obj = obj;
        this.left = null;
        this.right = null;
      }

      return Node;

    })();

    dimensions = [];

    k = 0;

    metric = void 0;

    distance2 = function(a, b) {
      return Math.pow(a.x - b.x) + Math.pow(a.y - b.y);
    };

    distanceMetric = function(a, b) {
      var d, sum, _i, _len;
      sum = 0;
      for (_i = 0, _len = dimensions.length; _i < _len; _i++) {
        d = dimensions[_i];
        sum += Math.pow(a[d] - b[d], 2);
      }
      return sum;
    };

    distanceReal = function(a, b) {
      return Math.sqrt(distanceMetric(a, b));
    };

    buildTree = function(points, depth) {};

    best = null;

    save = function(node, query, n) {
      var x;
      x = node.obj;
      if (best.size() >= n) {
        if (distanceMetric(x, query) > distanceMetric(best.top(), query)) return;
      }
      best.push(x);
      if (best.size() > n) return best.pop();
    };

    nearestSearch = function(cur, query, n, depth) {
      var bestChild, d, minDist, otherChild, worstOfBest;
      if (depth == null) depth = 0;
      if (cur.left === null && cur.right === null) {
        save(cur, query, n);
        return;
      }
      bestChild = null;
      otherChild = null;
      d = dimensions[depth % k];
      if (cur.left !== null && (cur.right === null || query[d] < cur.obj[d])) {
        bestChild = cur.left;
        otherChild = cur.right;
      } else {
        bestChild = cur.right;
        otherChild = cur.left;
      }
      nearestSearch(bestChild, query, n, depth + 1);
      save(cur, query, n);
      minDist = Math.abs(query[d] - cur.obj[d]);
      worstOfBest = distanceReal(best.top(), query);
      if (otherChild !== null && (minDist < worstOfBest || best.size() < n)) {
        return nearestSearch(otherChild, query, n, depth + 1);
      }
    };

    function KDTree(p, d, m) {
      var point, points, _i, _len;
      if (p == null) p = [];
      if (d == null) d = ["x", "y"];
      if (m == null) m = distance2;
      points = p;
      dimensions = d;
      m = m;
      this.root = null;
      k = dimensions.length;
      for (_i = 0, _len = points.length; _i < _len; _i++) {
        point = points[_i];
        this.add(point);
      }
    }

    KDTree.prototype.nearest = function(query, n) {
      var arr;
      if (n == null) n = 1;
      best = new Heap(function(x) {
        var d, sum, _i, _len;
        sum = 0;
        for (_i = 0, _len = dimensions.length; _i < _len; _i++) {
          d = dimensions[_i];
          sum += Math.pow(query[d] - x[d], 2);
        }
        return sum;
      });
      nearestSearch(this.root, query, n);
      arr = [];
      while (best.size() !== 0) {
        arr.push(best.pop());
      }
      return arr;
    };

    KDTree.prototype.add = function(point) {
      var cur, d, depth, parent;
      cur = this.root;
      parent = null;
      depth = 0;
      while (cur !== null) {
        parent = cur;
        d = dimensions[depth % k];
        if (point[d] < cur.obj[d]) {
          cur = cur.left;
        } else {
          cur = cur.right;
        }
        depth += 1;
      }
      depth -= 1;
      d = dimensions[depth % k];
      cur = new Node(point);
      if (parent === null) {
        this.root = cur;
      } else {
        if (point[d] < parent.obj[d]) {
          parent.left = cur;
        } else {
          parent.right = cur;
        }
      }
      return this.root;
    };

    return KDTree;

  })();

}).call(this);
