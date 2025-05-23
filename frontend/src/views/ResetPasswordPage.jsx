import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function ResetPasswordPage() {
  const { resetPassword } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;

    if (email.length > 0) {
      setLoading(true);
      await resetPassword(email);
      setLoading(false);
    }
  };

  return (
    <>
      <section className='vh-100 mt-5'>
        <div className='container py-5 h-100'>
          <div className='row d-flex justify-content-center align-items-center h-100'>
            <div className='col col-xl-10'>
              <div className='card' style={{ borderRadius: '1rem' }}>
                <div className='row g-0'>
                  <div className='col-md-6 col-lg-5 d-none d-md-block'>
                    <img
                      src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp'
                      alt='login form'
                      className='img-fluid h-100'
                      style={{ borderRadius: '1rem 0 0 1rem' }}
                    />
                  </div>
                  <div className='col-md-6 col-lg-7 d-flex align-items-center'>
                    <div className='card-body p-4 p-lg-5 text-black'>
                      <form onSubmit={handleSubmit}>
                        <div className='d-flex align-items-center mb-3 pb-1'>
                          <i
                            className='fas fa-cubes fa-2x me-3'
                            style={{ color: '#ff6219' }}
                          ></i>
                          <div className='d-flex align-items-center mb-3 pb-1'>
                            <i
                              className='fas fa-cubes fa-2x me-3'
                              style={{ color: '#ff6219' }}
                            ></i>
                            <span className='h2 fw-bold mb-0'>
                              Reset Password 👋
                            </span>
                          </div>
                        </div>

                        <h5 className='fw-normal mb-3 pb-3' style={{ letterSpacing: '1px' }}>
                          Enter Email to Reset Password
                        </h5>

                        <div className='form-outline mb-4'>
                          <input
                            type='email'
                            id='form2Example17'
                            className='form-control form-control-lg'
                            name='email'
                            disabled={loading} // Disable input when loading
                          />
                          <label className='form-label' htmlFor='form2Example17'>
                            Email address
                          </label>
                        </div>

                        <div className='pt-1 mb-4'>
                          <button
                            className='btn btn-dark btn-lg btn-block'
                            type='submit'
                            disabled={loading} // Disable button when loading
                          >
                            {loading ? 'Loading...' : 'Reset Password'}
                          </button>
                        </div>
                        <p className='mb-5 pb-lg-2' style={{ color: '#393f81' }}>
                          Already have an account{' '}
                          <Link to='/login' style={{ color: '#393f81' }}>
                            Login here
                          </Link>
                        </p>
                        <a href='#!' className='small text-muted'>
                          Terms of use.
                        </a>
                        <a href='#!' className='small text-muted'>
                          Privacy policy
                        </a>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ResetPasswordPage;
