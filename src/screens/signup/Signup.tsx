import React, { useState } from 'react';
import ScreenWrapper from '../screeWrapper/ScreenWrapper';
import SignupForm from '../../components/signupForm/SignupForm';
import { EmailErrors, validateEmail } from './Signup.utils';

const Signup = () => {
  const [emailValue, setEmailValue] = useState('');
  const [emailError, setEmailError] = useState<EmailErrors | undefined>(undefined);

  // Use React to write the form as a controlled component and handle email input
  const handleInput = (event: React.ChangeEvent): void => {
    setEmailValue((event.target as HTMLInputElement).value);
  };

  // Custom form validation
  const handleSumbit = (event: React.FormEvent | React.MouseEvent): void => {
    // prevent user agent default actions
    event.preventDefault();
    // 1st validate if email error before hitting API
    const error = validateEmail(emailValue);
    setEmailError(error); // will set error string or undefined if no error

    if (error) {
      // if email error refocus user to input to re-enter email
      document.getElementById('emailInput')?.focus();
    }
  };

  return (
    <ScreenWrapper title={'Sign Up'}>
      <SignupForm
        emailError={emailError}
        emailValue={emailValue}
        handleInput={handleInput}
        handleSumbit={handleSumbit}
      />
    </ScreenWrapper>
  );
};

export default Signup;