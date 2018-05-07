var beat;
var fft;
var amp;

// function preload(){
// 	beat = loadSound("Lindsey_Stirling_-_Crystallize.mp3");
// }

function Nothing(){

this.setup = function() {
	//createCanvas(windowWidth, windowHeight);
	angleMode(DEGREES);
	fft = new p5.FFT();
	fft.setInput(beat);
	amp = new p5.Amplitude();
	// beat.play();
	
}

this.draw = function() {
	background(0);
	var spectrum = fft.analyze();
	var vol = amp.getLevel();
	
	translate(width/2, height/2);
   beginShape();
   for (i = 0; i<360; i++) {
		var r =map(sin(i), 0, spectrum.length *0.75 , 100, 0);
		var x = r * cos(i);
		var y = r*sin(i);
		rotate(radians(frameCount*0.5));
  	stroke(109,109,109);
		 strokeWeight(0.3);
    rect(x, y, width/spectrum.length, spectrum.length);
		 
	 }
		
	for ( k = 0; k<360; k++){
 		 var p =map(sin(k), 0, spectrum.length *0.75 , 60, 0);
		 var x3 = p * cos(k);
		 var y3 = p *sin(k);
 		rotate(radians(frameCount*(-0.6)));
  	stroke(214,22,55,60);
     rect(x3, y3, width/spectrum.length, spectrum.length);
	}
	
   endShape();
}
this.mousePressed = function(){
        this.sceneManager.showNextScene();
    }
}