/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function EnterNewPasswordPage() {
    const { verifyResetPasswordLink, updatePassword, showErrorAlert } = useContext(AuthContext);
    const { uid, token } = useParams();
    const [isValidLink, setIsValidLink] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const hasVerifiedRef = useRef(false);


    useEffect(() => {
        hasVerifiedRef.current = false; 
    }, [uid, token]);


    useEffect(() => {
        const verifyLink = async () => {
            const isValid = await verifyResetPasswordLink(uid, token);
            setIsValidLink(isValid);
            setLoading(false);
        }
        if (uid && token && !hasVerifiedRef.current) {
            hasVerifiedRef.current = true;
            verifyLink();
        }
    }, [uid, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (newPassword === confirmPassword) {
            setLoading(true);
            try {
                await updatePassword(uid, token, newPassword, confirmPassword);
            } catch (error) {
                showErrorAlert('Failed to update password. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            showErrorAlert('Passwords do not match');
        }
    }

    return (
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
                                        {loading ? (
                                            <div>Loading...</div>
                                        ) : isValidLink ? (
                                            <form onSubmit={handleSubmit}>
                                                <div className='d-flex align-items-center mb-3 pb-1'>
                                                    <i
                                                        className='fas fa-lock fa-2x me-3'
                                                        style={{ color: '#ff6219' }}
                                                    ></i>
                                                    <span className='h2 fw-bold mb-0'>
                                                        Set a New Password
                                                    </span>
                                                </div>

                                                <h5 className='fw-normal mb-3 pb-3' style={{ letterSpacing: '1px' }}>
                                                    Please enter your new password
                                                </h5>

                                                <div className='form-outline mb-4'>
                                                    <input
                                                        type='password'
                                                        id='newPassword'
                                                        className='form-control form-control-lg'
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        disabled={loading} // Disable input when loading
                                                    />
                                                    <label className='form-label' htmlFor='newPassword'>
                                                        New Password
                                                    </label>
                                                </div>

                                                <div className='form-outline mb-4'>
                                                    <input
                                                        type='password'
                                                        id='confirmPassword'
                                                        className='form-control form-control-lg'
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        disabled={loading} // Disable input when loading
                                                    />
                                                    <label className='form-label' htmlFor='confirmPassword'>
                                                        Confirm Password
                                                    </label>
                                                </div>

                                                <div className='pt-1 mb-4'>
                                                    <button
                                                        className='btn btn-dark btn-lg btn-block'
                                                        type='submit'
                                                        disabled={loading} // Disable button when loading
                                                    >
                                                        {loading ? 'Loading...' : 'Update Password'}
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className='text-danger'>
                                                The reset link is invalid or has expired. 
                                                <br />
                                                <Link to="/" className='text-decoration-none text-primary'>
                                                    Go back to Home
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default EnterNewPasswordPage;
