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

button_3x3.onclick = drawGameBoard;
button_4x4.onclick = drawGameBoard;
button_5x5.onclick = drawGameBoard;
button_6x6.onclick = drawGameBoard;

var isStarted = false;
var flagNameDistplay = false;

var pointCountX = 5;
var pointCountY = 5;

var canvas = document.getElementById("game-canvas");
var canvasWidth;
var canvasHeight;

var buttonValue = 0;
var ctx = canvas.getContext("2d");

// Player setup will be made according to 2 on default
var playerStatus = {
	// has to be set on drawGameBoard //
	amount: 2,  // amount of players playing the game
	names: ["Arif", "Mehmet"], // names of the player
	color: ["#FF0000", "#0000FF"], // different color for each player
	// dynamic values //
	turn: 0
}

var colors = {
	pointInitial: "#5CB85C",
	pointAfterDrawline: "#FFFF00",
	pointOnHower: "#FF9900",
	bootStrap: ["default", "primary", "success", "info", "warning", "danger"] // use this parameter only if you are manipulating .html 
}

//The maximum range between the selected point perpendicular to the nearest edge 
var maxRange = 10;

//Line properties
var lineWidth = 7;
var lineType = "round"; //lineCap="butt|round|square";

//Array that helds our point coordinates
var points = {
	xPos: [""], // array holding x-coordinates
	yPos: [""] // array holding y-coordinates
};

//pointsConnected array holds the indices of previously connected points.
//it helps us detecting square 
//it prevents multiple attempts while drawing lines.
//Usage : assume x1 = 0 : y1 = 0 and x2 = 1 : y2 = 0 are connected
//        than pointsConnected must contain the value 0010 which refers to x1y1x2y2
var pointsConnected = [""]; 

//The size we see on the browser
//These values must be same with Logical canvas.
//Otherwise browser will automatically scale the drawings 
canvas.style.width = '100%';
canvas.style.height = '100%';


//drawGameBoard function will be called each time the user resizes the window
window.addEventListener('resize', drawGameBoard, false);

/*
* Draws the gameboard according to desired values (3x3, 4x4, 5x5, 6x6)
* 
*/
function drawGameBoard(){
	
	// set player status:
	// playerStatus.amount = x;
	// playerStatus.names = {element11, element12, ...}
	// playerStatus.color = {element21, element22, ...}
	
	if(playerStatus.names.length != playerStatus.amount || playerStatus.color.length != playerStatus.amount || playerStatus.amount < 2){
		
		// there is some missing information if you are here...
		alert("Check the player setup again. There is something wrong with playerStatus.");
	}
	
	displayPlayerNames(playerStatus, colors);
	
    //Old values must be cleared before canvas recreated..
    pointsConnected = [""];
    points.xPos = [""];
    points.yPos = [""];


    resizeCanvas();

	ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    var countX;
    var countY;


    if(this.value){ //enters when button clicks
        //Gameboard size can be 3x3, 4x4, 5x5, 6x6
        countX = this.value;
        countY = this.value;
        buttonValue = this.value;
    }
    else{ //enters when window resize 
        countX = buttonValue;
        countY = buttonValue;
    }
    
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
	      drawPoint(pointX, pointY, ctx, colors.pointInitial);
    	  pointX = pointX + pointDistanceX;

          console.log("matrix["+j+"]["+i+"]");

    	};
		points.yPos[i] = pointY;
    	pointY = pointY + pointDistanceY;
    	pointX = pointDistanceX/2;
    };

}

// Runs each time the DOM window resize event fires.
// Resets the canvas dimensions to match window
function resizeCanvas() {

    if(window.innerWidth>700)
    {   
        canvas.width=window.innerWidth/3;   //%33
        canvas.height=window.innerHeight/2; //%50
    }
    else
    {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight/2;
    }
}

// This function draws a point on the specified coordinates 
function drawPoint(x, y, context, color){
	
	context.beginPath();
	context.arc(x, y, 5, 0, Math.PI*2, false);
	context.fillStyle = color;
	context.fill();
	context.closePath();
}


/* 
* This function draws a line between the input coordinates.
* UPDATE : Control added for second draw attempt between previously connected points. 
*          returns true if line is drawn 
*          returns false if there is already a line
*/
function drawLine(x1, y1, x2, y2, context, color){	

    var indicesConcat = x1.toString() + y1.toString() + x2.toString() + y2.toString();
    console.log(indicesConcat);
    // Control added for second draw attempt
    if(pointsConnected.indexOf(indicesConcat) == -1){ //Enter if x1y1x2y2 combination doesnt exist

        context.beginPath();
        context.lineCap = lineType;
        context.lineWidth = lineWidth;
        context.moveTo(points.xPos[x1], points.yPos[y1]);
        context.lineTo(points.xPos[x2], points.yPos[y2]);
        context.strokeStyle = color;
        context.stroke();

        drawPoint(points.xPos[x1], points.yPos[y1], context, colors.pointAfterDrawline); // draw initial point above the drawn line
        drawPoint(points.xPos[x2], points.yPos[y2], context, colors.pointAfterDrawline); // draw ending point above the drawn line
    
        console.log(x1 + " " + y1 + " " + x2 + " " + y2);

        //add these indices to array for not drawing between same points later 
        pointsConnected.push(indicesConcat);
        
        return true;

    }
    else{
        alert("There is already a line here!");
        return false;
    }

}


/**
 * This function controls if there is a possible square after drawing each line
 *
 * @param x1,y1 : point1
 * @param x2,y2 : point2
 * @return : true if square detected, false otherwise
 *
 * Known Issue : in some cases it is possible to create multiple square with single line 
 *               and this function didnt handle it yet.
 *
 * Change the algorithm if better one exists ! ( I don't think so :P )
 */ 
function isSquareDetected(x1, y1, x2, y2){
   
   var indicesConcat1;
   var indicesConcat2;
   var indicesConcat3;

   //if the line is vertical control possible left and right squares
   if(y2 > y1)
   {

        //CHECK LEFT SQUARE  

        indicesConcat1 = (x1-1).toString() + y1.toString() + x1.toString() + y1.toString();
        indicesConcat2 = (x1-1).toString() + y1.toString() + (x2-1).toString() + y2.toString();
        indicesConcat3 = (x2-1).toString() + y2.toString() + x2.toString() + y2.toString();

        //Enter if each of these line combinations exist ind pointsConnected array
        if(pointsConnected.indexOf(indicesConcat1) != -1 && pointsConnected.indexOf(indicesConcat2) != -1 && pointsConnected.indexOf(indicesConcat3) != -1)
            return true;


        //CHECK RIGHT SQUARE
        indicesConcat1 = x1.toString() + y1.toString() + (x1+1).toString() + y1.toString();
        indicesConcat2 = (x1+1).toString() + y1.toString() + (x2+1).toString() + y2.toString();
        indicesConcat3 = x2.toString() + y2.toString() + (x2+1).toString() + y2.toString();

        if(pointsConnected.indexOf(indicesConcat1) != -1 && pointsConnected.indexOf(indicesConcat2) != -1 && pointsConnected.indexOf(indicesConcat3) != -1)
            return true;
   }

   //if the line is horizontal control possible upper and bottom squares
   if(x2 > x1) 
   {
        //CHECK UPPER SQUARE  

        indicesConcat1 = x1.toString() + (y1-1).toString() + x1.toString() + y1.toString();
        indicesConcat2 = x1.toString() + (y1-1).toString() + x2.toString() + (y2-1).toString();
        indicesConcat3 = x2.toString() + (y2-1).toString() + x2.toString() + y2.toString();

        
        if(pointsConnected.indexOf(indicesConcat1) != -1 && pointsConnected.indexOf(indicesConcat2) != -1 && pointsConnected.indexOf(indicesConcat3) != -1)
            return true;


        //CHECK BOTTOM SQUARE
        indicesConcat1 = x1.toString() + y1.toString() + x1.toString() + (y1+1).toString();
        indicesConcat2 = x1.toString() + (y1+1).toString() + x2.toString() + (y2+1).toString();
        indicesConcat3 = x2.toString() + y2.toString() + x2.toString() + (y2+1).toString();

        if(pointsConnected.indexOf(indicesConcat1) != -1 && pointsConnected.indexOf(indicesConcat2) != -1 && pointsConnected.indexOf(indicesConcat3) != -1)
            return true;
   }
    return false;
}

/**
 * This function detects the nearest edge to the clicked point.
 *
 * @RETURN: the distance to the nearest edge,
 * 		initial point of the nearest edge (x1, y1),
 * 		ending point of the nearest edge (x2, y2)
 *
 * Change the algorithm if better one exists !
 */ 
function findTheClosestEdge(canvas, clckPosX, clckPosY){
	
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
			if(points.yPos[0] > clckPosY || points.yPos[points.yPos.length - 1] < clckPosY) 
                continue; // do not calculate the distance in this situation
	
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
		
		if(Math.abs(points.yPos[i] - clckPosY) < closestEdge.distance) { 
        // enter if the distance is even smaller
			
			// find the x interval
			if(points.xPos[0] > clckPosX || points.xPos[points.xPos.length - 1] < clckPosX) 
                continue; // do not calculate the distance in this situation
			
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

/**
 * This function calculates which player is next to play.
 *
 * @playerProperties: the object which holds the current turn and player amount information
 * @forward: this input might be useful if other mods will be created 
 *
 * Change the algorithm if better one exists !
 */ 
function playerTurnAlgorithm(forward, playerProperties)
{
	if(forward){
		if(playerProperties.turn + 1 == playerProperties.amount){
			playerProperties.turn = 0;
		}else{
			playerProperties.turn ++;
		}
	}
}

function displayPlayerNames(playerProperties, color){
	
	// check if the names already exist, so that program wont create every time it re-draws the canvas
	if(!flagNameDistplay){
		for (var i = 0; i < playerProperties.amount; i++) {
			$( "<h1><span id=\"Player" + i + "\"  class=\"label label-" + color.bootStrap[i % color.bootStrap.length] + " col-sm-4\" >" + playerProperties.names[i] + "</span></h1></br></br>" ).insertAfter( "#player-names" );
		}
		
		flagNameDistplay = true; // whenever the playerProperties change set this flag to false
	}
}

//MOUSE DOWN EVENT
//You can see the coordinates on the browser console..
canvas.addEventListener('mousedown', function(evt) {

	var mousePos = getMousePos(canvas, evt);
	var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
	console.log(message);
	
	var edge = findTheClosestEdge(canvas, mousePos.x, mousePos.y);
	var message2 = 'Distance: ' + edge.distance + '\nPoint 1: (' + points.xPos[edge.x1] + ',' + points.yPos[edge.y1] + ')\nPoint 2: (' + points.xPos[edge.x2] + ',' + points.yPos[edge.y2] + ')';
	console.log(message2);
	
	if(edge.distance < maxRange){
       
        var forward;

		// draw the line if the click is close enough to the edge
        if(drawLine(edge.x1,edge.y1,edge.x2,edge.y2,ctx, playerStatus.color[playerStatus.turn])) 
		{
            forward = true;
            //Control if there is a square after drawing new line..
            if(isSquareDetected(edge.x1,edge.y1,edge.x2,edge.y2)){
                console.log("Square Detected");
                alert("Square Detected");
                playerTurnAlgorithm(false, playerStatus) // the player who complates the square will keep turn on himself.
                
                //Player score logic can be implemented here..
            }
            else
            {
                playerTurnAlgorithm(forward, playerStatus) // the turn passes to next player
            }

        }
        else
          forward = false;  //user turn doesn't change if drawLine returns false

	}
}, false);
	
// the coordinates of getMousePos and points does not overlap sometimes ! 
// therefore some errors can occur while drawing lines. We need to match them.
// Known Issue : Points array was holding previous values of the gameboard when different sizes selected. 
// Solution : Solved by clearing old values in points array each time gameboard created.
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}












