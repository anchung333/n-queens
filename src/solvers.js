/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

window.findNRooksSolution = function(n) {
  var solutions = runN(n, 'rook')
  if (solutions.length === 0) {
    let finalSol = [];
    let emptysolution = new Board({n});
    for (let key in emptysolution.attributes) {
      if (key !== 'n'){
        let sol = emptysolution.attributes[key]
        finalSol.push(sol.slice());
      }
    }
    solution = finalSol;
  } else {
    var solution = solutions[0];
  }
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutions = runN(n, 'rook');

  console.log('Number of solutions for ' + n + ' rooks:', solutions.length);
  return solutions.length;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solutions = runN(n, 'queen')
  if (solutions.length === 0) {
    let finalSol = [];
    let emptysolution = new Board({n});
    for (let key in emptysolution.attributes) {
      if (key !== 'n'){
        let sol = emptysolution.attributes[key]
        finalSol.push(sol.slice());
      }
    }
    solution = finalSol;
  } else {
    var solution = solutions[0];
  }
  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other

window.countNQueensSolutions = function(n) {
  var solutions = runN(n, 'queen')
  // console.log('Number of solutions for ' + n + ' queens:', solutions.length);
  return solutions.length;
};


const runN = function(n, type = 'queen') {
  const board = new Board({n:n});
  const successes = [];
  const traverse = function(board, row){
    if (row === n){
      const copyBoard = []
      const solution = board.attributes;
      for (let key in solution){
        if (key !== 'n'){
          let sol = solution[key]
          copyBoard.push(sol.slice())
        }
      }
      successes.push(copyBoard)
    } else {
      for (let col = 0; col < board.attributes.n; col++ ){
        board.clearRowAndBelow([row, col]);

        if (type === 'queen'){
          if (board.hasAnyQueensConflicts()){
            board.clearRowAndBelow([row, col]);
          } else {
            traverse(board, row + 1)
          }
        }
        else {
          if (board.hasAnyRooksConflicts()){
            board.clearRowAndBelow([row, col]);
          } else {
            traverse(board, row + 1)
          }
        }
      }
    }
  }
  traverse(board, 0)
  return successes;
}