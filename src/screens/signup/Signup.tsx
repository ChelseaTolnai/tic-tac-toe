import ScreenWrapper from '../screeWrapper/ScreenWrapper';

const Signup = () => (
  <ScreenWrapper title={'Sign Up'}>
    <div className='row justify-content-center m-3'>
      <form className='border border-secondary rounded p-3 col col-md-8 col-lg-6 col-xl-4'>
        <label className='form-label' id='emailLabel'>Email</label>
        <input
          type='email'
          name='email'
          id='email'
          aria-labelledby='emailLabel'
          aria-describedby='emailDesc'
          required
          className='form-control'
        />
        <div id='emailDesc' className='form-text mb-3'>
          Please enter your email address
        </div>
        <button type='submit' className='w-100 btn btn-primary'>Sign up</button>
      </form>
    </div>
  </ScreenWrapper>
);

export default Signup;