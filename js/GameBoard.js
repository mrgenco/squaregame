//Author : Mehmet Rasid Gencosmanoglu
//ProjectName : SquareGame



// Global variables
var isStarted = false;

var pointCountX = 5;
var pointCountY = 5;
var canvasWidth;
var canvasHeight;

var buttonStart = document.getElementById("start-button");
buttonStart.onclick = startGame;
// ----------------------------------------
var canvas = document.getElementById("game-canvas");

//Logical canvas size
canvas.width=400;
canvas.height=300;

//The size we see on the browser
//These values must be same with Logical canvas.
//Otherwise browser will automatically scale the drawings 
canvas.style.width=400;
canvas.style.width=300;


var ctx = canvas.getContext("2d");

//This function draws a matrix
//By default 5x5
//TODO : startGame function must take argument for matrix size
function startGame(){

	if(isStarted)
	{
		alert("Game is already started!");
	}
	else
	{

	    canvasWidth = canvas.width;
	    canvasHeight = canvas.height;

	    
	    var countX = pointCountX;
	    var countY = pointCountY;

	    //Points are created on the board
	    pointDistanceX = canvasWidth/countX;
	    pointDistanceY = canvasHeight/countY;	

	    //pointX and pointY should start from 5 since 
	    //the gameboard has a 5px border
	    pointX = 5;	
	    pointY = 5;

	    for (var i = 0; i < countY; i++) {
	    	for (var j = 0; j < countX; j++) {
	    		
    	      drawPointCircle(pointX, pointY, ctx);
	    	  pointX = pointX + pointDistanceX;

	    	};
	    	pointY = pointY + pointDistanceY;
	    	pointX = 5;
	    };

		isStarted = true;
	} 
    
}

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

//You can see the coordinates on the browser console..
canvas.addEventListener('mousedown', function(evt) {
	var mousePos = getMousePos(canvas, evt);
	var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
	console.log(message);
}, false);
	














