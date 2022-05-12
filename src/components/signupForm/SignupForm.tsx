import { EmailErrors } from '../../screens/signup/Signup.utils'

interface SignupFormProps {
  emailError?: EmailErrors;
  emailValue: string;
  handleInput: (event: React.ChangeEvent) => void;
  handleSumbit: (event: React.FormEvent | React.MouseEvent) => void;
}

const SignupForm = (props: SignupFormProps) => (
  <div className='row justify-content-center m-3 mt-5'>
    <form
      name='emailForm'
      noValidate // overrides bootstrap and browser default validation
      className='border border-secondary rounded p-3 col col-md-8 col-lg-6 col-xl-4'
      onSubmit={props.handleSumbit}
    >
      <label className='form-label' id='emailLabel'>Email</label>
      <input
        type='email'
        name='email'
        id='emailInput'
        aria-labelledby='emailLabel'
        aria-describedby='emailDesc'
        required
        className='form-control'
        onChange={props.handleInput}
        value={props.emailValue}
      />
      <div id='emailDesc' className='form-text'>
        Please enter your email address
      </div>
      {/* set aria live region around error for screen reader to announce alert why form not sumbitted */}
      <div aria-live='polite'> 
        {props.emailError &&
          <div className='form-text text-danger'>
            {props.emailError}
          </div>
        }
      </div>
      <button type='submit' className='w-100 btn btn-primary mt-3' onClick={props.handleSumbit}>Sign up</button>
    </form>
  </div>
);

export default SignupForm;