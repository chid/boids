(function() {
  var Boid;

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

  this.Boids = (function() {
    var averagePosition, avoidCollisions, boids, center, direction, distance, initialize, intervalHandle, lastRun, loopInterval, options, perceivedCenter, perceivedFlockVelocity, positionSum, randomUpTo, renderer, run, status, stayInBounds, time, totalPosition, totalVelocity, tree, update, velocitySum;

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

    options = {
      simulationSpeed: 5,
      boidsNumber: 50,
      acceleration: 4,
      perceivedCenterWeight: 1,
      perceivedVelocityWeight: 10,
      collisionAvoidanceWeight: 1,
      stayInBoundsWeight: 8,
      flockSize: 10,
      minCollisionAvoidanceDistance: 50,
      stayInBoundsPower: 2
    };

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
      var b, dist, p, points, vel, _i, _len;
      vel = new Vector2;
      points = tree.nearest({
        x: boid.position.x(),
        y: boid.position.y()
      }, options['flockSize']);
      for (_i = 0, _len = points.length; _i < _len; _i++) {
        p = points[_i];
        b = new Vector2(p[0].x, p[0].y);
        if (b.x() !== boid.position.x() && b.y() !== boid.position.y()) {
          dist = distance(b, boid.position);
          if (dist < options['minCollisionAvoidanceDistance']) {
            vel.substract(direction(boid.position, b));
          }
        }
      }
      return vel;
    };

    stayInBounds = function(boid, lx, ly, hx, hy, p) {
      var vel;
      if (p == null) p = 2;
      vel = new Vector2;
      if (boid.position.x() < lx) vel.addX(Math.pow(lx - boid.position.x(), p));
      if (boid.position.y() < ly) vel.addY(Math.pow(ly - boid.position.y(), p));
      if (boid.position.x() > hx) vel.addX(-Math.pow(hx - boid.position.x(), p));
      if (boid.position.y() > hy) vel.addY(-Math.pow(hy - boid.position.y(), p));
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
      boids = [];
      _results = [];
      for (_i = 1; _i <= 50; _i++) {
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
        vel.add(direction(b.position, perceivedCenter(b)).scalarMultiply(options['perceivedCenterWeight']));
        vel.add(avoidCollisions(b).scalarMultiply(options['collisionAvoidanceWeight']));
        vel.add(perceivedFlockVelocity(b).scalarMultiply(options['perceivedVelocityWeight']));
        vel.add(stayInBounds(b, 50, 50, renderer.width() - 50, renderer.height() - 50, options['stayInBoundsPower']).scalarMultiply(options['stayInBoundsWeight']));
        vel.limit(1);
        b.velocity.add(vel.scalarMultiply(options['acceleration'] / 100));
        b.velocity.limit(1);
      }
      _results = [];
      for (_j = 0, _len2 = boids.length; _j < _len2; _j++) {
        b = boids[_j];
        vel = b.velocity.clone();
        vel.scalarMultiply(delta / (10 - options['simulationSpeed'] + 1));
        _results.push(b.position.add(vel));
      }
      return _results;
    };

    run = function() {
      var delta;
      delta = time() - lastRun;
      lastRun = time();
      update(delta);
      return renderer.render(boids, center);
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
      window.clearInterval(intervalHandle);
      return status = "paused";
    };

    Boids.prototype.stop = function() {
      window.clearInterval(intervalHandle);
      renderer.clearScreen();
      return status = "stopped";
    };

    Boids.prototype.get = function(option) {
      return options[option];
    };

    Boids.prototype.set = function(option, value) {
      return options[option] = value;
    };

    return Boids;

  })();

}).call(this);
