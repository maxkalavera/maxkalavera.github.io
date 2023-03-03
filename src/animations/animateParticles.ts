import getBackgroundCanvas from "src/utils/animations/getBackgroundCanvas"
import throttle from "src/utils/throttle"
import Loop from "src/utils/animations/Loop"

import {Coordinate} from "src/animations/animateParticles.d";

class Vector {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  static fromCoordinate(value: Coordinate) {
    return new Vector(value.x, value.y);
  }
  static addition(...args: Vector[]) {
    return new Vector(
      args.reduce((accumulator, vector) => accumulator + vector.x, 0),
      args.reduce((accumulator, vector) => accumulator + vector.y, 0)
    );
  }
  normalize() {
    const max = Math.abs(Math.max(this.x, this.y));
    if (max === 0) {
      return new Vector(0, 0);
    } else {
      return new Vector(this.x / max, this.y / max);
    }
  }
}

class Target {
  position: Coordinate;
  constructor(x: number, y: number) {
    this.position = {x, y};
  }
  calculateDirectionVector(originPosition: Coordinate) {
    const targetPosition = this.position;
    return new Vector(
      targetPosition.x - originPosition.x, 
      targetPosition.y - originPosition.y
    ).normalize();
  }
  calculateVelocityVector(originPosition: Coordinate) {
    const targetPosition = this.position;
    const displacement = new Vector(
      targetPosition.x - originPosition.x, 
      targetPosition.y - originPosition.y
    );
    const speed = new Vector(5.0, 5.0);
    if (Math.abs(displacement.x) < speed.x) {
      speed.x = Math.abs(displacement.x);
    }
    if (Math.abs(displacement.y) < speed.y) {
      speed.y = Math.abs(displacement.y);
    }
    const directionVector = displacement.normalize();
    const velocityVector = new Vector(
      Math.floor(directionVector.x * speed.x),
      Math.floor(directionVector.y * speed.y),
    );
    return velocityVector;
  }
  hasReached(originPosition: Coordinate) {
    const targetPosition = this.position;
    const displacement = new Vector(
      targetPosition.x - originPosition.x, 
      targetPosition.y - originPosition.y
    );
    return displacement.x === 0.0 && displacement.y === 0.0;
  }
}

class Particle {
  position: Coordinate;
  targets: Target[]
  velocityVectors: Vector[];
  boundingRect: DOMRect;

  constructor(x: number, y: number, boundingRect: DOMRect) {
    this.position = {x, y};
    this.targets = [];
    this.velocityVectors = [];
    this.boundingRect = boundingRect;
  }
  addTarget(x: number, y: number) {
    this.targets.push(new Target(x, y));
  }
  addVelocityVector(vector: Vector) {
    this.velocityVectors.push(vector);
  }
  step() {
    const velocityVectors = this.targets
      .map((target) => target.calculateVelocityVector(this.position))
      .concat(this.velocityVectors);
    const sumVelocityVector = Vector.addition(...velocityVectors);
    this.position.x += sumVelocityVector.x;
    this.position.y += sumVelocityVector.y;
    if (this.position.x < this.boundingRect.left) this.position.x = this.boundingRect.left;
    if (this.position.x > this.boundingRect.right) this.position.x = this.boundingRect.right;
    if (this.position.y < this.boundingRect.top) this.position.y = this.boundingRect.top;
    if (this.position.y > this.boundingRect.bottom) this.position.y = this.boundingRect.bottom;
    this.targets = this.targets.filter((target) => !target.hasReached(this.position));
  }
}

class Particles {
  canvas: HTMLCanvasElement;
  particlesRadio: number = 3;
  numberOfParticles: number = 1;
  gravityVector!: Vector;
  particles: Particle[];
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.particles = [];
    this.setCanvasSize();
    this.generateParticles();
  }
  setCanvasSize() {
    if (this.canvas === null || this.canvas.parentElement === null) return;
    this.canvas.width = this.canvas.parentElement.offsetWidth || 0;
    this.canvas.height = this.canvas.parentElement.offsetHeight || 0;
  }
  generateParticles() {
    this.particles = Array(this.numberOfParticles)
      .fill(undefined).map(() => new Particle(
        Math.floor(Math.random() * this.canvas.width), 
        Math.floor(Math.random() * this.canvas.height),
        this.canvas.getBoundingClientRect()
      ));

    this.particles.forEach((item) => {
      item.addTarget(
        Math.floor(this.canvas.width / 2),
        Math.floor(this.canvas.height / 2)
      );
      item.addVelocityVector(new Vector(0.0, 5.0));
    });
  }
  drawParticles() {
    const context = this.canvas.getContext("2d");
    if (context === null) return;

    this.particles.forEach((item) => {
      context.beginPath();
      context.fillStyle = '#FFFFFFA0';
      context.arc(item.position.x, item.position.y, this.particlesRadio, 0, 2 * Math.PI);
      context.fill();
      context.closePath();
    });
  }
  clearCanvas() {
    const context = this.canvas.getContext("2d")
    if (context === null) return
    context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
  render() {
    this.clearCanvas();
    this.drawParticles();
  };
  step() {
    this.particles.forEach((item) => {
      item.step();
    });
    this.render();
  }
}

export default function animateHexagonGrid() {
  const canvas = getBackgroundCanvas()
  const particles = new Particles(canvas);

  return new Loop()
    .addCallback(() => {
      particles.step();
    })
}