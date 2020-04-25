(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    clearRowAndBelow: function(coordinate){
      const board = this.attributes
      const row = coordinate[0]
      const col = coordinate[1];
      for (let key in board){
        if (key !== 'n'){
          key = Number(key)
        }
        if (key >= row && key !== 'n'){
          var array = board[key]
          for (let i = 0; i < array.length; i++){
            array[i] = 0;
          }
        }
      }
      board[row][col]===1 ? board[row][col] = 0: board[row][col] = 1;
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex; //gives column number for piece that is in the first row that is on the current coordinate's major diagonal line; tells where to start diagonal check
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      //check if there are any
      var board = this.attributes;
      var row = board[rowIndex];
      var count = _.reduce(row, function(acc, next) {return acc + next}, 0);
      if (count > 1) {
        return true;
      } else {
        return false;
      }
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      //loop through the board's attributes, and run rowConflict on the value
      var board = this.attributes;
      for (let i = 0; i < board.n; i++) {
        if (typeof board[i] !== 'number') {
          if (this.hasRowConflictAt(i)) {
            return true;
          }
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var board = this.attributes;
      var col = [];
      for (let key = 0; key < board.n; key++) {
        col.push(board[key][colIndex]);
      }
      var count = _.reduce(col, function(acc, next) {return acc + next}, 0);
      if (count > 1) {
        return true;
      } else {
        return false;
      }
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      //convert board into array of arrays
      var board = this.attributes;
      var columns = [];
      for (let i = 0; i < board.n; i++) {
        var col = [];
        for (let key = 0; key < board.n; key++) {
          col.push(board[key][i]);
        }
        columns.push(col);
      }
      for (let j = 0; j < columns.length; j++) {
        if (this.hasColConflictAt(j)) {
          return true;
        }
      }
      return false;
    },

    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    hasMajorDiagonalConflictAt: function(startCoordinate) {
      var board = this.attributes;
      var currRow = 0;
      var currCol = startCoordinate;
      var count = 0;
      //start at start coordinate
      for (let i = 0; i <= board.n; i++) {
        if (currCol < 0) {
          currRow += 1;
          currCol += 1;
        }
        if ((currRow === board.n) || (currCol === board.n)) {
          if (count > 1) {
            return true;
          }
          return false;
        } else {
          if (board[currRow][currCol] === 1) {
            count+= 1;
          }
        }
        currRow += 1;
        currCol += 1;
      }
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var board = this.attributes;
      for (let i = 0; i < board.n; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (board[i][j] === 1) {
            var startColumn = this._getFirstRowColumnIndexForMajorDiagonalOn(i, j);
            if (this.hasMajorDiagonalConflictAt(startColumn)) {
              return true;
            }
          }
        }
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(startCoordinate) {
      var board = this.attributes;
      var currRow = 0;
      var currCol = startCoordinate;
      var count = 0;
      //start at start coordinate
      for (let i = 0; i < board.n+1; i++) {
        if (currCol >= board.n) {
          currRow += 1;
          currCol -= 1;
        }
        if ((currRow === board.n) || (currCol < 0)) {
          if (count > 1) {
            return true;
          }
          return false;
        }
        if (board[currRow][currCol] === 1) {
          count+= 1;
        }
        currRow += 1;
        currCol -= 1;
      }
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var board = this.attributes;
      for (let i = 0; i < board.n; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (board[i][j] === 1) {
            var startColumn = this._getFirstRowColumnIndexForMinorDiagonalOn(i, j);
            if (this.hasMinorDiagonalConflictAt(startColumn)) {
              return true;
            }
          }
        }
      }
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/
  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
