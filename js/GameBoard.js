//Author : Mehmet Rasid Gencosmanoglu
//ProjectName : SquareGame


$( "#start-button" ).click(function() {
  $( "#select-size" ).show( "slow" );
});

// Global variables
var button_3x3 = document.getElementById("button-3x3");
var button_4x4 = document.getElementById("button-4x4");
var button_5x5 = document.getElementById("button-5x5");
var button_6x6 = document.getElementById("button-6x6");

var isStarted = false;

var pointCountX = 5;
var pointCountY = 5;

var canvas = document.getElementById("game-canvas");
var canvasWidth;
var canvasHeight;


var ctx = canvas.getContext("2d");

button_3x3.onclick = startGame;
button_4x4.onclick = startGame;
button_5x5.onclick = startGame;
button_6x6.onclick = startGame;


//The size we see on the browser
//These values must be same with Logical canvas.
//Otherwise browser will automatically scale the drawings 
canvas.style.width = '100%';
canvas.style.height = '100%';


//Logical canvas size
if(window.innerWidth>700)
{	
	canvas.width=window.innerWidth/3;	//%33
	canvas.height=window.innerHeight/2;	//%50
}
else
{
	canvas.width = window.innerWidth*3/4;
	canvas.height = window.innerHeight*4/10;
}

//This function draws a matrix
//By default 5x5
//TODO : startGame function must take argument for matrix size
function startGame(){
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    //Gameboard size can be 3x3, 4x4, 5x5, 6x6
    var countX = this.value;
    var countY = this.value;

    //Points are created on the board
    pointDistanceX = canvasWidth/countX;
    pointDistanceY = canvasHeight/countY;	

    //pointX and pointY should start from 5 since 
    //the gameboard has a 5px border
    pointX = pointDistanceX/2;	
    pointY = pointDistanceY/2;

    for (var i = 0; i < countY; i++) {
    	for (var j = 0; j < countX; j++) {
    		
	      drawPointCircle(pointX, pointY, ctx);
    	  pointX = pointX + pointDistanceX;

    	};
    	pointY = pointY + pointDistanceY;
    	pointX = pointDistanceX/2;
    };

	isStarted = true;
	
    
}

// testing Git-hub committing by 0014

//Draws circle
function drawPointCircle(x, y, context){
	context.beginPath();
	context.arc(x, y, 5, 0, Math.PI*2, false);
	context.fillStyle = "#5CB85C";
	context.fill();
	context.closePath();
	
}


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}


//MOUSE DOWN EVENT
//You can see the coordinates on the browser console..
canvas.addEventListener('mousedown', function(evt) {
	var mousePos = getMousePos(canvas, evt);
	var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
	console.log(message);
}, false);
	














