/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [response, setResponse] = useState('');
  const [text, setText] = useState('');

  // Function to get auth tokens from localStorage
  const getAuthTokens = () => {
    const tokens = JSON.parse(localStorage.getItem('authTokens'));
    return tokens ? tokens : { access: '', refresh: '' }; // Fallback if not found
  };

  const authTokens = getAuthTokens();

  // Function to fetch data on component mount
  const fetchData = async () => {
    try {
      const result = await axios.get('http://127.0.0.1:8000/api/dashboard/', {
        headers: {
          'Authorization': `Bearer ${authTokens.access}`,
        },
      });
      setResponse(result.data.response);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResponse("Failed to fetch data. Please try again.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post('http://127.0.0.1:8000/api/dashboard/', { text }, {
        headers: {
          'Authorization': `Bearer ${authTokens.access}`,
        },
      });
      setResponse(result.data.response);
    } catch (error) {
      console.error("Error submitting text:", error);
      setResponse("Failed to submit text. Please try again.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className='mt-5'>
      <h1>Dashboard</h1>
      <p>{response}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Dashboard;
