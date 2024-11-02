
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'

function Navbar () {
  const { user, logoutUser, isAuthenticated } = useContext(AuthContext)

  const handleLogout = () => {
    logoutUser() 
  }
  return (
    <>
      <nav className='navbar navbar-expand-lg navbar-dark fixed-top bg-dark'>
        <div className='container-fluid'>
          <a className='navbar-brand' href='#'>
            <img
              style={{ width: '100px', height: '40px', objectFit: 'contain' }}
              src='https://i.imgur.com/juL1aAc.png'
              alt='Brand Logo'
            />
          </a>
          <button
            className='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarNav'
            aria-controls='navbarNav'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse' id='navbarNav'>
            <ul className='navbar-nav'>
              <li className='nav-item'>
                <Link className='nav-link active' aria-current='page' to='/'>
                  Home
                </Link>
              </li>
              {!isAuthenticated && (
                <>
                  <li className='nav-item'>
                    <Link
                      className='nav-link active'
                      aria-current='page'
                      to='/login'
                    >
                      Login
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <Link
                      className='nav-link active'
                      aria-current='page'
                      to='/register'
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
              {isAuthenticated  && (
                <>
                  <li className='nav-item'>
                    <Link
                      className='nav-link active'
                      aria-current='page'
                      to='/dashboard'
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <Link
                      className='nav-link active'
                      aria-current='page'
                      to='/common'
                    >
                      {user && user.role ? user.role : 'Role not assigned'}
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <Link
                      className='nav-link active'
                      aria-current='page'
                      to='/admin'
                    >
                      admin
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <Link
                      className='nav-link active'
                      aria-current='page'
                      to='/user'
                    >
                      user
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <button className='btn btn-primary' onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
