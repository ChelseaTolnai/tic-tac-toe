import { fireEvent, render } from '@testing-library/react';
import Signup from './Signup';
import { EmailErrors } from './Signup.utils'

describe('<Signup />', () => {
  it('renders without crashing', () => {
    render(<Signup />);
  });

  describe('Page', () => {
    it('renders heading', () => {
      const { getByRole } = render(<Signup />);
      const title = getByRole('heading', { level: 1 });
      expect(title).toBeInTheDocument();
      expect(title).toContainHTML('Sign Up');
    });
  });

  describe('Form', () => {
    const validEmail = 'test@test.com';

    describe('Input', () => {
      test('handles input update', () => {
        const { getByLabelText } = render(<Signup />);
        const input = getByLabelText('Email') as HTMLInputElement;
        
        fireEvent.change(input, {target: {value: validEmail}});
        expect(input.value).toBe(validEmail);
  
        fireEvent.change(input, {target: {value: ''}});
        expect(input.value).toBe('');
      });
    });

    describe('Submit', () => {
      test('handle empty email on form submission', () => {
        const { container, getByLabelText, queryByText } = render(<Signup />);
      
        // No error message should initially be displayed
        expect(queryByText(EmailErrors.EmailRequired)).not.toBeInTheDocument();

        // Submit form
        const form = container.querySelector('form');
        form && fireEvent.submit(form);

        // Email required message should display
        expect(queryByText(EmailErrors.EmailRequired)).toBeInTheDocument();

        // Add valid email to input
        const input = getByLabelText('Email') as HTMLInputElement;
        fireEvent.change(input, { target: { value: validEmail }});
        expect(input.value).toBe(validEmail);

        // Submit form again
        form && fireEvent.submit(form);

        // Error message remove
        expect(queryByText(EmailErrors.EmailRequired)).not.toBeInTheDocument();
      });

      test('handle invalid emails on form submission', () => {
        const { getByLabelText, getByRole, queryByText } = render(<Signup />);
        const sumbitBtn = getByRole('button');
        const input = getByLabelText('Email') as HTMLInputElement;

        // No error messages should initially be displayed
        Object.values(EmailErrors).forEach(error => {
          expect(queryByText(error)).not.toBeInTheDocument();
        });

        // Submit empty form. Email required message should display
        fireEvent.click(sumbitBtn);
        expect(queryByText(EmailErrors.EmailRequired)).toBeInTheDocument();

        // Submit form with email missing @ symbol. Email missing @ message should display
        fireEvent.change(input, { target: { value: 'testtest.com' }});
        fireEvent.click(sumbitBtn);
        expect(queryByText(EmailErrors.EmailRequired)).not.toBeInTheDocument();
        expect(queryByText(EmailErrors.EmailMissingAt)).toBeInTheDocument();

        // Submit form with invalid user info in email.
        fireEvent.change(input, {target: {value: '@test.com'}});
        fireEvent.click(sumbitBtn);
        expect(queryByText(EmailErrors.EmailMissingAt)).not.toBeInTheDocument();
        expect(queryByText(EmailErrors.EmailUserInvalid)).toBeInTheDocument();
        fireEvent.change(input, {target: {value: 'test...@test.com'}});
        fireEvent.click(sumbitBtn);
        expect(queryByText(EmailErrors.EmailUserInvalid)).toBeInTheDocument();


        // Submit form with invalid domain info in email.
        fireEvent.change(input, {target: {value: 'test@'}});
        fireEvent.click(sumbitBtn);
        expect(queryByText(EmailErrors.EmailUserInvalid)).not.toBeInTheDocument();
        expect(queryByText(EmailErrors.EmailDomainInvalid)).toBeInTheDocument();
        fireEvent.change(input, {target: {value: 'test@test'}});
        fireEvent.click(sumbitBtn);
        expect(queryByText(EmailErrors.EmailDomainInvalid)).toBeInTheDocument();

        // Submit form with email. No errors should display
        fireEvent.change(input, { target: { value: validEmail }});
        fireEvent.click(sumbitBtn);
        Object.values(EmailErrors).forEach(error => {
          expect(queryByText(error)).not.toBeInTheDocument();
        });
      });
    });
  });
});
