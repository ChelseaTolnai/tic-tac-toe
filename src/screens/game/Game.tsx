import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '../screenWrapper/ScreenWrapper';
import Board, { BoardType } from '../../components/board/Board';
import Loading from '../../components/loading/Loading';

const Game = () => {
  const navigate = useNavigate();
  const [authIsLoading, setAuthLoading] = useState(true);
  const [playIsLoading, setPlayLoading] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('tictactoe');
    if (!token) { 
      navigate('/signup');
    } else {
      setAuthLoading(false);
    }
  }, [navigate]);

  const board: BoardType  = [
    [ 'X', 'X', '' ],
    [ 'O', 'O', 'X' ],
    [ 'O', '', 'X' ]
  ];

  const onSquareClick = () => {
    setPlayLoading(true);
    setTimeout(() => setPlayLoading(false), 1000);
  };

  return (
    <ScreenWrapper title={authIsLoading ? 'Authenticating' : `Let's Play!`}>
      {(authIsLoading || playIsLoading) ? <Loading/> : (
        <Board 
          board={board}
          onSquareClick={onSquareClick}
        />
      )}
    </ScreenWrapper>
  );
};

export default Game;