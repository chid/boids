(function() {

  this.Boids2DRenderer = (function() {
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
        ctx.beginPath();
        ctx.moveTo(b.position.x(), b.position.y());
        ctx.lineTo(b.position.x() - b.velocity.x() * 10, b.position.y() - b.velocity.y() * 10);
        ctx.stroke();
        ctx.closePath();
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
