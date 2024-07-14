import { useState } from 'react';
import CryptoJS from 'crypto-js';
import './App.css';

function App() {
  const [password, setPassword] = useState("");
  const [str, setStr] = useState("Please enter the password to check how many data leaks it has been disclosed in.");
  const [isHighCount, setIsHighCount] = useState(false);

  function handleInputChange(e) {
    setPassword(e.target.value);
  }

  function output(e) {
    e.preventDefault();
    const hash = CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex);
    const pre_hash = hash.slice(0, 5);
    const post_hash = hash.slice(5).toUpperCase();
    const API_URL = `https://api.pwnedpasswords.com/range/${pre_hash}`;

    fetch(API_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(data => {
        const lines = data.split('\n');
        const match = lines.find(line => line.startsWith(post_hash));

        if (match) {
          const count = parseInt(match.split(':')[1], 10);
          setStr(`Password found ${count} times in data breaches.`);
          setIsHighCount(count > 1000);
        } else {
          setStr("Password not found in any known data breaches.");
          setIsHighCount(false);
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        setStr('There was an error checking the password.');
        setIsHighCount(false);
      });
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Check Password Leaks</h1>
        <form className="form" onSubmit={output}>
          <div className="form-group">
            <label htmlFor="password" className="label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={handleInputChange}
              required
              className="input"
              placeholder="Enter password here"
            />
          </div>
          <button type="submit" className="button">Submit</button>
        </form>
        <p className={`result ${isHighCount ? 'high' : 'low'}`}>{str}</p>
      </div>
    </div>
  );
}

export default App;
