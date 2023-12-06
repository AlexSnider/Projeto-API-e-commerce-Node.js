import "./App.css";
import { useState } from "react";
import Axios from "axios";

function App() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const [userNameLogin, setUserNameLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");

  const [loginStatus, setLoginStatus] = useState(false);

  Axios.defaults.withCredentials = true;

  const register = () => {
    Axios.post("http://localhost:3002/register", {
      username: userName,
      password: password,
    }).then((res) => {
      console.log(res);
    });
  };

  const login = () => {
    Axios.post("http://localhost:3002/login", {
      username: userNameLogin,
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
    Axios.get("http://localhost:3002/isAuth", { headers: {
      "x-access-token": localStorage.getItem("token")
    }}).then((res) => {
      if (res.data.loggedIn == true) {
        console.log(res.data);
        setLoginStatus(res.data.username);
      }
    });
  }

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
        <label>Login Name</label>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUserNameLogin(e.target.value)}
        />
        <label>Password</label>
        <input
          type="text"
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
