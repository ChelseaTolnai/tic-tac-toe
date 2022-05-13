import { BoardType } from '../../components/board/Board';
import { SquarePosition } from '../../components/board/BoardSquare';

// Represents [User, AI] where User/AI is a tally of how many squares are in said indexed area
// See Game Page - Logic Notes of README.md for further explaination
let rowTally = [[0, 0, 0], [0, 0, 0]];
let colTally = [[0, 0, 0], [0, 0, 0]];
let d1Tally = [0, 0];
let d2Tally = [0, 0];

export const checkIfWinner = (playerIndex: number, rowIndex: number, colIndex: number): boolean => {
  rowTally[playerIndex][rowIndex]++;
  colTally[playerIndex][colIndex]++;
  if (rowIndex === colIndex) { d1Tally[playerIndex]++; }; // is in "\" diagonal for positions at [row, col] of [0,0] & [1,1] & [2,2]
  if (rowIndex + colIndex === 2) { d2Tally[playerIndex]++; }; // is in "/" diagonal for positions at [row, col] of [0,2] & [1,1] & [2,0]
  if ( rowTally[playerIndex][rowIndex] === 3 // given row reached 3 squares for player
    || colTally[playerIndex][colIndex] === 3 // given column reached 3 squares for player
    || d1Tally[playerIndex] === 3 // given "\" diagonal reached 3 squares for player
    || d2Tally[playerIndex] === 3 // given "/" diagonal reached 3 squares for player
  ) { return true; } // return winner found
  return false; // return no winner yet
};

export const resetTally = () => {
  rowTally = [[0, 0, 0], [0, 0, 0]];
  colTally = [[0, 0, 0], [0, 0, 0]];
  d1Tally = [0, 0];
  d2Tally = [0, 0];
}

export const getAIPlayPosition = (aiBoard: BoardType, userBoard: BoardType): SquarePosition => {
  const aiPos: SquarePosition = { row: -1, col: -1 };
  aiBoard.forEach((row, i) => row.forEach((val, j) => {
    if (userBoard[i][j] !== val) { // find where new ai val exist against user board
      aiPos.row = i;
      aiPos.col = j;
      return;
    }
  }));
  return aiPos;
}
