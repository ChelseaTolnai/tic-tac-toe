import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => (
  <header className='py-2 bg-dark container-fluid'>
    <div className='row'>
      <Link to='/' className='col col-auto'>
        <div className='row align-items-center'>
          <div className='col'>
            <img
              src={require('../../images/logo.png')}
              alt={''} // Decorative only
              width={50}
              height={50}
              className='img-thumbnail'
            />
          </div>
          <div className='col col-auto p-0 nav-link fs-2 fw-bold lh-1'>
            TicTacToe
          </div>
        </div>
      </Link>
      <div className='col'></div>
    </div>
  </header>
);

export default Header;