# HTML5 Boids
HTML5 implementation of the [boids model](http://www.red3d.com/cwr/boids/) of coordinated animal motion.

## The model
*Boids* is a computer model of *coordinated animal motion* such as bird flocks and fish schools. The model consists of three simple rules that describe how an individual boid moves based on the positions and velocities of its nearby boids:

1. **Collision avoidance**: point away from the k nearest boids.
2. **Flock centering**: point towards the perceived center of mass of the k nearest boids.
3. **Velocity matching**: update velocity to the average of the k nearest boids.

Note that this implementation is a little different from the [original model](http://www.red3d.com/cwr/boids/), and doesn't aim to recreate the exact same behavior. This aims to be an HTML5 visualization of the model that is configurable and performs well with as many boids as possible. The code is open source and - hopefully - easy to read and tweak.

The original model was developed by [Craig Reynolds](http://www.red3d.com/cwr/index.html).

## Implementation
It's all written in [coffeescript](http://coffeescript.org/), a language that compiles into javascript. To improve performance, I used a kd-tree for answering queries of the type "what are the K nearest points to point P". The kd-tree and the binary heap it requires are also written in coffeescript.

## Tweaking
You can configure the simulation to some extend without touching the code or leaving your browser. Click on the option button to the right and you will be presented with certain configuration options that can significantly alter the boids' behavior. Here's a more detailed explanation of the sliders:

- **Number of boids**: The number of boids on the screen. Decreasing this can improve performance significantly.
- **Simulation speed**: Increasing this value too much will result in decreased accuracy.
- **Acceleration factor**: How fast the boids can accelerate. A high value will make the boids behave more like fish.
- **Flock size**: The number of neighboors boids will consider to calculate the center of mass and flock velocity.
- **Importance factors**: Each of the four rules (three from the model, and an additional rule to keep the boids in the screen) has an associated weight. The higher the weight, the more important the rule is considered.

