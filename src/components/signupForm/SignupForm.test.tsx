import { render } from '@testing-library/react';
import SignupForm from './SignupForm';
import { EmailErrors } from '../../screens/signup/Signup.utils'

describe('<SignupForm />', () => {
  const props = {
    emailValue: 'test@test.com',
    handleInput: () => {},
    handleSumbit: () => {}
  }

  it('renders without crashing', () => {
    render(<SignupForm {...props}/>);
  });

  test('renders with email label, input, no initial error and submit', () => {
    const { container, getByLabelText, getByRole, getByText, queryByText } = render(<SignupForm  {...props}/>);
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();

    const label = getByText('Email');
    expect(form?.firstChild).toBe(label);

    const input = getByLabelText('Email');
    expect(form?.children[1]).toBe(input);
    
    const error = queryByText(EmailErrors.EmailRequired);
    expect(error).not.toBeInTheDocument();

    const sumbit = getByRole('button');
    expect(form?.lastChild).toBe(sumbit);
  });

  test('input has value, aria label and description', () => {
    const { getByLabelText } = render(<SignupForm  {...props}/>);
    const input = getByLabelText('Email') as HTMLInputElement;
    expect(input).toHaveAccessibleDescription('Please enter your email address');
    expect(input.value).toBe('test@test.com');
  });

  test('error displays if passed in props', () => {
    const emailError = EmailErrors.EmailRequired;
    const { getByText } = render(<SignupForm {...{...props, emailError }}/>);
    const error = getByText(emailError);
    expect(error).toBeInTheDocument();
  });
});
