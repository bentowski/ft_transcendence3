import { Component, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

class Login extends Component<any, any> {
  remoteLogin = () => {
    fetch("http://localhost:3000/auth/login", { credentials: "include" }).then(
      (response) => {
        return response
          .json()
          .then((jsonResponse) => {
            console.log(jsonResponse);
          })
          .catch((err) => {
            console.log("Error: " + err);
          });
      }
    );
  };

  render() {
    return (
      <div>
        <a href="http://localhost:3000/auth/login">
          <button onClick={this.remoteLogin}>Login</button>
        </a>
      </div>
    );
  }
}
//<div>{this.msg}</div>
export default Login;
