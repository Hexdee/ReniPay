import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { reniapi } from '../utils/renipay';

export const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const authenticate = async() => {
        try {
            const formData = {
                email,
                password
            }
            const response = await fetch("https://renipay.herokuapp.com/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            const token = (await response.json()).token;
            localStorage.setItem('user_token', token);
            // alert("Login successful!");
            navigate("/profile");
        } catch(error) {
            console.log(error);
            alert('an error occured');
        }
    }
  return (
    <main>
        <form>
            <div className="container">
                <h1>Welcome to ReniPay</h1>
                <p>Enter your account details to login.</p>

                <label htmlFor="email"><b>Email</b></label>
                <input 
                    type="text" 
                    placeholder="Enter Email" 
                    name="email" 
                    id="email"
                    onChange={(e) => {setEmail(e.target.value)}}
                />

                <label htmlFor="psw"><b>Password</b></label>
                <input 
                    type="password" 
                    placeholder="Enter Password" 
                    name="psw" 
                    id="psw" 
                    onChange={(e) => {setPassword(e.target.value)}}
                />

                <button type="button" className="registerbtn" onClick={()=> authenticate()}>Login</button>
            </div>
  
            <div className="container signin">
                <p>Don't have an account? <a href="/register">Register</a>.</p>
            </div>
        </form>
    </main>
  )
}
