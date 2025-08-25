import React, { useState, useEffect } from 'react';
import backgroundimg from '../images/backgroundimg.png';
import loginCSS from '../css/login.module.css';
import '../css/login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';



const signupSchema = yup.object().shape({
  username: yup.string()
    .required('Username is required')
    .matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/, 'Username cannot be only numbers'),
  password: yup.string()
    .required('Password is required')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, 'Password must be at least 8 characters long and contain at least one letter, one number, and one special character'),
  enterpassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup.string().required('Phone is required')
});

function SignUpComponent() {

  window.history.pushState(null, null, '/');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');






  const signup = async (data) => {
    try {
      const response = await axios.get('http://localhost:4444/signup/find');
      const users = response.data;
      const emailExists = users.some(user => user.email === data.email);

      if (emailExists) {
        Swal.fire({
          icon: 'error',
          title: 'Email Already Exists',
          text: 'This email is already registered. Please use a different email.',
        });
        return;
      }
      const signupResponse = await axios.post('http://localhost:4444/signup', data);
      console.log(signupResponse);
      navigate('/login');
      Swal.fire({
        icon: 'success',
        title: 'Signup Successful',
        text: 'You have successfully signed up!',
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
    <div className='container1'>
    <img src={backgroundimg} alt="" className='background-img' />
    <div className="signup" id="signup1">
      <h2>Sign Up</h2>
      <hr />
      <form onSubmit={handleSubmit(signup)} id="signup-form">
        <input type="text" placeholder="Username" id="signup-username" name='username' {...register("username")} /><br />
        {errors.username && <p className='text-danger' style={{marginTop:"-1rem"}}>{errors.username.message}</p>}
        
        <input type="password" placeholder="Password" id="signup-password" name='password' {...register("password")} /><br />
        {errors.password && <p className='text-danger' style={{marginTop:"-1rem"}}>{errors.password.message}</p>}
        
        <input type="password" placeholder="Re enter password" id="re-enterPassword" name='enterpassword' {...register("enterpassword")} /><br />
        {errors.enterpassword && <p className='text-danger' style={{marginTop:"-1rem"}}>{errors.enterpassword.message}</p>}

        <input type="email" placeholder="Email" id="email" name='email' {...register("email")} /><br />
        {errors.email && <p className='text-danger' style={{marginTop:"-1rem"}}>{errors.email.message}</p>}

        <input type="text" placeholder="Phone" id="phone" name='phone' {...register("phone")} /><br />
        {errors.phone && <p className='text-danger' style={{marginTop:"-1rem"}}>{errors.phone.message}</p>}
   
        <div className="loginfeatures">
          <div className="rememberMe" style={{display: 'flex', justifyContent: 'center', alignItems:'center'}}>
            {/* <input type="checkbox" id="signup-remember" />&nbsp;
            <label htmlFor="signup-remember">Remember me</label> */}
          </div>
          <a href="#">Forgot password?</a>
        </div>
        <br />
        <div className="submit">
          <button type="submit">Submit</button>
        </div>
      </form>
      <p>Already have an account?<button id="login-btn"><Link to="/login" style={{color: 'white'}}>Log in</Link></button></p>
    </div>
    
    </div>
    </>
  );

}

export default SignUpComponent;
