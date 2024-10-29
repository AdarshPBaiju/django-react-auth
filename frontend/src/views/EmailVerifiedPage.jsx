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
                setMessage(response.message);
            };
            verifyUserEmail();
        }
    }, [uid, token]);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card text-center p-4" style={{ width: '24rem' }}>
                <div className="card-body">
                    {loading ? (
                        <p className="card-text">Verifying...</p>
                    ) : (
                        <div>
                            <h2 className="card-title">{message}</h2>
                            {message.includes("successfully") && (
                                <Link to="/login" className="btn btn-primary mt-3">
                                    Go to Login
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailVerifiedPage;
