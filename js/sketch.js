let threads = [];
let colors = ['#FE93C2', '#3BD89F', '#0045E8', '#FF323B', '#FFC247', '#000000'];


function setup() {
	createCanvas(800, 800);
	for(let i=0; i<33; i++){
		let len = random(0.1, 0.9)*width;
		let x1 = random(width);
		let y1 = random(height);
		let x2 = x1 + (random()<0.5?-1:1)*len;
		let y2 = y1;
		if(random()<0.5){
			x2 = x1;
			y2 = y1 + (random()<0.5?-1:1)*random(0.1, 0.9)*height;
		}
		threads.push(new Thread(x1, y1, x2, y2));
	}

  var canvas = createCanvas(500, 500);
  canvas.parent('abc');
}

function draw() {
	background(255);
	for(let t of threads){
		t.run();
	}
}

function easeInOutQuad(x){
	return x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;
	}

class Thread{
	constructor(x1, y1, x2, y2){
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.t = 0;
		this.init();
		this.balls = [];
		this.col = random(colors);
		this.sw = random(5)*random(random()) + 1;
	}

	show(){
		stroke(this.col);
		strokeWeight(this.sw);
		line(this.x1, this.y1, this.x2, this.y2);
	}

	run(){
		
		if (this.t % this.tt == 0) {
			this.balls.push(new Ball(this.x1, this.y1, this.x2, this.y2));
			this.init();
		}
		for (let b of this.balls) {
			b.show();
			b.move();
		}

		for (let i = 0; i < this.balls.length; i++) {
			if (this.balls[i].isDead) {
				this.balls.splice(i, 1);
			}
		}

		this.show();
		this.t++;
	}

	init(){
		this.tt = int(random(30, 300));
	}
}


class Ball{
	constructor(x1, y1, x2, y2){
		this.p1 = createVector(x1, y1);
		this.p2 = createVector(x2, y2);
		this.p = createVector(x1, y1);
		this.d = 0;
		this.maxD = random(random(0.1))*width;
		this.isDead = false;
		this.dst =  p5.Vector.dist(this.p1, this.p2);
		this.span =  int(random(0.25, 1) * this.dst);
		this.t = 0;
		this.col = random(colors);
		this.ang = atan2(y2 - y1, x2 - x1);
		this.pon = random()<0.5?-1:1;
	}

	show(){
		fill(this.col);
		noStroke();
		circle(this.p.x + this.d * 0.5 * cos(this.ang - HALF_PI * this.pon), 
		this.p.y + this.d * 0.5 *  sin(this.ang - HALF_PI * this.pon), this.d);
	}

	move(){
		let nrm = norm(this.t, 0, this.span);
		this.p = p5.Vector.lerp(this.p1, this.p2, easeInOutQuad(nrm));
		this.d = lerp(0, this.maxD, sin(nrm*PI));
		if(this.t > this.span)this.isDead = true;

		this.t ++;
	}
}