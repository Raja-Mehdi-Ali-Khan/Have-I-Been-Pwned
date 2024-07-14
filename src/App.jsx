import { useState } from 'react';
import CryptoJS from 'crypto-js';
import './App.css';

function App() {
  const [password, setPassword] = useState("");
  const [str, setStr] = useState("Please enter the password to check how many data leaks it has been disclosed in.");
  const [isHighCount, setIsHighCount] = useState(false);
  const [view, setView] = useState("password");

  function handleInputChange(e) {
    setPassword(e.target.value);
  }

  function handleView(e) {
    e.preventDefault();
    setView(view === "password" ? "text" : "password");
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
        <p className="info">
          Pwned Passwords is a cybersecurity tool that checks if your password has been compromised in data breaches.The database's integrity is maintained with contributions from global law enforcement agencies like the FBI and the National Crime Agency (NCA), making it a trusted resource.
        </p>
        <form className="form" onSubmit={output}>
          <div className="form-group">
            <label htmlFor="password" className="label">Password</label>
            <div className="input-container">
              <input
                id="password"
                name="password"
                type={view}
                value={password}
                onChange={handleInputChange}
                required
                className="input"
                placeholder="Enter password here"
              />
              <button className="view-button" onClick={handleView}>
                {view === "password" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
                    <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button type="submit" className="button">Submit</button>
        </form>
        <p className={`result ${isHighCount ? 'high' : 'low'}`}>{str}</p>
      </div>
    </div>
  );
}

export default App;
