import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import NotFound from './NotFound';

describe('<NotFound />', () => {
  it('renders without crashing', () => {
    render(<NotFound />, { wrapper: MemoryRouter });
  });

  test('Page Not Found heading renders', () => {
    render(<NotFound />, { wrapper: MemoryRouter });
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toBeInTheDocument;
    expect(title).toContainHTML('Page Not Found');
  });

  test('Play link renders as anchor tag and goes to main page on click', () => {
    const history = createMemoryHistory();
    history.push('/invalidPath');
    render(
      <Router location={history.location} navigator={history}>
        <NotFound />
      </Router>
    );
    const playLink = screen.getByRole('link');
    expect(playLink).toBeInTheDocument;
    expect(playLink).toContainHTML('Play Tic Tac Toe');
    expect(playLink).toHaveAttribute('href', '/');

    // Click Logo Text link
    fireEvent.click(playLink);
    expect(playLink).not.toBeInTheDocument;
    expect(history.location.pathname).toEqual('/');
  });
});
