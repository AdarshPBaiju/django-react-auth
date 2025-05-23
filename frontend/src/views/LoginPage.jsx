import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function LoginPage() {
  const { loginUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false); // New loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (email.length > 0) {
      setLoading(true);
      await loginUser(email, password);
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
                              Welcome back 👋
                            </span>
                          </div>
                        </div>

                        <h5 className='fw-normal mb-3 pb-3' style={{ letterSpacing: '1px' }}>
                          Sign into your account
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

                        <div className='form-outline mb-4'>
                          <input
                            type='password'
                            id='form2Example27'
                            className='form-control form-control-lg'
                            name='password'
                            disabled={loading} // Disable input when loading
                          />
                          <label className='form-label' htmlFor='form2Example27'>
                            Password
                          </label>
                        </div>

                        <div className='pt-1 mb-4'>
                          <button
                            className='btn btn-dark btn-lg btn-block'
                            type='submit'
                            disabled={loading} // Disable button when loading
                          >
                            {loading ? 'Loading...' : 'Login'}
                          </button>
                        </div>

                        <Link to='/reset-password' className='small text-muted' style={{ color: '#393f81' }}>
                            forgot password
                          </Link>
                        <p className='mb-5 pb-lg-2' style={{ color: '#393f81' }}>
                          Dont have an account?{' '}
                          <Link to='/register' style={{ color: '#393f81' }}>
                            Register here
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

export default LoginPage;
