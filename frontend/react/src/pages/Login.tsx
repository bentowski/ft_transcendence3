import { Component } from "react";

class Login extends Component<any, any> {
  /*
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
   */

  render() {
    return (
      <div>
        <a href="http://localhost:3000/auth/login">Click here for login</a>
      </div>
    );
  }
}
export default Login;
