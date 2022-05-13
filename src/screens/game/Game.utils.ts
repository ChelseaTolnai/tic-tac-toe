import axios, { AxiosResponse } from 'axios';
import { AIServer, AIServerPlayResp } from '../../server/server';
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
  if (rowIndex === colIndex) { d1Tally[playerIndex]++; }; // is in "\" diagnal for positions at [row, col] of [0,0] & [1,1] & [2,2]
  if (rowIndex + colIndex === 2) { d2Tally[playerIndex]++; }; // is in "/" diagnal for positions at [row, col] of [0,2] & [1,1] & [2,0]
  if ( rowTally[playerIndex][rowIndex] === 3
    || colTally[playerIndex][colIndex] === 3
    || d1Tally[playerIndex] === 3
    || d2Tally[playerIndex] === 3
  ) { return true; }
  return false;
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
    }
  }));
  return aiPos;
}

export const getAIPlayResponse = async (board: BoardType): Promise<BoardType> => {
  try {
    const token = sessionStorage.getItem('tictactoe');
    if (!token) { throw new Error('missing token'); }

    const headers = { Authorization: `bearer ${token}` };
    const response: AxiosResponse<AIServerPlayResp> = await axios.post(`${AIServer}/engine`, { board }, { headers });
    if (response?.data?.success && response?.data?.board) {
      return response?.data?.board;
    } else {
      throw new Error();
    }
  } catch (e) {
    // Return original board back to user. Will check if original board matches and will provide user generic error
    return board;
  }
};