var beat;
// var fft;
// var amp;
var mgr;

function preload(){
	beat = loadSound("Lindsey_Stirling_-_Crystallize.mp3");
}

function setup(){
    createCanvas(windowWidth, windowHeight);
		beat.play();

    mgr = new SceneManager();
    
    mgr.addScene (Vascular);
    mgr.addScene (Nothing);
    mgr.showNextScene();
}

function draw(){
    mgr.draw();
}

function mousePressed(){
    mgr.mousePressed();
}