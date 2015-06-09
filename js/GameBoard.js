//Author : Mehmet Rasid Gencosmanoglu
//ProjectName : SquareGame



// Global variables
canvas = null;
ctx = null;
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
	else{

		

	    canvasWidth = canvas.width;
	    canvasHeight = canvas.height;

	    //alert("Canvas width = "+canvasWidth+" \nCanvas height = "+canvasHeight);


	    var countX = pointCountX;
	    var countY = pointCountY;

	    //Points are created on the board
	    pointDistanceX = canvasWidth/pointCountX;
	    pointDistanceY = canvasHeight/pointCountY;

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

function drawPointRect(x, y, context){
  context.fillRect(x,y,3,3);
}

function drawPointCircle(x, y, context){
  context.beginPath();
  context.arc(x, y, 3, 0, 2 * Math.PI, true);
  context.fillStyle = 'gray';
  context.fill();
  context.lineWidth = 1;
  context.strokeStyle = '#D5D0D0';
  context.stroke();
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




function writeMessage(canvas, message) {
    var context = canvas.getContext('2d');
    context.font = '10pt Calibri';
    context.fillStyle = 'black';
    context.fillText(message, 10, 25);
}












