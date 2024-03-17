import React from 'react'

export default function Home(){
  return (
    <>
      <div>
        <h1>
          Register
        </h1>
        <form action ="/api/register" method="POST">
          <label>
            Username
          </label>
          <input type='text' name='username' placeholder ='Username' required></input>
          <label>
            Password
          </label>
          <input type='password' name='password' placeholder="Password" required></input>
          <input type='submit' value='Register'></input>
        </form>

        <h1>Login</h1>
        <form action="/api/login" method="POST">
          <label>
            Username
          </label>
          <input type='text' name='username' placeholder ='Username' required></input>
          <label>
            Password
          </label>
          <input type='password' name='password' placeholder="Password" required></input>
          <input type='submit' value='Login'></input>
        </form>
      </div>
    </>
  )
}