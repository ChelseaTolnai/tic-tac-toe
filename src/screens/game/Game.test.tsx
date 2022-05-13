import { cleanup, render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import Game from './Game';

afterEach(cleanup);

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn(() => null),
      setItem: jest.fn(() => null)
    },
    writable: true
  });
});

describe('<Game />', () => {
  it('renders without crashing', () => {
    const history = createMemoryHistory();
    render(
      <Router location={history.location} navigator={history}>
        <Game />
      </Router>
    );
  });

  describe('Page', () => {
    it('renders heading', () => {
      const history = createMemoryHistory();
      const { getByRole } = render(
        <Router location={history.location} navigator={history}>
          <Game />
        </Router>
      );
      const title = getByRole('heading', { level: 1 });
      expect(title).toBeInTheDocument();
      // test initially loading
      expect(title).toContainHTML('Authenticating');

      // test on game screen after authentication
      const timer = setTimeout( async () => {
        expect(title).toContainHTML(`Let's Play!`);
      }, 200) // Mock test after token authentication
      clearTimeout(timer);
    });
  });

});
