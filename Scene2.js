//help from https://www.youtube.com/watch?v=BjoM9oKOAKY --> Coding train

var amp;
var fft;
var beat;
var inc = 0.05; //assign an incrmnt. value
var scl = 10;
var cols, rows; //builds a grid
var zoff = 0; //to make it 3D
var particles =[]; //we made a particle array
var flowfield; //we will make a flowing effect on the canvas

// function preload(){
// 		beat = loadSound("Lindsey_Stirling_-_Crystallize.mp3");
// }

function Vascular(){

this.setup= function(){
	angleMode(DEGREES);
	fft = new p5.FFT();
	fft.setInput(beat);
	amp = new p5.Amplitude();
	//beat.play();
	cols = floor(width/scl); //floor is to get rid of the decimal plc
	rows = floor(height/scl);
	
	flowfield = new Array(cols*rows); //builds the flowfield
	
	for (var i =0; i<5200; i++){
	particles[i] = new Particles();
	
	}
	//background(255);

}
this.enter = function(){
	background(255);
}
this.draw = function(){	
		// background(255);

	var vol = amp.getLevel(); //sketch is connected to the vol variable, so I am using it several times, below
	var spectrum = fft.analyze();
	
	var yoff = 0;
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      var index = x + y * cols;
      var angle = noise(xoff, yoff, zoff) * TWO_PI*5; //This pi and 5 adjusts the look of the flow. I checked with different values
      var v = p5.Vector.fromAngle(angle);
			v.setMag(5); //because the particles moves so fast, we set the magnitude value of the vector, but it is not enough, so we need to limit the speed
			flowfield[index] = v; //refers to a particular vector. remember! we've created vectors on the previous line and all the vectors are now stored in the flowfield array
			xoff += inc;
			
		}
		yoff += inc;
		zoff += 0.0002;
	}
	
	for (var i=0; i<particles.length; i++){
	particles[i].follow(flowfield); //each particle will find the appropriate vector in the array. remember! we've stored the vectors in the flowfield array. and we have to build a function under the particles to follow the vectors
	particles[i].update();
	particles[i].edges();
	particles[i].show();
	}
		
	translate(width/2, height/2);
   beginShape();
   for (var i = 0; i<360; i++) {
		//var h = -height + map(spectrum[i], 0, 255, height, 0);
		var r =map(sin(i), 0, spectrum.length *0.75 , 100, 0);
		var x = r * cos(i);
		var y = r*sin(i);
		rotate(radians(frameCount*(-0.2)));
		//rotate(frameCount*(sin(r)/10));
  	stroke(random(255), random(255), random(255), 23);
		strokeWeight(1);
    rect(x, y, width/(vol*spectrum.length*4), spectrum[i]/(vol*6));
	 }

	
	endShape();
}
this.mousePressed = function(){
        this.sceneManager.showNextScene();
    }
}

function Particles(){ //building particle system by vectors
	
	var vol = amp.getLevel();
	this.pos = createVector(random(width),random(height)); //position of the particles, assigned random
	this.vel = createVector(0,0); // gives the particle a velocity value
	this.acc = createVector(0,0); //acceleration of the vector
	this.maxspeed = vol*7;
	
	this.update = function(){ //update to get to the next acc, vel, and pos
		var vol = amp.getLevel();
		this.acc.add(vol); //vol is added into acc to get the vol effect in the speed of the particles
		this.vel.add(this.acc); //velocity needs acc, so gets added to acc --> a=v/t, F = ma
		this.pos.add(this.vel);	//position gets added to velocity
		this.acc.mult(0);  //resetting the acc to be back 
		this.vel.limit(this.maxspeed); //now, the particles will not move so crazy
	}
	
	this.follow = function(vectors){
		var x = floor(this.pos.x/scl); //we scaled the position of the particle to a grid of cols and rows
		var y = floor(this.pos.y/scl); //and looked up the vector in that 1D array and applied it as a force to move the particle
		var index = x +y*cols; // 2D value into a 1D array
		var force = vectors[index];
		this.applyForce(force); //force to move the vectors
	}
	
	this.applyForce = function(force) {
		this.acc.add(force);		
	}
	
	this.show = function(){ //draws the particles
		var vol = amp.getLevel(); //we need it here
		var size = map(vol, 0, 1, 0, 1.5);
		
		stroke(random(255), random(255), random(255), 5);
		strokeWeight(3.4);
		//fill(random(255), random(255), random(255), 6);
		//line(this.pos.x, this.pos.y, vol*5, vol*5); //will be back to its prev.pos. but looks like drawing lines only
		ellipse(this.pos.x, this.pos.y, sin(size), sin(size)); //we will add the vector as a force to the nearest ellipse(particle) to create the flowfield
		//fill(255, 0, 255, 70);
		ellipse(this.pos.x+vol, this.pos.y+vol, size/3, size/3);
	}	
		
	this.edges = function(){ //to keep the particles between the edges on the canvas
		if(this.pos.x>width) {			
		this.pos.x=0;
		}
		if(this.pos.x<0) {
			this.pos.x=width;		
		}
		if(this.pos.y<0) {
			this.pos.y=height;
		}
		if(this.pos.y>height) {
			this.pos.y=0;
		}
	}
}