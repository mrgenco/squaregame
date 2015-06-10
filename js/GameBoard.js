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
var ctx = canvas.getContext("2d");

function startGame(){


	if(isStarted)
	{
		alert("Game is already started!");
	}
	else
	{

	    canvasWidth = canvas.width;
	    canvasHeight = canvas.height;

	    //alert("Canvas width = "+canvasWidth+" \nCanvas height = "+canvasHeight);


	    var countX = pointCountX;
	    var countY = pointCountY;

	    //Points are created on the board
	    pointDistanceX = canvasWidth/countX;
	    pointDistanceY = canvasHeight/countY;	

	    //pointX and pointY should start from 5 since 
	    //the gameboard has a 5px border
	    pointX = 3;	
	    pointY = 3;

	    for (var i = 0; i < countY; i++) {
	    	for (var j = 0; j < countX; j++) {
	    		
    	      drawPointCircle(pointX, pointY, ctx);

	    	  pointX = pointX + pointDistanceX;

	    	};
	    	pointY = pointY + pointDistanceY;
	    	pointX = 3;
	    };

		isStarted = true;
	} 
    
}

function drawPointCircle(x, y, context){
	context.beginPath();
	context.arc(x, y, 3, 0, Math.PI*2, false);
	context.fillStyle = "red";
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

canvas.addEventListener('mousedown', function(evt) {
	var mousePos = getMousePos(canvas, evt);
	var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
	console.log(message);
}, false);
	













