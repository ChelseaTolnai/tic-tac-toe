import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cloneDeep, isEqual } from 'lodash';
import ScreenWrapper from '../screenWrapper/ScreenWrapper';
import Loading from '../../components/loading/Loading';
import Board, { BoardType } from '../../components/board/Board';
import { SquarePosition } from '../../components/board/BoardSquare';
import { getAIPlayResponse } from './Game.utils';

const Game = () => {
  const navigate = useNavigate();
  const [authIsLoading, setAuthLoading] = useState(true);
  useEffect(() => {
    const token = sessionStorage.getItem('tictactoe');
    if (!token) { 
      navigate('/signup');
    } else {
      setAuthLoading(false);
    }
  }, [navigate]);

  const initBoard: BoardType = [['','',''], ['','',''], ['','','']];
  const [board, setBoard] = useState(initBoard);
  const [disabled, setDisabled] = useState(false);
  const [playIsLoading, setPlayLoading] = useState(false);
  const [error, setAIError] = useState(false);

  const onSquareClick = async (squarePosition: SquarePosition) => {
    setAIError(false); // reset any previous error

    // 1) Update board state with user's choice.
    const { row, col } = squarePosition;
    const originalBoard = cloneDeep(board); // Saving in case of error hittin AI will reset board to last move so user can try again
    const userBoard = cloneDeep(board); // We do not want to mutate state board array directly so copy nested array board first.
    userBoard[row][col] = 'X'; // Create what new board value will be. User will always be 'X';
    setBoard(userBoard);
    setDisabled(true); // immediately set board disabled so user can't select two options in 300ms before hitting AI

    // 2) Update board state with AI's choice after user has selected.
    const timer = setTimeout( async () => {
      setPlayLoading(true); // Set loading state while awaiting AI
      const aiBoard = await getAIPlayResponse(userBoard);
      setBoard(aiBoard);
      setDisabled(false); // Reset board to be enabled again
      aiBoard && setPlayLoading(false); // Remove loading state after response received

      // Check to make sure there was not an error when hitting AI. If so set board to last play so user can re-attempt
      if (isEqual(userBoard, aiBoard)) {
        setAIError(true);
        setBoard(originalBoard);
      }
    }, 300) // This allows some time for user to see their selection before calling AI server.
    return () => clearTimeout(timer);
  };

  return (
    <ScreenWrapper title={authIsLoading ? 'Authenticating' : `Let's Play!`}>
      {(authIsLoading || playIsLoading) ? <Loading/> : (
        <>
          <Board 
            board={board}
            disabled={disabled}
            onSquareClick={onSquareClick}
          />
          {error && <div className={'text-danger my-3'}>Something went wrong, please try again.</div>}
        </>
      )}
    </ScreenWrapper>
  );
};

export default Game;