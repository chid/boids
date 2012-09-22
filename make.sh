#!/bin/sh

haml index.haml > final/index.html
sass style.scss final/style.css

coffee -c app.coffee
coffee -c heap.coffee
coffee -c kd-tree.coffee
coffee -c vector2.coffee
coffee -c boids2d_renderer.coffee
coffee -c boids.coffee

mv app.js final/app.js
mv heap.js final/heap.js
mv kd-tree.js final/kd-tree.js
mv vector2.js final/vector2.js
mv boids2d_renderer.js final/boids2d_renderer.js
mv boids.js final/boids.js
