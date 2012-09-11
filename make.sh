#!/bin/sh

haml index.haml > final/index.html
sass style.scss final/style.css
coffee -c boids.coffee
mv boids.js final/boids.js
