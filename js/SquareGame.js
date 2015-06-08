// Global vars

var buttonStart = document.getElementById("start-button");
canvas = null;
ctx = null;

buttonStart.onclick = startGame;



// ----------------------------------------
function startGame(){

	canvas = document.getElementById("game-canvas");
    ctx = canvas.getContext("2d");
    
    ctx.strokeRect(40, 40, 80, 40);
    ctx.fillText("Hello World!", 50, 65);

}

