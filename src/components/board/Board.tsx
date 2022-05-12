import { useState } from 'react';
import './Board.css';
import Square, { SquarePosition } from './BoardSquare';

export type BoardType = ('X' | 'O' | '')[][];

interface BoardProps {
  board: BoardType;
  onSquareClick: () => void;
}

const Board = (props: BoardProps) => {
  const [squareHovered, setSquareHovered] = useState({row: -1, col: -1});

  const onSquareHover = (square: SquarePosition) => {
    setSquareHovered(square);
  };

  const offSquareHover = () => {
    setSquareHovered({ row: -1, col: -1 });
  };

  return (
    <div className='container mt-5'>
      {
        props.board.map((rowVals, row) => (
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
              />
            ))}
          </div>
        ))
      }
    </div>
  );
};

export default Board;