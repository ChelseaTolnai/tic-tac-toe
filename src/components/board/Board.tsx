import { useState } from 'react';
import './Board.css';
import Square, { SquarePosition } from './BoardSquare';

export type BoardType = ('X' | 'O' | '')[][];

export interface BoardProps {
  board: BoardType;
  disabled: boolean;
  onSquareClick: (squarePosition: SquarePosition) => void;
}

const Board = (props: BoardProps) => {
  // Use initial value of -1 to indicate none of the indexed board items are hovered on
  const [squareHovered, setSquareHovered] = useState({ row: -1, col: -1 });

  const onSquareHover = (square: SquarePosition) => {
    setSquareHovered(square);
  };

  const offSquareHover = () => {
    setSquareHovered({ row: -1, col: -1 });
  };

  return (
    <div className='container mt-5'>
      { // map through first set of board array and obtain row index and row values aka columns
        props.board.map((rowVals, row) => (
          // map through nested set of board array and obtain column index and player value
          <div key={`row-${row}`} className='row row-cols-auto justify-content-center'>
            {rowVals.map((squareVal, col) => (
              <Square
                key={`sq-${row}-${col}`}
                squarePosition={{ row, col }}
                value={squareVal}
                isHovered={squareHovered.row === row || squareHovered.col === col}
                onSquareClick={props.onSquareClick}
                onSquareHover={onSquareHover}
                offSquareHover={offSquareHover}
                disabled={props.disabled}
              />
            ))}
          </div>
        ))
      }
    </div>
  );
};

export default Board;