(function() {
  var Boid,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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
    var center, lastRun, loopInterval, options, randomUpTo, time, totalPosition, totalVelocity, tree;

    loopInterval = 20;

    lastRun = null;

    center = null;

    totalPosition = null;

    totalVelocity = null;

    tree = null;

    options = {
      simulationSpeed: 15,
      boidsNumber: 100,
      acceleration: 2,
      perceivedCenterWeight: 10,
      perceivedVelocityWeight: 10,
      collisionAvoidanceWeight: 5,
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

    Boids.prototype.velocitySum = function() {
      var b, sum, _i, _len, _ref;
      sum = new Vector2;
      _ref = this.boids;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        b = _ref[_i];
        sum.add(b.velocity);
      }
      return sum;
    };

    Boids.prototype.positionSum = function() {
      var b, sum, _i, _len, _ref;
      sum = new Vector2;
      _ref = this.boids;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        b = _ref[_i];
        sum.add(b.position);
      }
      return sum;
    };

    Boids.prototype.perceivedFlockVelocity = function(boid) {
      var p, points, pos, sum, _i, _len;
      sum = new Vector2;
      points = tree.nearest({
        x: boid.position.x(),
        y: boid.position.y()
      }, Math.min(this.boids.length, options['flockSize']));
      for (_i = 0, _len = points.length; _i < _len; _i++) {
        p = points[_i];
        pos = new Vector2(p.x, p.y);
        if (!(pos.x() === boid.position.x() && pos.y() === boid.position.y())) {
          sum.add(p.velocity);
        }
      }
      return sum.scalarDivide(points.length - 1);
    };

    Boids.prototype.perceivedCenter = function(boid) {
      var p, points, pos, sum, _i, _len;
      sum = new Vector2;
      points = tree.nearest({
        x: boid.position.x(),
        y: boid.position.y()
      }, Math.min(this.boids.length, options['flockSize']));
      for (_i = 0, _len = points.length; _i < _len; _i++) {
        p = points[_i];
        pos = new Vector2(p.x, p.y);
        if (!(pos.x() === boid.position.x() && pos.y() === boid.position.y())) {
          sum.add(pos);
        }
      }
      return sum.scalarDivide(points.length - 1);
    };

    Boids.prototype.averagePosition = function() {
      var b, sum, _i, _len, _ref;
      sum = new Vector2;
      _ref = this.boids;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        b = _ref[_i];
        sum.add(b.position);
      }
      sum.scalarDivide(this.boids.length);
      return sum;
    };

    Boids.prototype.distance = function(a, b) {
      return Math.sqrt(Math.pow(a.x() - b.x(), 2) + Math.pow(a.y() - b.y(), 2));
    };

    Boids.prototype.avoidCollisions = function(boid) {
      var b, dist, p, points, vel, _i, _len;
      vel = new Vector2;
      points = tree.nearest({
        x: boid.position.x(),
        y: boid.position.y()
      }, Math.min(this.boids.length, options['flockSize']));
      for (_i = 0, _len = points.length; _i < _len; _i++) {
        p = points[_i];
        b = new Vector2(p.x, p.y);
        if (b.x() !== boid.position.x() && b.y() !== boid.position.y()) {
          dist = this.distance(b, boid.position);
          if (dist < options['minCollisionAvoidanceDistance']) {
            vel.substract(this.direction(boid.position, b));
          }
        }
      }
      return vel;
    };

    Boids.prototype.stayInBounds = function(boid, lx, ly, hx, hy, p) {
      var vel;
      if (p == null) p = 2;
      vel = new Vector2;
      if (boid.position.x() < lx) vel.addX(Math.pow(lx - boid.position.x(), p));
      if (boid.position.y() < ly) vel.addY(Math.pow(ly - boid.position.y(), p));
      if (boid.position.x() > hx) vel.addX(-Math.pow(hx - boid.position.x(), p));
      if (boid.position.y() > hy) vel.addY(-Math.pow(hy - boid.position.y(), p));
      return vel;
    };

    Boids.prototype.direction = function(from, to) {
      var goal;
      goal = new Vector2(to.x(), to.y());
      return goal.substract(from);
    };

    Boids.prototype.initialize = function() {
      lastRun = time();
      this.boids = [];
      return this.setBoidsCount(options['boidsNumber']);
    };

    Boids.prototype.setBoidsCount = function(number) {
      var _results;
      if (number === this.boids.length) return;
      if (number > this.boids.length) {
        while (number !== this.boids.length) {
          this.boids.push(new Boid(randomUpTo(this.renderer.width()), randomUpTo(this.renderer.height())));
        }
      }
      if (number < this.boids.length) {
        _results = [];
        while (number !== this.boids.length) {
          _results.push(this.boids.pop());
        }
        return _results;
      }
    };

    Boids.prototype.update = function(delta) {
      var b, vel, _i, _j, _len, _len2, _ref, _ref2, _results;
      center = this.averagePosition();
      totalPosition = this.positionSum();
      totalVelocity = this.velocitySum();
      tree = new KDTree(this.boids.map(function(b) {
        return {
          x: b.position.x(),
          y: b.position.y(),
          velocity: b.velocity
        };
      }));
      _ref = this.boids;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        b = _ref[_i];
        vel = new Vector2;
        vel.add(this.direction(b.position, this.perceivedCenter(b)).scalarMultiply(options['perceivedCenterWeight']));
        vel.add(this.avoidCollisions(b).scalarMultiply(options['collisionAvoidanceWeight']));
        vel.add(this.perceivedFlockVelocity(b).scalarMultiply(options['perceivedVelocityWeight']));
        vel.add(this.stayInBounds(b, 50, 50, this.renderer.width() - 50, this.renderer.height() - 50, options['stayInBoundsPower']).scalarMultiply(options['stayInBoundsWeight']));
        vel.limit(1);
        b.velocity.add(vel.scalarMultiply(options['acceleration'] / 100));
        b.velocity.limit(1);
      }
      _ref2 = this.boids;
      _results = [];
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        b = _ref2[_j];
        vel = b.velocity.clone();
        vel.scalarMultiply(delta / (20 - options['simulationSpeed'] + 1));
        _results.push(b.position.add(vel));
      }
      return _results;
    };

    Boids.prototype.run = function() {
      var delta;
      delta = time() - lastRun;
      lastRun = time();
      this.setBoidsCount(options['boidsNumber']);
      this.update(delta);
      return this.renderer.render(this.boids, center);
    };

    function Boids(render_class) {
      this.run = __bind(this.run, this);      console.log("Initializing");
      this.boids = [];
      this.renderer = render_class;
      this.status = "stopped";
    }

    Boids.prototype.start = function() {
      if (this.status === "paused") lastRun = time();
      if (this.status === "stopped") this.initialize();
      this.intervalHandle = setInterval(this.run, loopInterval);
      return this.status = "running";
    };

    Boids.prototype.pause = function() {
      window.clearInterval(this.intervalHandle);
      return this.status = "paused";
    };

    Boids.prototype.stop = function() {
      window.clearInterval(this.intervalHandle);
      this.renderer.clearScreen();
      return this.status = "stopped";
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
