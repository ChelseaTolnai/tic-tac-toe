import { Link } from 'react-router-dom';
import ScreenWrapper from '../screenWrapper/ScreenWrapper';

const NotFound = () => (
  <ScreenWrapper title={'Page Not Found'}>
    <Link to='/' className='link-secondary'>Play Tic Tac Toe</Link>
  </ScreenWrapper>
);

export default NotFound;