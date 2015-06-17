//Author : Mehmet Rasid Gencosmanoglu
//Author : Arif Gencosmanoglu
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

//The maximum range between the selected point perpendicular to the nearest edge 
var maxRange = 10;

//Line properties
var lineWidth = 7; 
var lineColor = "#FF0000"; //strokeStyle=color|gradient|pattern;
var lineType = "round"; //lineCap="butt|round|square";

//Array that helds our point coordinates
var points = {
	xPos: [""], // array holding x-coordinates
	yPos: [""] // array holding y-coordinates
};

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
    	
		  points.xPos[j] = pointX;
	      drawPointCircle(pointX, pointY, ctx);
    	  pointX = pointX + pointDistanceX;

    	};
		points.yPos[i] = pointY;
    	pointY = pointY + pointDistanceY;
    	pointX = pointDistanceX/2;
    };

	isStarted = true;
}

//Draws circle
function drawPointCircle(x, y, context){
	context.beginPath();
	context.arc(x, y, 5, 0, Math.PI*2, false);
	context.fillStyle = "#5CB85C";
	context.fill();
	context.closePath();
}

// the coordinates of getMousePos and points does not overlap sometimes !
// therefore some errors can occur while drawing lines. We need to match them.
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

// This function draws a line between the input coordinates.
function DrawLine(x1, y1, x2, y2, context){
	context.beginPath();
	context.lineCap = lineType;
	context.lineWidth = lineWidth;
	context.moveTo(points.xPos[x1], points.yPos[y1]);
	context.lineTo(points.xPos[x2], points.yPos[y2]);
	context.strokeStyle = lineColor;
	context.stroke();
}

/**
 * This function detects the nearest edge to the clicked point.
 *
 * Returns the distance to the nearest edge,
 * 		initial point of the nearest edge (x1, y1),
 * 		ending point of the nearest edge (x2, y2)
 *
 * Change the algorithm if better one exists !
 */ 
function FindTheClosestEdge(canvas, clckPosX, clckPosY){
	var closestEdge = {
		distance: canvas.height + canvas.width,		
		x1: -1,
		y1: -1,
		x2: -1,
		y2: -1
	};
	
	/*// Calculations for x-coordinate ///*/
	for (var i = 0; i < points.xPos.length; i++) {
		
		if(Math.abs(points.xPos[i] - clckPosX) < closestEdge.distance) { // enter if the distance is even smaller
			
			// find the y interval
			if(points.yPos[0] > clckPosY || points.yPos[points.yPos.length - 1] < clckPosY) continue; // do not calculate the distance in this situation
	
			for (var j = 0; j < points.yPos.length; j++) { 
				if(points.yPos[j] < clckPosY && points.yPos[j + 1] > clckPosY){
					closestEdge.y1 = j;
					closestEdge.y2 = j + 1;
					break;
				}
			}
			
			//find the x interval
			closestEdge.x1 = i;
			closestEdge.x2 = i;
			
			closestEdge.distance = Math.abs(points.xPos[i] - clckPosX); // calculate distance
		}
	}
	
	/*// Calculations for y-coordinate ///*/
	for (var i = 0; i < points.yPos.length; i++) {
		
		if(Math.abs(points.yPos[i] - clckPosY) < closestEdge.distance) { // enter if the distance is even smaller
			
			// find the x interval
			if(points.xPos[0] > clckPosX || points.xPos[points.xPos.length - 1] < clckPosX) continue; // do not calculate the distance in this situation
			
			for (var j = 0; j < points.xPos.length; j++) {
				if(points.xPos[j] < clckPosX && points.xPos[j + 1] > clckPosX){
					closestEdge.x1 = j;
					closestEdge.x2 = j + 1;
					break;
				}
			}
			
			//find the y interval
			closestEdge.y1 = i;
			closestEdge.y2 = i;	
			
			closestEdge.distance = Math.abs(points.yPos[i] - clckPosY); // calculate distance
		}
	}
	
	return closestEdge;
}

//MOUSE DOWN EVENT
//You can see the coordinates on the browser console..
canvas.addEventListener('mousedown', function(evt) {
	var mousePos = getMousePos(canvas, evt);
	var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
	console.log(message);
	
	var edge = FindTheClosestEdge(canvas, mousePos.x, mousePos.y);
	var message2 = 'Distance: ' + edge.distance + '\nPoint 1: (' + edge.x1 + ',' + edge.y1 + ')\nPoint 2: (' + edge.x2 + ',' + edge.y2 + ')';
	console.log(message2);
	
	if(edge.distance < maxRange) DrawLine(edge.x1,edge.y1,edge.x2,edge.y2,ctx); // draw the line if the click is close enough to the edge
	
}, false);
	














