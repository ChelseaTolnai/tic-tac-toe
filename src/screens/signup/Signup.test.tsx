import { render, screen } from '@testing-library/react';
import Signup from './Signup';

describe('<Signup />', () => {
  it('renders without crashing', () => {
    render(<Signup />);
  });

  describe('Page', () => {
    test('renders heading', () => {
      render(<Signup />);
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toBeInTheDocument;
      expect(title).toContainHTML('Sign Up');
    });
  });

  describe('Form', () => {
    test('renders with email label, input and submit', () => {
      const { container } = render(<Signup />);
      const form = container.querySelector('form');
      expect(form).toBeInTheDocument;
  
      const label = screen.getByText('Email')
      expect(form?.firstChild).toBe(label);
  
      const input = screen.getByLabelText('Email')
      expect(form?.children[1]).toBe(input);

      const sumbit = screen.getByRole('button')
      expect(form?.lastChild).toBe(sumbit);
    });

    test('input has aria label and description', () => {
      render(<Signup />);
      const input = screen.getByLabelText('Email')
      expect(input).toHaveAccessibleDescription('Please enter your email address');
    });
  });
});
