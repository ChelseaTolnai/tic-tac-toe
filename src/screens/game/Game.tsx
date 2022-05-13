import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cloneDeep, isEqual } from 'lodash';
import ScreenWrapper from '../screenWrapper/ScreenWrapper';
import Loading from '../../components/loading/Loading';
import Board, { BoardType } from '../../components/board/Board';
import { SquarePosition } from '../../components/board/BoardSquare';
import { checkIfWinner, getAIPlayPosition, getAIPlayResponse, resetTally } from './Game.utils';

let gameMoves = 0;

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

  const initBoard: BoardType = [['', '', ''], ['', '', ''], ['', '', '']];
  const [board, setBoard] = useState(initBoard);
  const [disabled, setDisabled] = useState(false);
  const [results, setGameResults] = useState('');
  const [playIsLoading, setPlayLoading] = useState(false);
  const [error, setAIError] = useState(false);

  const onSquareClick = async (squarePosition: SquarePosition) => {
    setAIError(false); // reset any previous error

    // 1) Update board state with user's choice.
    const { row, col } = squarePosition;
    const originalBoard = cloneDeep(board); // Saving in case of error hittin AI will reset board to last move so user can try again
    const userBoard = cloneDeep(board); // We do not want to mutate state board array directly so copy nested array board first.
    userBoard[row][col] = 'X'; // Create what new board value will be. User will always be 'X';
    gameMoves++;
    setBoard(userBoard);
    setDisabled(true); // immediately set board disabled so user can't select two options in 300ms before hitting AI

    // No need to check for winner or hit AI if last move as it's automatically a DRAW
    if (gameMoves === 9) {
      setGameResults('Draw');
    } else {
      // 2) Update our Tally Counts for position of User (index of 0) and check if winner
      if (checkIfWinner(0, row, col)) {
        setGameResults('You win');
      } else {
        // 3) Update board state with AI's choice after user has selected.
        const timer = setTimeout(async () => {

          setPlayLoading(true); // Set loading state while awaiting AI
          const aiBoard = await getAIPlayResponse(userBoard);
          gameMoves++;
          setBoard(aiBoard);
          setDisabled(false); // Reset board to be enabled again
          aiBoard && setPlayLoading(false); // Remove loading state after response received

          // Check to make sure there was not an error when hitting AI. Util call will return userBoard as is on error.
          if (isEqual(aiBoard, userBoard)) {
            // If error, set board to last play so user can re-attempt
            setAIError(true);
            gameMoves--;
            setBoard(originalBoard);
          } else {
            // If no error, get position of AI player's new move
            const aiPos = getAIPlayPosition(aiBoard, userBoard);
            // 4) Update our Tally Counts for position of AI (index of 1) and check if winner
            if (checkIfWinner(1, aiPos.row, aiPos.col)) {
              setGameResults('AI win');
            }
          }
        }, 300); // This allows some time for user to see their selection before starting loading state and calling AI server
        return () => clearTimeout(timer);
      }
    };
  };

  const resetBoard = () => {
    gameMoves = 0;
    resetTally();
    setDisabled(false);
    setGameResults('');
    setBoard(initBoard);
  }

  return (
    <ScreenWrapper title={authIsLoading ? 'Authenticating' : `Let's Play!`}>
      {(authIsLoading || playIsLoading) ? <Loading /> : (
        <>
          <Board
            board={board}
            disabled={!!results || disabled}
            onSquareClick={onSquareClick}
          />
          {error && <div className={'text-danger my-3'}>Something went wrong, please try again.</div>}
          {results && (
            <>
              <h2 className='mt-3 fw-bold'>{results}</h2>
              <button className='btn btn-primary mt-3 fs-4' onClick={resetBoard}>New Game</button>
            </>
          )}
        </>
      )}
    </ScreenWrapper>
  );
};

export default Game;