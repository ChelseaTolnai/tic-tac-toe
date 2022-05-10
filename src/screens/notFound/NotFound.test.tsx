import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from './NotFound';

describe('<NotFound />', () => {
  it('renders without crashing', () => {
    render(<NotFound />, { wrapper: MemoryRouter });
  });
});
