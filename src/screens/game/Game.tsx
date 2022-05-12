import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '../screenWrapper/ScreenWrapper';
import Board, { BoardType } from '../../components/board/Board';

const Game = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('tictactoe');
    if (!token) { 
      navigate('/signup');
    };
  });

  const board: BoardType  = [
    [ 'X', 'X', '' ],
    [ 'O', 'O', 'X' ],
    [ 'O', '', 'X' ]
  ];
  const onSquareClick = () => console.log('click');

  return (
    <ScreenWrapper title={`Let's Play!`}>
      <Board 
        board={board}
        onSquareClick={onSquareClick}
      />
    </ScreenWrapper>
  );
};

export default Game;