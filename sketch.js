let size = 4;

let winningTile = 2048;

let population = 175;

let allBoards = [];

let activeBoards = [];


var speedSlider;
var speedSpan;
var highScoreSpan;
var allTimeHighScoreSpan;
var numberOfRunsSpan;
var winsSpan;
var averageScoreSpan;
var numberOfRuns = 0;
var highScore = 0;
var averageScore = 0;
//var showOne = true;
var gameMode = 0;
var wins = 0;
var gamesButton;
var predictBoards = 1;

function setup(){
	var canvas = createCanvas(600,600);
	canvas.parent('canvascontainer');
	gamesButton = select('#games');
	speedSlider = select('#speedSlider');
	speedSpan = select('#speed');
	highScoreSpan = select('#hs');
	numberOfRunsSpan = select('#nr');
	allTimeHighScoreSpan = select('#ahs');
	averageScoreSpan = select('#avg');
	winsSpan = select('#wins');
	gamesButton.mousePressed(toggleState);
	for(var i = 0; i < population; i++){
		var board = new Board(size);
		board.newTile();
		board.newTile();
		activeBoards[i] = board;
		allBoards[i] = board;

	}
}

// Toggle the state of the simulation
function toggleState() {
  if(gameMode < 3){
	  gameMode++;
  }
  else{
	  gameMode = 0;
  }
  // Show the best ball
  if (gameMode == 0) {
    gamesButton.html('Gamemode: User controlled');
    // Go train some more
  } else if(gameMode == 1){
    gamesButton.html('Gamemode: Single game shown');
  } else if(gameMode == 2){
	gamesButton.html('Gamemode: 49 games shown');
  } else if(gameMode == 3){
	gamesButton.html('Gamemode: No games shown');
  } else if(gameMode == 4){
	gamesButton.html('Gamemode: Odds based');
  }
}


function draw(){
	//noLoop();
	background(0);

	var cycles = speedSlider.value();
	speedSpan.html(cycles);
	if(gameMode != 0 && gameMode != 4){
		console.log(gameMode);
		for(var n = 0; n < cycles; n++){
			for(var i = activeBoards.length -1; i >= 0; i--){
				let board = activeBoards[i];
				if(board.gameWon()){
					wins++;
					winsSpan.html(wins);
				}
				let outputs = [];
				outputs = board.think();
				//console.log("top output is " + outputs.indexOf(max(outputs)));
				if(board.move(outputs.indexOf(max(outputs)))){
					moveBoard(outputs.indexOf(max(outputs)), board);
				}
				else{
					outputs[outputs.indexOf(max(outputs))] = 0;
					if(board.move(outputs.indexOf(max(outputs)))){
						moveBoard(outputs.indexOf(max(outputs)), board);
					}
					else{
						outputs[outputs.indexOf(max(outputs))] = 0;
						if(board.move(outputs.indexOf(max(outputs)))){
							moveBoard(outputs.indexOf(max(outputs)), board);
						}
						else{
							outputs[outputs.indexOf(max(outputs))] = 0;
							moveBoard(outputs.indexOf(max(outputs)), board);
						}
					}
				}
				activeBoards[i].updateScore();
				if(gameOver(i)){
					averageScore += activeBoards[i].score;
					activeBoards.splice(i,1);
				}
				else{
					board.newTile();
				}
			}
			var tempHighScore = 0;
			var tempBestBoard = null;
				for (var i = 0; i < activeBoards.length; i++) {
					var s = activeBoards[i].score;
					if (s > tempHighScore) {
						tempHighScore = s;
						tempBestBoard = activeBoards[i];
					}
				}

				// Is it the all time high scorer?
				if (tempHighScore > highScore) {
					highScore = tempHighScore;
				}

			highScoreSpan.html(tempHighScore);
			allTimeHighScoreSpan.html(highScore);
			numberOfRunsSpan.html(numberOfRuns);
		}
	}
	if(gameMode == 4){
		var ret = activeBoards[0].predict(predictBoards);
		console.log(ret);
	}


	if(activeBoards.length == 0){
		averageScoreSpan.html(averageScore/population);
		averageScore = 0;
		nextGeneration();
	}
	if(gameMode == 2){
		let w = 20;
			for(let x = 0; x < 49; x++){
				if(activeBoards[x] != null){
					for (let i = 0; i < size; i++) {
						for (let j = 0; j < size; j++) {
							noFill();
							strokeWeight(2);
							let val = activeBoards[x].board[i][j];
							let s = val.toString();
							if(val > 2000){
								fill(255,100,0);
							}
							else if(val > 1000){
							fill(255,0,0);
							}

							else if(val > 500){
								fill(225,0,25);
							}
							
							else if(val > 250){
								fill(200,0,50);
							}
							else if(val > 123){
								fill(175,0,75);
							}
							else if(val > 60){
								fill(150,0,100);
							}
							else if(val > 30){
								fill(125,0,125);
							}

							else if(val > 15){
								fill(100,0,150);
							}
							else if(val > 7){
								fill(75,0,175);
							}
							else if(val > 3){
								fill(50,0,200);
							}				
							else if(val > 1){
							fill(25,0,225);
							}
							else{
								fill(0,0,0);
							}
							//rect(i * w, j * w, w, w, 30);
							//rect(((x%7) * 4 * w) + i * w,floor((x/7)) *4 * w + j * w, w, w, 30);
							rect(((x%7) * 600 / 7) + i * w + 2.5, floor((x/7)) * 600 / 7 + j * w + 2.5, w, w, 20);
							if (val !== 0) {
								textAlign(CENTER, CENTER);
								noStroke();
								fill(255);
								textSize(7);
								//text(val, i * w + w / 2, j * w + w / 2);
								//text(val, ((x %7) * 4 * w) + i * w + w / 2, floor((x/7)) * 4 * w + j * w + w / 2);
								text(val, ((x%7) * 600 / 7) + i * w + 2.5 + w/2, floor((x/7)) * 600 / 7 + 2.5 + j * w + w/2);
							}
							strokeWeight(.25);
							stroke(255);
							line(85.714, 0, 85.714, 600);
							line(171.428, 0, 171.428, 600);
							line(257.142, 0, 257.142, 600);
							line(342.857, 0, 342.857, 600);
							line(428.271, 0, 428.271, 600);
							line(514.285, 0, 514.285, 600);
							line(0, 85.714, 600, 85.714);
							line(0, 171.428, 600, 171.428);
							line(0, 257.142, 600, 257.142);
							line(0, 342.857, 600, 342.857);
							line(0, 428.271, 600, 428.271);
							line(0, 514.285, 600, 514.285);
							stroke(0);
						}
					}
				}
			}
		}
		if(gameMode == 1 || gameMode == 0 || gameMode == 4){
		let w = 150;
			if(activeBoards[0] != null){
				for (let i = 0; i < size; i++) {
					for (let j = 0; j < size; j++) {
						noFill();
						strokeWeight(2);
						let val = activeBoards[0].board[i][j];
						let s = val.toString();
						if(val > 2000){
							fill(255,100,0);
						}
						else if(val > 1000){
						fill(255,0,0);
						}

						else if(val > 500){
							fill(225,0,25);
						}
						
						else if(val > 250){
							fill(200,0,50);
						}
						else if(val > 123){
							fill(175,0,75);
						}
						else if(val > 60){
							fill(150,0,100);
						}
						else if(val > 30){
							fill(125,0,125);
						}

						else if(val > 15){
							fill(100,0,150);
						}
						else if(val > 7){
							fill(75,0,175);
						}
						else if(val > 3){
							fill(50,0,200);
						}				
						else if(val > 1){
						fill(25,0,225);
						}
						else{
							fill(0,0,0);
						}
						//rect(i* w + w / 2, j*w + w/2 , w, w, 20);
						rect(i*w+2.5, j*w+2.5, w-5, w-5, 20);
						if (val !== 0) {
							textAlign(CENTER, CENTER);
							noStroke();
							fill(0);
							textSize(48);
							//text(val, i * w + w / 2, j * w + w / 2);
							text(val, i* w + w / 2, j*w + w/2);
						}
					}
				}
			}
		}
	frameRate(15);


}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

function moveBoard(i, board){
	if(i == 0){
		board.slide0();
		board.combine0();
		board.slide0();
	}
	else if(i==1){
		board.slide1();
		board.combine1();
		board.slide1();
	}
	else if(i==2){
		board.slide2();
		board.combine2();
		board.slide2();
	}
	else if(i ==3 ){
		board.slide3();
		board.combine3();
		board.slide3();
	}
}

function drawBoard(){
	let w = 20;
	for(let x = 0; x < 49; x++){
		if(activeBoards[x] != null){
			for (let i = 0; i < size; i++) {
				for (let j = 0; j < size; j++) {
					noFill();
					strokeWeight(2);
					let val = activeBoards[x].board[j][i];
					let s = val.toString();
					if (val != 0) {
						fill(255,0,0);
					} else {
						fill(0,0,255);
					}
					//rect(i * w, j * w, w, w, 30);
					rect(((x%7) * 4 * w) + i * w,floor((x/7)) *4 * w + j * w, w, w, 30);
					if (val !== 0) {
						textAlign(CENTER, CENTER);
						noStroke();
						fill(0);
						textSize(8);
						//text(val, i * w + w / 2, j * w + w / 2);
						text(val, ((x %7) * 4 * w) + i * w + w / 2, floor((x/7)) * 4 * w + j * w + w / 2);
					}
				}
			}
		}
	}
}

function keyPressed(){
	//activeBoards[0].updateScore();
  if(gameMode != 0){
	  return;
  }
  if(gameOver(0)){
	  activeBoards[0] = activeBoards[0].copy();
	  activeBoards[0].newTile();
	  activeBoards[0].newTile();
  }
  else if(keyCode === UP_ARROW){
    if(activeBoards[0].move(0)) {
			//activeBoards[0].slide0(); activeBoards[0].combine0(); activeBoards[0].slide0(); activeBoards[0].newTile();
			moveBoard(0, activeBoards[0]);
			activeBoards[0].newTile();
		}
		//drawBoard();
  }
  else if(keyCode == DOWN_ARROW){
    if(activeBoards[0].move(1)) {
			//activeBoards[0].slide1(); activeBoards[0].combine1(); activeBoards[0].slide1();activeBoards[0].newTile();
			moveBoard(1, activeBoards[0]);
			activeBoards[0].newTile();
		}
		//drawBoard();
  }
  else if(keyCode == LEFT_ARROW){
    if(activeBoards[0].move(2)) {
			//activeBoards[0].slide2(); activeBoards[0].combine2(); activeBoards[0].slide2();activeBoards[0].newTile();
			moveBoard(2, activeBoards[0]);
			activeBoards[0].newTile();
		}
		//drawBoard();
  }
  else if(keyCode == RIGHT_ARROW){
    if(activeBoards[0].move(3)) {
			//activeBoards[0].slide3(); activeBoards[0].combine3(); activeBoards[0].slide3();activeBoards[0].newTile();
			moveBoard(3, activeBoards[0]);
			activeBoards[0].newTile();
		}
		//drawBoard();
  }

  else if(keyCode == ENTER){
		loop();
  }
  else if(keyCode == SHIFT){
		noLoop();
  }
  	if(activeBoards[0].gameWon()){
		wins++;
		winsSpan.html(wins);
	}
  highScoreSpan.html(activeBoards[0].updateScore());
}

function gameOver(i){
  return !activeBoards[i].move(0) && !activeBoards[i].move(1) && !activeBoards[i].move(2) && !activeBoards[i].move(3);
}
