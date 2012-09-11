(function() {
  var Boid, Boids, Boids2DRenderer, Vector2;

  $(document).ready(function() {
    window.boids = new Boids(new Boids2DRenderer($("canvas")[0]));
    return window.boids.start();
  });

  Vector2 = (function() {
    var dimensions;

    dimensions = 2;

    function Vector2(a, b) {
      if (a === void 0) a = 0;
      if (b === void 0) b = 0;
      this.d = [0, 0];
      this.d[0] = a;
      this.d[1] = b;
    }

    Vector2.prototype.add = function(otherVector) {
      var i;
      for (i = 0; 0 <= dimensions ? i < dimensions : i > dimensions; 0 <= dimensions ? i++ : i--) {
        this.d[i] += otherVector.d[i];
      }
      return this;
    };

    Vector2.prototype.substract = function(otherVector) {
      var i;
      for (i = 0; 0 <= dimensions ? i < dimensions : i > dimensions; 0 <= dimensions ? i++ : i--) {
        this.d[i] -= otherVector.d[i];
      }
      return this;
    };

    Vector2.prototype.scalarDivide = function(scalar) {
      var i;
      for (i = 0; 0 <= dimensions ? i < dimensions : i > dimensions; 0 <= dimensions ? i++ : i--) {
        this.d[i] = this.d[i] / scalar;
      }
      return this;
    };

    Vector2.prototype.scalarMultiply = function(scalar) {
      var i;
      for (i = 0; 0 <= dimensions ? i < dimensions : i > dimensions; 0 <= dimensions ? i++ : i--) {
        this.d[i] = this.d[i] * scalar;
      }
      return this;
    };

    Vector2.prototype.limit = function(l) {
      var i, max;
      max = 0;
      for (i = 0; 0 <= dimensions ? i < dimensions : i > dimensions; 0 <= dimensions ? i++ : i--) {
        max = Math.max(max, Math.abs(this.d[i]));
      }
      if (max > l) this.scalarMultiply(l / max);
      return this;
    };

    Vector2.prototype.addX = function(value) {
      this.d[0] += value;
      return this;
    };

    Vector2.prototype.addY = function(value) {
      this.d[0] += value;
      return this;
    };

    Vector2.prototype.x = function() {
      return this.d[0];
    };

    Vector2.prototype.y = function() {
      return this.d[1];
    };

    Vector2.prototype.toString = function() {
      return "(" + this.d[0] + ", " + this.d[1] + ")";
    };

    Vector2.prototype.clone = function() {
      return new Vector2(this.x(), this.y());
    };

    return Vector2;

  })();

  Boid = (function() {

    function Boid(x, y) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      this.position = new Vector2(x, y);
      this.velocity = new Vector2(0, 0);
    }

    return Boid;

  })();

  window.dist = function(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  };

  Boids = (function() {
    var averagePosition, avoidCollisions, boids, center, direction, distance, initialize, intervalHandle, lastRun, loopInterval, perceivedCenter, perceivedFlockVelocity, positionSum, randomUpTo, renderer, run, status, stayInBounds, time, totalPosition, totalVelocity, tree, update, velocitySum;

    status = null;

    loopInterval = 20;

    intervalHandle = null;

    renderer = null;

    boids = [];

    lastRun = null;

    center = null;

    totalPosition = null;

    totalVelocity = null;

    tree = null;

    randomUpTo = function(limit) {
      return Math.floor(Math.random() * limit) + 1;
    };

    time = function() {
      return new Date().getTime();
    };

    velocitySum = function() {
      var b, sum, _i, _len;
      sum = new Vector2;
      for (_i = 0, _len = boids.length; _i < _len; _i++) {
        b = boids[_i];
        sum.add(b.velocity);
      }
      return sum;
    };

    positionSum = function() {
      var b, sum, _i, _len;
      sum = new Vector2;
      for (_i = 0, _len = boids.length; _i < _len; _i++) {
        b = boids[_i];
        sum.add(b.position);
      }
      return sum;
    };

    perceivedFlockVelocity = function(boid) {
      var sum;
      sum = totalVelocity.clone();
      sum.substract(boid.velocity);
      return sum.scalarDivide(boids.length - 1);
    };

    perceivedCenter = function(boid) {
      var sum;
      sum = totalPosition.clone();
      sum.substract(boid.position);
      return sum.scalarDivide(boids.length - 1);
    };

    averagePosition = function() {
      var b, sum, _i, _len;
      sum = new Vector2;
      for (_i = 0, _len = boids.length; _i < _len; _i++) {
        b = boids[_i];
        sum.add(b.position);
      }
      sum.scalarDivide(boids.length);
      return sum;
    };

    distance = function(a, b) {
      return Math.sqrt(Math.pow(a.x() - b.x(), 2) + Math.pow(a.y() - b.y(), 2));
    };

    avoidCollisions = function(boid) {
      var b, p, points, vel, _i, _len;
      vel = new Vector2;
      points = tree.nearest({
        x: boid.position.x(),
        y: boid.position.y()
      }, 5);
      for (_i = 0, _len = points.length; _i < _len; _i++) {
        p = points[_i];
        b = new Vector2(p.x, p.y);
        if (b.x() !== boid.position.x() && b.y() !== boid.position.y()) {
          if (distance(b, boid.position) < 20) {
            console.log("Moving away");
            vel.substract(direction(boid.position, b));
          }
        }
      }
      return vel;
    };

    stayInBounds = function(boid, width, height) {
      var vel;
      vel = new Vector2;
      if (boid.position.x() <= 0) vel.addX(Math.pow(boid.position.x(), 10));
      if (boid.position.y() <= 0) vel.addY(Math.pow(boid.position.y(), 10));
      if (boid.position.x() > width) {
        vel.addX(-Math.pow(boid.position.x() - width, 10));
      }
      if (boid.position.y() > height) {
        vel.addY(-Math.pow(boid.position.y() - width, 10));
      }
      return vel;
    };

    direction = function(from, to) {
      var goal;
      goal = new Vector2(to.x(), to.y());
      return goal.substract(from);
    };

    initialize = function() {
      var _i, _results;
      lastRun = time();
      _results = [];
      for (_i = 1; _i <= 1000; _i++) {
        _results.push(boids.push(new Boid(randomUpTo(renderer.width()), randomUpTo(renderer.height()))));
      }
      return _results;
    };

    update = function(delta) {
      var b, vel, _i, _j, _len, _len2, _results;
      center = averagePosition();
      totalPosition = positionSum();
      totalVelocity = velocitySum();
      tree = new kdTree(boids.map(function(b) {
        return {
          x: b.position.x(),
          y: b.position.y()
        };
      }), window.dist, ["x", "y"]);
      for (_i = 0, _len = boids.length; _i < _len; _i++) {
        b = boids[_i];
        vel = new Vector2;
        vel.add(direction(b.position, perceivedCenter(b)).scalarDivide(1000));
        vel.add(avoidCollisions(b).scalarDivide(100));
        vel.add(perceivedFlockVelocity(b));
        vel.add(stayInBounds(b, renderer.width(), renderer.height()).scalarMultiply(5000000));
        vel.limit(0.2);
        b.velocity.add(vel);
        b.velocity.limit(0.2);
      }
      _results = [];
      for (_j = 0, _len2 = boids.length; _j < _len2; _j++) {
        b = boids[_j];
        vel = b.velocity.clone();
        vel.scalarMultiply(delta);
        _results.push(b.position.add(vel));
      }
      return _results;
    };

    run = function() {
      var delta;
      delta = time() - lastRun;
      lastRun = time();
      update(delta);
      return renderer.render(boids.map(function(b) {
        return b.position;
      }), center);
    };

    function Boids(render_class) {
      console.log("Initializing");
      renderer = render_class;
      status = "stopped";
    }

    Boids.prototype.start = function() {
      console.log("Starting from status " + status);
      intervalHandle = setInterval(run, loopInterval);
      if (status === "stopped") initialize();
      return status = "running";
    };

    Boids.prototype.pause = function() {
      console.log("Pausing");
      window.clearInterval(intervalHandle);
      return status = "paused";
    };

    Boids.prototype.stop = function() {
      return console.log("Stopping");
    };

    return Boids;

  })();

  Boids2DRenderer = (function() {
    var canvas, ctx;

    canvas = null;

    ctx = null;

    function Boids2DRenderer(el) {
      var radius;
      canvas = el;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx = canvas.getContext('2d');
      radius = 3;
      console.log("Running render at " + canvas.width + "x" + canvas.height);
    }

    Boids2DRenderer.prototype.render = function(boids, center) {
      var b, _i, _len;
      ctx.fillStyle = "black";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (_i = 0, _len = boids.length; _i < _len; _i++) {
        b = boids[_i];
        ctx.beginPath();
        ctx.arc(b.x(), b.y(), 3, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.fill();
      }
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(center.x(), center.y(), 3, 0, Math.PI * 2, true);
      ctx.stroke();
      return ctx.fill();
    };

    Boids2DRenderer.prototype.width = function() {
      return canvas.width;
    };

    Boids2DRenderer.prototype.height = function() {
      return canvas.height;
    };

    return Boids2DRenderer;

  })();

}).call(this);
