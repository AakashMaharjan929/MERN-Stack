import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import backgroundimg from '../images/backgroundimg.png';
import loginCSS from '../css/login.module.css';

const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
});

function LoginComponent() {
  window.history.pushState(null, null, '/');

  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const login = (data) => {
    axios.post('http://localhost:4444/login', data)
      .then(response => {
        if (response.data.Login === true) {
          // Login successful
          if (response.data.role === "admin") {
            navigate('/admin');
          } else {
            navigate('/');
          }
        } else {
          // Login failed
          if (response.data.errorMessage) {
            // Use the specific error message from the server, if available
        
            setErrorMessage('Invalid email or password');
          } else {
            // Default error message for invalid credentials
            setErrorMessage(response.data.errorMessage);
          }
        }
        console.log(response);
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.errorMessage) {
          setErrorMessage(error.response.data.errorMessage);
        } else {
          setErrorMessage('Invalid email or password.');
        }
        console.log(error);
  
      });
  }
  

  return (
    <div className={loginCSS.container}>
      <img src={backgroundimg} alt="" className={loginCSS['background-img']} />

      <div className={loginCSS.login} id="login">
        <h2>Login</h2>
        <hr />
        <form onSubmit={handleSubmit(login)} id="login-form">
          <input type="email" placeholder="Email" id="email" className={loginCSS.input} {...register("email")} />
          {errors.email && <p className='text-danger'>{errors.email.message}</p>}

          <input type="password" placeholder="Password" id="password" className={loginCSS.input} {...register("password")} />
          {errors.password && <p className='text-danger'>{errors.password.message}</p>}
          

          <div className={loginCSS.loginfeatures}>
            <div className={loginCSS.rememberme}>
              {/* <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label> */}
            </div>
            <Link to="#">Forgot password?</Link>
          </div>
          <br />
          <div className={loginCSS.submit}>
            <button type="submit">Submit</button>
          </div>
        </form>
        {errorMessage && <p className='text-danger'>{errorMessage}</p>}
        <p>Don't have an account yet? <Link to="/signup" style={{color:'white', marginLeft:'1rem'}}>Register</Link></p>
      </div>
    </div>
  );
}

export default LoginComponent;


