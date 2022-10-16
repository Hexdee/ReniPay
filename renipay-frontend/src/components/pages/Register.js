import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export const Register = () => {
    const navigate = useNavigate();
    const [first_name, setFirst_name] = useState();
    const [last_name, setLast_name] = useState();
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const register = async() => {
        try {
            const formData = {
                first_name,
                last_name,
                username,
                email,
                password
            }
            const response = await fetch("http://localhost:4001/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            const token = (await response.json()).token;
            localStorage.setItem('user_token', token);
            // alert("Registration successful!");
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
                <p>Please fill in this form to create an account.</p>


                <label htmlFor="fname"><b>First name:</b></label>
                <input 
                    type="text" 
                    placeholder="Enter first name" 
                    name="fname" 
                    id="fname"
                    onChange={(e) => {setFirst_name(e.target.value)}}
                />
                <label htmlFor="lname"><b>Last name:</b></label>
                <input 
                    type="text" 
                    placeholder="Enter last name" 
                    name="lname" 
                    id="lname"
                    onChange={(e) => {setLast_name(e.target.value)}}
                />
                <label htmlFor="username"><b>Username:</b></label>
                <input 
                    type="text" 
                    placeholder="Enter username" 
                    name="username" 
                    id="username"
                    onChange={(e) => {setUsername(e.target.value)}}
                />
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

                <p>By creating an account you agree to our <a href="#">Terms & Privacy</a>.</p>

                <button type="button" className="registerbtn" onClick={register}>Register</button>
            </div>
  
            <div className="container signin">
                <p>Already have an account? <a href="/login">Sign in</a>.</p>
            </div>
        </form>
    </main>
    
  )
}
