//Author : Mehmet Rasid Gencosmanoglu
//Author : Arif Gencosmanoglu
//ProjectName : SquareGame


$( "#start-button" ).click(function() {
  $( "#select-size" ).show( "slow" );
});

/* These are the parameters for hover code  /// -> */// <- remove me
// if there is no cursor while playing ///
// Remove them with:
// - the variables (under drawLine function)  //
// - and functions (on the end of the script file)//
var hoverInterval = setInterval(function () {onHover()}, 500); // set a timer that runs every 500ms
var flagDrawn = false; // this flag rises when transparent line is drawn
var tempLine; // this variable is used to temporarily store the point coordinates drawn as transparent
//////////////////////////////////////////////////////////////*/

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

var gameSize = 0;
var ctx = canvas.getContext("2d");

// Player setup will be made according to 2 on default
var playerStatus = {
	// has to be set on drawGameBoard //
	amount: 2,  // amount of players playing the game
	names: ["Arif", "Mehmet"/*, "Murat"*/], // names of the player
	color: ["#F0AD4E", "#337AB7"/*,"#5CB85C"*/], // different color for each player
    scores: [0,0/*,0*/],  //initial values for scores
	// dynamic values //
	turn: 0
}

var colors = {
	pointInitial: "#FA334F",
	pointAfterDrawline: "#FFFF00",
	pointOnHower: "#FF9900",
	bootStrap: ["warning", "primary", "success", "info", "default", "danger"] // use this parameter only if you are manipulating .html 
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
    //Scores must be cleared as well..
    for (var i = 0; i < playerStatus.amount; i++) {
        playerStatus.scores[i] = 0;
        document.getElementById("Player" + i).innerHTML = playerStatus.names[i] + " : " + playerStatus.scores[i];
    }

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
        gameSize = this.value;
    }
    else{ //enters when window resize 
        countX = gameSize;
        countY = gameSize;
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
	
	context.globalAlpha = 1;
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

		context.globalAlpha = 1;
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
		
		/* This small piece of code also belongs to the hover algorithm  /// 
		// if there is no cursor while playing /// -> */// <- remove me
		// Remove them with:
		// - the functions (on the end of the script file)  //
		// - and variables (on the beginning of the script file)//
        tempLine.x1 = 0; 
		tempLine.y1 = 0;
		tempLine.x2 = 0;
		tempLine.y2 = 0;
		////////////////////////////////////////////////////////////////////////////////////////*/
		
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
 * @return : squareCount
 * Known Issue : in some cases it is possible to create multiple square with single line 
 *               and this function didnt handle it yet.
 *
 * Change the algorithm if better one exists ! ( I don't think so :P )
 */ 
function isSquareDetected(x1, y1, x2, y2){
   
   var indicesConcat1;
   var indicesConcat2;
   var indicesConcat3;
   var squareCount = 0;
   var squarePosition = {
	   left: 1,
	   right: 2,
	   up: 3,
	   down: 4
   };
   
   //if the line is vertical control possible left and right squares
   if(y2 > y1)
   {

        //CHECK LEFT SQUARE  

        indicesConcat1 = (x1-1).toString() + y1.toString() + x1.toString() + y1.toString();
        indicesConcat2 = (x1-1).toString() + y1.toString() + (x2-1).toString() + y2.toString();
        indicesConcat3 = (x2-1).toString() + y2.toString() + x2.toString() + y2.toString();

        //Enter if each of these line combinations exist in pointsConnected array
        if(pointsConnected.indexOf(indicesConcat1) != -1 && pointsConnected.indexOf(indicesConcat2) != -1 && pointsConnected.indexOf(indicesConcat3) != -1){
            squareCount++;
			drawRect(x1, y1, x2, y2, squarePosition.left, ctx, playerStatus.color[playerStatus.turn]);
		}

        //CHECK RIGHT SQUARE
        indicesConcat1 = x1.toString() + y1.toString() + (x1+1).toString() + y1.toString();
        indicesConcat2 = (x1+1).toString() + y1.toString() + (x2+1).toString() + y2.toString();
        indicesConcat3 = x2.toString() + y2.toString() + (x2+1).toString() + y2.toString();

        if(pointsConnected.indexOf(indicesConcat1) != -1 && pointsConnected.indexOf(indicesConcat2) != -1 && pointsConnected.indexOf(indicesConcat3) != -1){
            squareCount++;
			drawRect(x1, y1, x2, y2, squarePosition.right, ctx, playerStatus.color[playerStatus.turn]);
		}
   }

   //if the line is horizontal control possible upper and bottom squares
   if(x2 > x1) 
   {
        //CHECK UPPER SQUARE  

        indicesConcat1 = x1.toString() + (y1-1).toString() + x1.toString() + y1.toString();
        indicesConcat2 = x1.toString() + (y1-1).toString() + x2.toString() + (y2-1).toString();
        indicesConcat3 = x2.toString() + (y2-1).toString() + x2.toString() + y2.toString();

        
        if(pointsConnected.indexOf(indicesConcat1) != -1 && pointsConnected.indexOf(indicesConcat2) != -1 && pointsConnected.indexOf(indicesConcat3) != -1){
            squareCount++;
			drawRect(x1, y1, x2, y2, squarePosition.up, ctx, playerStatus.color[playerStatus.turn]);
		}

        //CHECK BOTTOM SQUARE
        indicesConcat1 = x1.toString() + y1.toString() + x1.toString() + (y1+1).toString();
        indicesConcat2 = x1.toString() + (y1+1).toString() + x2.toString() + (y2+1).toString();
        indicesConcat3 = x2.toString() + y2.toString() + x2.toString() + (y2+1).toString();

        if(pointsConnected.indexOf(indicesConcat1) != -1 && pointsConnected.indexOf(indicesConcat2) != -1 && pointsConnected.indexOf(indicesConcat3) != -1){
            squareCount++;
			drawRect(x1, y1, x2, y2, squarePosition.down, ctx, playerStatus.color[playerStatus.turn]);
		}
   }
   //if(squareCount != 0)
   //     return squareCount;
   //else
   //     return 0;
	return squareCount; // Mehmet you are busted haha :))
}


function drawTransparentLine(x1, y1, x2, y2, context, color){	

	context.globalAlpha = 0.5;
	context.beginPath();
	context.lineCap = lineType;
	context.lineWidth = lineWidth;
	context.moveTo(points.xPos[x1], points.yPos[y1]);
	context.lineTo(points.xPos[x2], points.yPos[y2]);
	context.strokeStyle = color;
	context.stroke();

	drawPoint(points.xPos[x1], points.yPos[y1], context, colors.pointOnHower); // draw initial point above the drawn line
	drawPoint(points.xPos[x2], points.yPos[y2], context, colors.pointOnHower); // draw ending point above the drawn line   

	return {
		x1: points.xPos[x1],
		y1: points.yPos[y1],
		x2: points.xPos[x2],
		y2: points.yPos[y2]
	};
}


/**
 * This function draws a half-transparent rectangle on the completed square.
 * Square is colored according to the color whom ever completed it. 
 * @param x1,y1 : point1
 * @param x2,y2 : point2
 * @direction: completed square direction (1 -> left, 2 -> right, 3 -> top, 4 -> bottom)
 * @context: context which is defined globally
 * @color: completed players color info
 */
function drawRect(x1, y1, x2, y2, direction, context, color){
	
	var rectWidth;
	var rectHeight;
	
	context.globalAlpha = 0.5;
	context.fillStyle = color;
	
	switch(direction) {
		case 1: // fill through left
			rectWidth = -Math.abs(points.xPos[x1] - points.xPos[x1 - 1]) + lineWidth;
			rectHeight = Math.abs(points.yPos[y1] - points.yPos[y2]) - lineWidth;
			
			context.fillRect(points.xPos[x1] - lineWidth / 2, points.yPos[y1] + lineWidth / 2, rectWidth, rectHeight);
			
			break;
		case 2: // fill through right
			rectWidth = Math.abs(points.xPos[x1] - points.xPos[x1 + 1]) - lineWidth;
			rectHeight = Math.abs(points.yPos[y1] - points.yPos[y2]) - lineWidth;
			
			context.fillRect(points.xPos[x1] + lineWidth / 2, points.yPos[y1]  + lineWidth / 2, rectWidth, rectHeight);
			
			break;
		case 3: // fill through top
			rectWidth = Math.abs(points.xPos[x1] - points.xPos[x2]) - lineWidth;
			rectHeight = -(Math.abs(points.yPos[y1] - points.yPos[y1 - 1]) - lineWidth / 2);
			
			context.fillRect(points.xPos[x1] + lineWidth / 2, points.yPos[y1], rectWidth, rectHeight);
			
			break;
		case 4: // fill through bottom
			rectWidth = Math.abs(points.xPos[x1] - points.xPos[x2]) - lineWidth;
			rectHeight = Math.abs(points.yPos[y1] - points.yPos[y1 + 1]);
			
			context.fillRect(points.xPos[x1] + lineWidth / 2, points.yPos[y1], rectWidth, rectHeight);
			
			break;
		default:
			alert("You have discovered an interesting bug.");
	}
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


/**
 * This function creates the player names as labels beneath the canvas in different colors. 
 * @playerProperties: This is the object the includes the player name and the player amount information.
 * @color: This is the object which holds the color information. Colors are assigned according to this object.
 */
function displayPlayerNames(playerProperties, color){
	
	// check if the names already exist, so that program wont create every time it re-draws the canvas
	if(!flagNameDistplay){
	for (var i = 0; i < playerProperties.amount; i++) {
		$( "<h3><span style=\"width:100%;\" id=\"Player" + i + "\"  class=\"label label-" + color.bootStrap[i % color.bootStrap.length] + " col-sm-4\" >" + playerProperties.names[i]+ "</span></h1>" ).insertAfter( "#player-names" );
	}
		flagNameDistplay = true; // whenever the playerProperties change set this flag to false
	}
}


//This function refreshes the player scores each time square/squares found
//Player score increases 1 per square
function refreshPlayerScores(playerProperties, squareCount){
    
    var player = playerProperties.turn;
    playerProperties.scores[player]+=squareCount;

    for (var i = 0; i < playerProperties.amount; i++) {
        document.getElementById("Player" + i).innerHTML = playerProperties.names[i] + " : " + playerProperties.scores[i];
    }

}


//Controls if players found all the squares on gameboard
//@return true if the game is over
function isGameOver(playerProperties)
{
    var totalSquare = 0;
    
    for (var i = 0; i < playerProperties.amount; i++) {
        totalSquare += playerProperties.scores[i];
    }

    if(totalSquare == (gameSize-1)*(gameSize-1))
        return true;
    else
        return false;

}


//MOUSE DOWN EVENT
//You can see the coordinates on the browser console..
canvas.addEventListener('mousedown', function(evt) {

	var mousePos = getMousePos(canvas, evt);
	
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
            squareCount = isSquareDetected(edge.x1,edge.y1,edge.x2,edge.y2);
            if(squareCount != 0){

                forward = false;
                console.log("Square Detected");
                playerTurnAlgorithm(false, playerStatus) // the player who complates the square will keep turn on himself.
                refreshPlayerScores(playerStatus, squareCount);
                
                if(isGameOver(playerStatus))
                    alert("Game is Over!!!!!");
				
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


/* Hovering Functions start from here  /// 
// if there is no cursor while playing /// -> */// <- remove me
// Remove them with:
// - the variables (under drawLine function)  //
// - and variables (on the beginning of the script file)//

/**
 * This function works only if a cursor is available,
 * It projects any possible edge before drawing.
 * This function also uses the defined timer combined with the onmousemove event.
 * If the line can be drawn on click, a transparent line is drawn. When the cursor 
 * gets out of the range without clicking, the drawn line is cleared.
 */
function onHover() {
	
    document.onmousemove = handleMouseMove; 
	
    function handleMouseMove(event) { // enters here on every mouse movement
		
		var rect = canvas.getBoundingClientRect(); 
		
		var edge = findTheClosestEdge(canvas, event.clientX - rect.left, event.clientY - rect.top);
		
		if((pointsConnected.indexOf(edge.x1.toString() + edge.y1.toString() + edge.x2.toString() + edge.y2.toString()) == -1)){ //do not enter if a line is already drawn
			
			if(edge.distance < maxRange && !flagDrawn){ // enter if there the cursor is in range to draw, and there is no projected line drawn
				tempLine = drawTransparentLine(edge.x1, edge.y1, edge.x2, edge.y2, ctx, playerStatus.color[playerStatus.turn]);
				flagDrawn = true; // rise the flag so the program wont re-draw the projected line
			}
			
			else if(edge.distance > maxRange && flagDrawn){ // enter if the projected line is drawn and the cursor is now out of range
				clearHoveredEdge(tempLine); // clear the projected line
				flagDrawn = false; // clear the flag since the projected line is cleared
			}
		}
	}
}


/**
 * This function is called when the temproary drawn transparent line needs to be cleared.
 * @tempLineCoordinates: These are the coordinates where the transparent line is drawn. 
 * So the function will calculate which area to clear.
 */
function clearHoveredEdge(tempLineCoordinates){
	
	if(tempLineCoordinates.y1 - tempLineCoordinates.y2 != 0){ // the drawn line is vertical
		
		ctx.clearRect(tempLineCoordinates.x1 - lineWidth, tempLineCoordinates.y1, lineWidth * 2, tempLineCoordinates.y2 - tempLineCoordinates.y1);
		
		// refresh the points after clearing the projected line
		drawPoint(tempLineCoordinates.x1, tempLineCoordinates.y1, ctx, colors.pointInitial); 
		drawPoint(tempLineCoordinates.x2, tempLineCoordinates.y2, ctx, colors.pointInitial);
	
	}else if (tempLineCoordinates.x1 - tempLineCoordinates.x2 != 0) { // the drawn line is horizontal
		
		ctx.clearRect(tempLineCoordinates.x1, tempLineCoordinates.y1 - lineWidth, tempLineCoordinates.x2 - tempLineCoordinates.x1, lineWidth * 2);
		
		// refresh the points after clearing the projected line
		drawPoint(tempLineCoordinates.x1, tempLineCoordinates.y1, ctx, colors.pointInitial);
		drawPoint(tempLineCoordinates.x2, tempLineCoordinates.y2, ctx, colors.pointInitial);
	}
}
///////////////////////////////////////////////////////////////////////*/


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