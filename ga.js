// Start the game over
function resetGame() {
  numberOfRuns++;
  for(let i = 0; i < allBoards.length; i++){
    for(var x = 0; x < 4; x++){
      for(var y= 0; y < 4; y++){
        allBoards[i].board[x][y] = 0;
      }
    }
  }
}

// Create the next generation
function nextGeneration() {
  resetGame();
  // Normalize the fitness values 0-1
  normalizeFitness(allBoards);
  // Generate a new set of birds
  activeBoards = generate(allBoards);

  addTiles(activeBoards);
  // Copy those birds to another array
  allBoards = activeBoards.slice();
}

// Generate a new population of birds
function generate(oldBoards) {
  let newBoards = [];
  for (let i = 0; i < oldBoards.length; i++) {
    // Select a bird based on fitness
    let board = poolSelection(oldBoards);
    newBoards[i] = board;
  }
  return newBoards;
}

function addTiles(boards){
  for(let i = 0; i < boards.length; i++){
    boards[i].newTile();
    boards[i].newTile();
  }
}

// Normalize the fitness of all birds
function normalizeFitness(boards) {
  // Make score exponentially better?
  for (let i = 0; i < boards.length; i++) {
    boards[i].score = pow(boards[i].score, 2);
  }

  // Add up all the scores
  let sum = 0;
  for (let i = 0; i < boards.length; i++) {
    sum += boards[i].score;
  }
  // Divide by the sum
  for (let i = 0; i < boards.length; i++) {
    boards[i].fitness = boards[i].score / sum;
  }
}


// An algorithm for picking one bird from an array
// based on fitness
function poolSelection(boards) {
  // Start at 0
  let index = 0;

  // Pick a random number between 0 and 1
  let r = random(1);

  // Keep subtracting probabilities until you get less than zero
  // Higher probabilities will be more likely to be fixed since they will
  // subtract a larger number towards zero
  while (r > 0) {
    r -= boards[index].fitness;
    // And move on to the next
    index += 1;
  }

  // Go back one
  index -= 1;

  // Make sure it's a copy!
  // (this includes mutation)
  return boards[index].copy();
}
