import { fireEvent, render } from '@testing-library/react';
import Board, { BoardType } from './Board';

describe('<Board />', () => {
  const board: BoardType = [
    [ 'X', 'X', '' ],
    [ 'O', 'O', 'X' ],
    [ 'O', '', 'X' ]
  ];
  const props = {
    board,
    onSquareClick: () => {}
  }

  it('renders without crashing', () => {
    render(<Board {...props}/>);
  });

  test('renders correct number of rows and squares', () => {
    render(<Board {...props}/>);

    const rows = document.getElementsByClassName('row');
    expect(rows.length).toBe(3);

    const squares = document.getElementsByClassName('square');
    expect(squares.length).toBe(9);
  });

  test('renders correct number of taken squares', () => {
    render(<Board {...props}/>);
    const squares = document.getElementsByClassName('square-taken');
    expect(squares.length).toBe(7);
  });

  test('on square hover the square, row and col are highlightes', () => {
    render(<Board {...props}/>);
    const squares = document.getElementsByClassName('square');
    const square = squares[0]; // Example first square at first row and first col
    fireEvent.mouseOver(square);
    const squaresToHighlight = [0, 1, 2, 3, 6]; // all indexed square that are in same row and col

    // squares should be highlighted
    squaresToHighlight.forEach(i => expect(squares[i]).toHaveClass('bg-primary'));

    // square that should not be highlight
    expect(squares[4]).not.toHaveClass('bg-primary'); 
  });

});
