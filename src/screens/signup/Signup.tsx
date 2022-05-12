import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '../screenWrapper/ScreenWrapper';
import SignupForm from '../../components/signupForm/SignupForm';
import Loading from '../../components/loading/Loading';
import { authenticateUser, EmailErrors, validateEmail } from './Signup.utils';

const Signup = () => {
  const [emailValue, setEmailValue] = useState('');
  const [emailError, setEmailError] = useState<EmailErrors | undefined>(undefined);
  const [authIsLoading, setAuthLoading] = useState(false);
  const navigate = useNavigate();

  // Use React to write the form as a controlled component and handle email input
  const handleInput = (event: React.ChangeEvent): void => {
    setEmailValue((event.target as HTMLInputElement).value);
  };

  // Custom form validation
  const handleSumbit = async (event: React.FormEvent | React.MouseEvent): Promise<void> => {
    // prevent user agent default actions
    event.preventDefault();
    // 1st validate if email error before hitting API
    const validationError = validateEmail(emailValue);
    // if validation error set error message
    validationError !== emailError && setEmailError(validationError); // will set error string or undefined if no error

    if (validationError) {
      // if email error refocus user to input to re-enter email
      document.getElementById('emailInput')?.focus();
    } else {
      setAuthLoading(true);
      // if no email validation error hit /auth API to receive token
      const authError = await authenticateUser(emailValue); // returns error string or undefined if no error
      // if authentication error set error message
      authError !== emailError && setEmailError(authError);

      // if no email validation or authentication error go to main page to play
      if (!authError) {
        navigate('/');
      }
      setAuthLoading(false);
    }
  };

  return (
    <ScreenWrapper title={authIsLoading ? 'Authenticating' : 'Sign Up'}>
      {authIsLoading ? <Loading/> : (
        <SignupForm
          emailError={emailError}
          emailValue={emailValue}
          handleInput={handleInput}
          handleSumbit={handleSumbit}
        />
      )}
    </ScreenWrapper>
  );
};

export default Signup;