(function() {

  this.Boids2DRenderer = (function() {
    var canvas, ctx, getContext, options;

    canvas = null;

    ctx = null;

    options = {
      showVelocityVectors: true,
      showAveragePosition: false
    };

    getContext = function() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      return ctx = canvas.getContext('2d');
    };

    function Boids2DRenderer(el) {
      canvas = el;
      getContext();
    }

    Boids2DRenderer.prototype.clearScreen = function() {
      return ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    Boids2DRenderer.prototype.render = function(boids, center) {
      var b, _i, _len;
      ctx.fillStyle = "black";
      this.clearScreen();
      for (_i = 0, _len = boids.length; _i < _len; _i++) {
        b = boids[_i];
        ctx.beginPath();
        ctx.arc(b.position.x(), b.position.y(), 3, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        if (options['showVelocityVectors']) {
          ctx.beginPath();
          ctx.moveTo(b.position.x(), b.position.y());
          ctx.lineTo(b.position.x() - b.velocity.x() * 10, b.position.y() - b.velocity.y() * 10);
          ctx.stroke();
          ctx.closePath();
        }
      }
      if (options['showAveragePosition']) {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(center.x(), center.y(), 3, 0, Math.PI * 2, true);
        ctx.stroke();
        return ctx.fill();
      }
    };

    Boids2DRenderer.prototype.width = function() {
      return canvas.width;
    };

    Boids2DRenderer.prototype.height = function() {
      return canvas.height;
    };

    Boids2DRenderer.prototype.handleResize = function() {
      return getContext();
    };

    Boids2DRenderer.prototype.get = function(option) {
      return options[option];
    };

    Boids2DRenderer.prototype.set = function(option, value) {
      console.log("" + option + " = " + value);
      return options[option] = value;
    };

    return Boids2DRenderer;

  })();

}).call(this);
