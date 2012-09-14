(function() {

  this.Vector2 = (function() {
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
      this.d[1] += value;
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

}).call(this);
