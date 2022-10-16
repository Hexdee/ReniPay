import React, { useEffect, useState } from 'react'

export const Profile = () => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getUser();
  }, [])

  const getUser = async () => {
    try {
      const token = localStorage.getItem('user_token');
      const res = await fetch("https://renipay.herokuapp.com/auth", {
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token
        })
      })
      const user = await res.json();
      setUser(user);
      console.log("usr", user);

      setIsLoading(false);

    } catch (err) {
      window.location.href = "/login"
    }
  }

  const logout = () => {
    localStorage.removeItem("user_token");
    window.location.href = '/login'
  }

  return (
    !isLoading &&
    <main className='container'>
        <h1><span id="username">{user.first_name} {user.last_name}</span></h1>
        <p>Balance: <strong>$<span id="balance">{user.balance || 0}</span></strong></p>
        <p>Payment Link: <a href={`https://https://renipay.herokuapp.com/${user.username}`}>{`https://renipay.herokuapp.com/${user.username}`}</a></p>
        <p className='logout' onClick={logout}>logout</p>
    </main>
  )
}
