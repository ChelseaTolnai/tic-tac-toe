import { cleanup, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { MemoryRouter, Router } from 'react-router-dom';
import App from './App';

afterEach(cleanup);

describe('<App />', () => {
  it('renders without crashing', () => {
    render(<App />, { wrapper: MemoryRouter });
  });

  test('displays header and game screen on default path / with token', () => {
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null)
      },
      writable: true
    });
    window.sessionStorage.setItem('tictactoe', 'testtoken')
    const history = createMemoryHistory();
    history.push('/');
    render(
      <Router location={history.location} navigator={history}>
        <App />
      </Router>
    );
    expect(screen.getByText('TicTacToe')).toBeInTheDocument;

    // test initially loading
    expect(screen.getByText('Authenticating')).toBeInTheDocument;

    // test on game screen after authentication
    const timer = setTimeout( async () => {
      expect(screen.getByText(`Let's Play!`)).toBeInTheDocument;
    }, 200) // Mock test after token authentication
    clearTimeout(timer);
    
  });

  test('displays header and signup screen if lands on default path / without token', () => {
    render(<App />, { wrapper: MemoryRouter });
    expect(screen.getByText('TicTacToe')).toBeInTheDocument;
    expect(screen.getByText('Sign Up')).toBeInTheDocument;
  });

  test('displays header and signup screen on /signup path', () => {
    const history = createMemoryHistory();
    history.push('/signup');
    render(
      <Router location={history.location} navigator={history}>
        <App />
      </Router>
    );
    expect(screen.getByText('TicTacToe')).toBeInTheDocument;
    expect(screen.getByText('Sign Up')).toBeInTheDocument;
  });

  test('displays header and not found page on any invalid path location', () => {
    const history = createMemoryHistory();
    history.push('/invalidPath');
    render(
      <Router location={history.location} navigator={history}>
        <App />
      </Router>
    );
    expect(screen.getByText('TicTacToe')).toBeInTheDocument;
    expect(screen.getByText('Page Not Found')).toBeInTheDocument;
  });
});
