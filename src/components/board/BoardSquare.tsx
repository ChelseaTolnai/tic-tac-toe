// Represents the corresponding indexes from BoardType
export interface SquarePosition { row: number; col: number; }

export interface SquareProps {
  squarePosition: SquarePosition;
  value: string;
  isHovered: boolean;
  disabled: boolean;
  onSquareClick: (squarePosition: SquarePosition) => void;
  onSquareHover: (squarePosition: SquarePosition) => void;
  offSquareHover: (event: React.MouseEvent | React.FocusEvent ) => void;
}

const Square = (props: SquareProps) => {
  const { squarePosition, value, isHovered, disabled, onSquareClick, onSquareHover, offSquareHover } = props;
  const { row, col } = squarePosition;

  const borderRow = ['border-top-0', '', 'border-bottom-0'];
  const borderCol = ['border-start-0', '', 'border-end-0'];

  const squareStylesAll = 'square col m-0 p-0 d-flex fw-bold justify-content-center align-items-center';
  const squareStylesBorder = `border border-dark border-3 ${borderRow[row]} ${borderCol[col]}`;
  const squareStylesHover = !!isHovered && !disabled ? 'bg-primary' : '';
  const squareStylesPlayer = `text-${value === 'X' ? 'primary' : 'secondary'}`;
  const squareStylesTaken = !!value || disabled ? 'square-taken' : '';

  return (
    <button
      id={`square-${row}-${col}`}
      className={`
        ${squareStylesAll}
        ${squareStylesBorder}
        ${squareStylesHover}
        ${squareStylesPlayer}
        ${squareStylesTaken}
      `}
      // disable onClick so user cannot reselect taken square
      // chose not to use disable prop on button so that MouseEvents would still trigger for "disabled" squares
      onClick={!value ? () => onSquareClick(squarePosition) : undefined}
      onFocus={() => onSquareHover(squarePosition)}
      onMouseOver={() => onSquareHover(squarePosition)}
      onMouseLeave={offSquareHover}
      onBlur={offSquareHover}
      disabled={disabled} // only using for the 300 ms delay after user selects before hitting AI
    >
      {value}
    </button>
  );
};

export default Square;