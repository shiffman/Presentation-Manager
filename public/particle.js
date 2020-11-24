// Daniel Shiffman
// http://codingtra.in
// https://youtu.be/CKeyIbT3vXI

class Particle {
  constructor(x, y, hu, firework) {
    this.pos = createVector(x, y);
    this.firework = firework;
    this.lifespan = 255;
    this.hu = hu;
    this.acc = createVector(0, 0);
    if (this.firework) {
      this.vel = createVector(0, random(-16, -4));
      this.vel.mult(1.5);
    } else {
      // this.vel = p5.Vector.random2D();
      // this.vel.mult(random(2, 10));
      const a = random(TWO_PI);
      const r = height / 40;
      const x = r * 16 * pow(sin(a), 3);
      const y =
        -r * (13 * cos(a) - 5 * cos(2 * a) - 2 * cos(3 * a) - cos(4 * a));
      this.vel = createVector(x, y);
      this.vel.mult(random(0.06, 0.07));
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    if (!this.firework) {
      this.vel.mult(0.9);
      this.lifespan -= 4;
    }
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  done() {
    if (this.lifespan < 0) {
      return true;
    } else {
      return false;
    }
  }

  show() {
    if (!this.firework) {
      strokeWeight(24);
      stroke(this.hu);
    } else {
      strokeWeight(24);
      stroke(this.hu);
    }

    point(this.pos.x, this.pos.y);
  }
}
