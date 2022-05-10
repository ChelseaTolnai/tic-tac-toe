import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { MemoryRouter, Router } from 'react-router-dom';
import App from './App';

describe('<App />', () => {
  it('renders without crashing', () => {
    render(<App />, { wrapper: MemoryRouter });
  });

  test('displays header and game screen on default path /', () => {
    render(<App />, { wrapper: MemoryRouter });
    expect(screen.getByText('Tic Tac Toe')).toBeInTheDocument;
    expect(screen.getByText('Game')).toBeInTheDocument;
  });

  test('displays header and signup screen on /signup path', () => {
    const history = createMemoryHistory();
    history.push('/signup');
    render(
      <Router location={history.location} navigator={history}>
        <App />
      </Router>
    );
    expect(screen.getByText('Tic Tac Toe')).toBeInTheDocument;
    expect(screen.getByText('Signup')).toBeInTheDocument;
  });

  test('displays header and not found page on any invalid path location', () => {
    const history = createMemoryHistory();
    history.push('/invalidPath');
    render(
      <Router location={history.location} navigator={history}>
        <App />
      </Router>
    );
    expect(screen.getByText('Tic Tac Toe')).toBeInTheDocument;
    expect(screen.getByText('Page Not Found')).toBeInTheDocument;
  });
});
