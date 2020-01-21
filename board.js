function mutate(x) {
  if (random(1) < 0.5) {
    let offset = randomGaussian();
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}
function getBaseLog(x,y) {
  return Math.log(y) / Math.log(x);
}

class Board {
  constructor(size, brain){
    this.size = size;
    this.board = [this.size];
    for(var i = 0; i < this.size; i++){
      this.board[i] = [];
      for(var j = 0; j < this.size; j++){
        this.board[i][j] = 0;
      }
    }
    if (brain instanceof NeuralNetwork) {
      this.brain = brain.copy();
      this.brain.mutate(mutate);
    } else {
      this.brain = new NeuralNetwork(16, 5, 4);
    }
    this.score = 0;
    this.fitness = 0;
	this.hasWon = false;
  }

  copy(){
    return new Board(this.size, this.brain);
  }

  gameWon(){
	if(this.hasWon){
		return false;
	}
    for(var i = 0; i < this.size; i++){
      for(var j = 0; j < this.size; j++){
        if(this.board[i][j] == winningTile){
		  this.hasWon = true;
          return true
        }
      }
    }
    return false;
  }

  think(){
    let inputs = [];
    for(var i = 0; i < this.size; i++){
      for(var j = 0; j < this.size; j++){
        //inputs[i*this.size + j] = map(this.board[i][j], 0, 2048, 0, 1)
        if(this.board[i][j] == 0){
          inputs[i * this.size + j] = 0;
        }
        else{
          inputs[i*this.size + j] = map(getBaseLog(2,this.board[i][j]), 0, 10, 0, 1)
        }
        //inputs[i*this.size + j] = this.board[i][j];
      }
    }
    return this.brain.predict(inputs);


  }
  
  
  hiddenPredict(){
	var currMax = 0;
	  for(var i = 0; i < size; i++){
	    for(var j = 0; j < size; j++){
		  if(this.board[i][j] > currMax){
			currMax = this.board[i][j];
		  }
	    }
	  }
	  return currMax;
  }
  predict(amount){
	let vals = [];
	var dir0;
	var dir1;
	var dir2;
	var dir3;
	var max0 = 0;
	var max1 = 0;
	var max2 = 0;
	var max3 = 0;
	if(this.move(0)){
	  console.log("0");
	  var newBoard = this.copyBoard();
	  newBoard.slide0();
	  newBoard.combine0();
	  newBoard.slide0();
	  for(var i = 0; i < size; i++){
	    for(var j = 0; j < size; j++){
		  if(newBoard.board[i][j] == 0){
			  var tempBoard = newBoard.copyBoard();
			  newBoard.board[i][j] = 2;
			  if(amount == 1){
				if(newBoard.hiddenPredict() > max0){
				  max0 = newBoard.predict(amount-1);
				}	
			  }
			  else{
				if(newBoard.predict(amount-1) > max0){
				  max0 = newBoard.predict(amount-1);
				}					
			  }
		  }
	    }
	  }
	  vals[0] = max0;
	}
	if(this.move(1)){
		console.log("1");
	  var newBoard = this.copyBoard();
	  newBoard.slide1();
	  newBoard.combine1();
	  newBoard.slide1();
	  for(var i = 0; i < size; i++){
	    for(var j = 0; j < size; j++){
		  if(newBoard.board[i][j] == 0){
			  var tempBoard = newBoard.copyBoard();
			  newBoard.board[i][j] = 2;
			  if(amount == 1){
				if(newBoard.hiddenPredict() > max1){
				  max1 = newBoard.predict(amount-1);
				}	
			  }
			  else{
				if(newBoard.predict(amount-1) > max1){
				  max1 = newBoard.predict(amount-1);
				}					
			  }
		  }
	    }
	  }
	  vals[1] = max1;
	}
	if(this.move(2)){
		console.log("2");
	  var newBoard = this.copyBoard();
	  newBoard.slide2();
	  newBoard.combine2();
	  newBoard.slide2();
	  for(var i = 0; i < size; i++){
	    for(var j = 0; j < size; j++){
		  if(newBoard.board[i][j] == 0){
			  var tempBoard = newBoard.copyBoard();
			  newBoard.board[i][j] = 2;
			  if(amount == 1){
				if(newBoard.hiddenPredict() > max2){
				  max2 = newBoard.predict(amount-1);
				}	
			  }
			  else{
				if(newBoard.predict(amount-1) > max2){
				  max2 = newBoard.predict(amount-1);
				}					
			  }
		  }
	    }
	  }
	  vals[2] = max2;
	}
	if(this.move(3)){
		console.log("3");
	  var newBoard = this.copyBoard();
	  newBoard.slide3();
	  newBoard.combine3();
	  newBoard.slide3();
	  for(var i = 0; i < size; i++){
	    for(var j = 0; j < size; j++){
		  if(newBoard.board[i][j] == 0){
			  var tempBoard = newBoard.copyBoard();
			  newBoard.board[i][j] = 2;
			  if(amount == 1){
				if(newBoard.hiddenPredict() > max3){
				  max3 = newBoard.predict(amount-1);
				}	
			  }
			  else{
				if(newBoard.predict(amount-1) > max3){
				  max3 = newBoard.predict(amount-1);
				}					
			  }
		  }
	    }
	  }
	}
	vals[3] = max3;
	return vals;
  
  }
  
  copyBoard(){
	var retBoard = this.copy();
	for(var i = 0; i < size; i++){
	  for(var j = 0; j < size; j++){
		retBoard.board[i][j] = this.board[i][j];
	  }
	}
	return retBoard;
  }

  updateScore(){
    let retVal = 0;
    for(var i = 0; i < this.size; i++){
      for(var j = 0; j < this.size; j++){
        retVal += this.board[i][j];
      }
    }
    this.score = retVal;
    return retVal;
  }

  newTile(){
    let avail = [];
    for(var i = 0; i < this.size; i++){
      for(var j = 0; j < this.size; j++){
        if(this.board[i][j] == 0){
                  avail.push({x:i,y:j});
        }
      }
    }
    let spot = random(avail);
    this.board[spot.x][spot.y] = 2;
  }

  move(dir){
    if(dir == 0){
      for(var i = 0; i < size; i++){
        for(var j = 0; j < size-1; j++){
          if((this.board[i][j] == 0 && this.board[i][j+1] != 0)|| ((this.board[i][j] == this.board[i][j+1]) && this.board[i][j] != 0)){
            return true;
          }
        }
      }
    }
    if(dir == 1){
      for(var i = 0; i < size; i++){
        for(var j = size-1; j > 0; j--){
          if((this.board[i][j] == 0 && this.board[i][j-1] != 0)|| ((this.board[i][j] == this.board[i][j-1]) && this.board[i][j] != 0)){
            return true;
          }
        }
      }
    }
    if(dir == 2){
      for(var i = 0; i < size; i++){
        for(var j = 0; j < size-1; j++){
          if((this.board[j][i] == 0 && this.board[j+1][i] != 0)|| ((this.board[j][i] == this.board[j+1][i])&& this.board[j][i] != 0)){
            return true;
          }
        }
      }
    }
    if(dir == 3){
      for(var i = 0; i < size; i++){
        for(var j = size - 1; j > 0; j--){
          if((this.board[j][i] == 0 && this.board[j-1][i] !=0)|| ((this.board[j][i] == this.board[j-1][i])&&this.board[j][i] != 0)){
            return true;
          }
        }
      }
    }
    return false;
  }

  slide0(){
    for(var i = 0; i < size; i++){
      for(var j = 0; j < size-1; j++){
        if(this.board[i][j] == 0 && this.board[i][j+1] != 0){
          this.board[i][j] = this.board[i][j+1];
  				this.board[i][j+1] = 0;
          j = -1;
        }
      }
    }
  }



  combine0(){
    for(var i = 0; i < size; i++){
      for(var j = 0; j < size-1; j++){
        if(this.board[i][j] == this.board[i][j+1]){
          this.board[i][j] = 2 * this.board[i][j+1];
          this.board[i][j+1] = 0;
          j++;
        }
      }
    }
  }



  slide1(){
    for(var i = 0; i < size; i++){
      for(var j = size-1; j > 0; j--){
        if(this.board[i][j] == 0 && this.board[i][j-1] != 0){
          this.board[i][j] = this.board[i][j-1];
  				this.board[i][j-1] = 0;
          j = size;
        }
      }
    }
  }



  combine1(){
    for(var i = 0; i < size; i++){
      for(var j = size-1; j > 0; j--){
        if(this.board[i][j] == this.board[i][j-1]){
          this.board[i][j] = 2 * this.board[i][j-1];
                  this.board[i][j-1] = 0;
          j--;
        }
      }
    }
  }



  slide2(){
    for(var i = 0; i < size; i++){
      for(var j = 0; j < size-1; j++){
        if(this.board[j][i] == 0 && this.board[j+1][i] != 0){
          this.board[j][i] = this.board[j+1][i];
  				this.board[j+1][i] = 0;
          j = -1;
        }
      }
    }
  }



  combine2(){
    for(var i = 0; i < size; i++){
      for(var j = 0; j < size-1; j++){
        if(this.board[j][i] == this.board[j+1][i]){
          this.board[j][i] = 2 * this.board[j+1][i];
                  this.board[j+1][i] = 0;
          j++;
        }
      }
    }
  }

  slide3(){
    for(var i = 0; i < size; i++){
      for(var j = size-1; j > 0; j--){
        if(this.board[j][i] == 0 && this.board[j-1][i] != 0){
          this.board[j][i] = this.board[j-1][i];
  				this.board[j-1][i] = 0;
          j = size;
        }
      }
    }
  }

  combine3(){
    for(var i = 0; i < size; i++){
      for(var j = size-1; j > 0; j--){
        if(this.board[j][i] == this.board[j-1][i]){
          this.board[j][i] = 2 * this.board[j-1][i];
                  this.board[j-1][i] = 0;
          j--;
        }
      }
    }
  }

}
