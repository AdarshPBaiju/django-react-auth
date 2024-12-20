/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const Dashboard = () => {
  const [response, setResponse] = useState('');
  const [text, setText] = useState('');
  const { logoutUser, isRefreshTokenExpired } = useContext(AuthContext);

  const getAuthTokens = () => {
    const tokens = JSON.parse(localStorage.getItem('authTokens'));
    return tokens ? tokens : { access: '', refresh: '' };
  };

  const authTokens = getAuthTokens();

  const fetchData = async () => {
    if (!authTokens.access) {
      setResponse("No access token found.");
      return;
    }
    // if (isRefreshTokenExpired(authTokens.refresh)) {
    //   console.log("Refresh token expired.");
    //   logoutUser("Session Expired Pls Login Again 1"); // Call logoutUser if the refresh token is expired
    //   return; // Exit the function to prevent further actions
    // }

    try {
      const result = await axios.get('http://127.0.0.1:8000/api/dashboard/', {
        headers: {
          'Authorization': `Bearer ${authTokens.access}`,
        },
      });
      setResponse(result.data.response);
    } catch (error) {
      setResponse("Failed to fetch data. Please try again.");
    }
  };

  useEffect(() => {
      fetchData();
  },[]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authTokens.access) {
      setResponse("No access token found.");
      return;
    }
    if (isRefreshTokenExpired(authTokens.refresh)) {
      console.log("Refresh token expired.");
      logoutUser("Session Expired Pls Login Again 3"); // Call logoutUser if the refresh token is expired
      return; // Exit the function to prevent further actions
    }

    try {
      console.log("Submitting text:", text);
      const result = await axios.post('http://127.0.0.1:8000/api/dashboard/', { text }, {
        headers: {
          'Authorization': `Bearer ${authTokens.access}`,
        },
      });
      console.log("Text submitted. Response:", result.data.response);
      setResponse(result.data.response);
    } catch (error) {
      console.error("Error submitting text:", error);
      setResponse("Failed to submit text. Please try again.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="card" style={{ width: '25rem' }}>
        <div className="card-body text-center">
          <h1 className="card-title">Dashboard</h1>
          <p>{response}</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="form-control"
                placeholder="Enter your text"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
