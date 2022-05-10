import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { MemoryRouter, Router } from 'react-router-dom';
import Header from './Header';

describe('<Header />', () => {
  it('renders without crashing', () => {
    render(<Header />, { wrapper: MemoryRouter });
  });

  test('Logo Text link renders as anchor tag', () => {
    render(<Header />, { wrapper: MemoryRouter });
    const logoLink = screen.getByRole('link');
    expect(logoLink).toBeInTheDocument;
    expect(logoLink).toContainHTML('TicTacToe');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  test('Logo Text link goes to main path on click', () => {
    const history = createMemoryHistory();
    history.push('/invalidPath');
    render(
      <Router location={history.location} navigator={history}>
        <Header />
      </Router>
    );
    const logoLink = screen.getByRole('link');
    expect(logoLink).toBeInTheDocument;
    expect(history.location.pathname).toEqual('/invalidPath');

    // Click Logo Text link
    fireEvent.click(logoLink);
    expect(logoLink).toBeInTheDocument;
    expect(history.location.pathname).toEqual('/');
  });
});
