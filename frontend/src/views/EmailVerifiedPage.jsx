/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const EmailVerifiedPage = () => {
    const { uid, token } = useParams();
    const { verifyEmail, loading } = useContext(AuthContext);
    const [message, setMessage] = useState('');
    const hasVerifiedRef = useRef(false);

    useEffect(() => {
        hasVerifiedRef.current = false; 
    }, [uid, token]);

    useEffect(() => {
        if (uid && token && !hasVerifiedRef.current) {
            const verifyUserEmail = async () => {
                hasVerifiedRef.current = true;
                const response = await verifyEmail(uid, token);
                setMessage(response.message); // Set the message based on the response
            };
            verifyUserEmail();
        }
    }, [uid, token]);

    return (
        <div className="verification-container mt-5 mb-5">
            {loading ? (
                <p>Verifying...</p>
            ) : (
                <div className='mt-5'>
                    <h2 className='mt-5'>{message}</h2>
                    {message.includes("successfully") && (
                        <Link to="/login" className="go-to-login-link">
                            Go to Login
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default EmailVerifiedPage;
