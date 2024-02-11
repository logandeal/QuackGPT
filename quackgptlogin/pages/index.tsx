export default function Home(){
  return(
    <div>
      <h1>
        Register
      </h1>
      <form action ="/api/register" method = "post">
        <label>
          Username
        </label>
        <input type='username' name='username' placeholder ='Username'></input>
        <label>
          Password
        </label>
        <input type='password' name='password' placeholder="Password"></input>
        <input type='submit' value='Register'></input>
      </form>

      <h1>Login</h1>
      <form action="/api/login" method="post">
        <label>
          Username
        </label>
        <input type='username' name='username' placeholder ='Username'></input>
        <label>
          Password
        </label>
        <input type='password' name='password' placeholder="Password"></input>
        <input type='submit' value='Login'></input>
      </form>
    </div>
  )
}