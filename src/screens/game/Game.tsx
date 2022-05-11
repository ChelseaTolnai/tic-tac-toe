import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '../screeWrapper/ScreenWrapper';

const Game = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('tictactoe');
    if (!token) { 
      navigate('/signup');
    };
  });

  return (
    <ScreenWrapper title={`Let's Play!`}>
      <div>Board</div>
    </ScreenWrapper>

  );
};

export default Game;