import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './Login.css'; // CSS-Datei für zentriertes Styling
const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: 'jorgo',
    password: 'your_password'
  });
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { username, password } = formData;
  const apiUrl = process.env.REACT_APP_API_URL;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const response = await fetch('http://${apiUrl}/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) {
        setError(true);
        setErrorMessage(data.errors[0].msg);
      } else {
        setError(false);
        setErrorMessage('');
        // Token im lokalen Speicher speichern
        localStorage.setItem('token', data.token);
        localStorage.setItem('username',username)
        onLogin(data); // Aufruf der onLogin Prop mit den Benutzerdaten
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // return (
  //   <div>
  //     <h2>Login</h2>
  //     {error && <p style={{ color: 'red' }}>{errorMessage}</p>}
  //     <form onSubmit={onSubmit}>
  //       <div>
  //         <input
  //           type='text'
  //           placeholder='Username'
  //           name='username'
  //           value={username}
  //           onChange={onChange}
  //           required
  //         />
  //       </div>
  //       <div>
  //         <input
  //           type='password'
  //           placeholder='Password'
  //           name='password'
  //           value={password}
  //           onChange={onChange}
  //           minLength='6'
  //           required
  //         />
  //       </div>
  //       <input type='submit' value='Login' />
  //     </form>
  //   </div>
  // );

  return(
    <div className="login-container">
      {error && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <Card style={{ width: '30rem' ,justifyContent: 'center', alignItems:'center'}}>
        <Card.Img style={{ width: '15rem' , justifyContent: 'center', alignItems:'center', paddingTop:'1rem'}} variant="top" src="./logo.png" />
        <Card.Body>
          <form onSubmit={onSubmit}>
            <div>
              <input
                type='text'
                placeholder='Username'
                name='username'
                value={username}
                onChange={onChange}
                required
              />
            </div>
            <div style={{paddingBottom:'2rem'}}>
              <input
                type='password'
                placeholder='Password'
                name='password'
                value={password}
                onChange={onChange}
                minLength='6'
                required
              />
            </div>
            <input type='submit' value='Login'/>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
