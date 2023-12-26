import "./App.css";
import { useState } from "react";
import Axios from "axios";

function App() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [userNameLogin, setUserNameLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");

  const [loginStatus, setLoginStatus] = useState(false);

  Axios.defaults.withCredentials = true;

  const register = () => {
    Axios.post("http://localhost:3002/register", {
      username: userName,
      email: email,
      password: password,
    }).then((res) => {
      console.log(res);
    });
  };

  const login = () => {
    Axios.post("http://localhost:3002/login", {
      username: userNameLogin,
      email: email,
      password: passwordLogin,
    }).then((res) => {
      if (!res.data.auth) {
        setLoginStatus(false);
      } else {
        console.log(res.data);
        localStorage.setItem("token", res.data.token);
        setLoginStatus(true);
      }
    });
  };

  const userAuthd = () => {
    Axios.get("http://localhost:3002/isAuth", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    }).then((res) => {
      if (res.data.loggedIn == true) {
        console.log(res.data);
        setLoginStatus(res.data.username);
      }
    });
  };

  /* useEffect(() => {
    Axios.get("http://localhost:3002/login").then((res) => {
      if (res.data.loggedIn == true) {
        setLoginStatus(res.data.username);
      }
    });
  }, []); */

  return (
    <div className="app">
      <h1>Register</h1>
      <div>
        <label>Username</label>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUserName(e.target.value)}
        />
        <label>Email</label>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input
          type="text"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={register}>Cadastrar</button>
      </div>

      <div className="login">
        <h1>Login</h1>
        <label>Login</label>
        <input
          type="text"
          placeholder="Username or Email"
          onChange={(e) => setUserNameLogin(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPasswordLogin(e.target.value)}
        />
      </div>

      <button onClick={login}>Login</button>

      {loginStatus && <button onClick={userAuthd}>Check Auth</button>}
    </div>
  );
}

export default App;
