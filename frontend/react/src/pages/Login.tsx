import Request from "../components/utils/Requests";
import { Component } from "react";
// import { AuthContext } from "../context/AuthContext";

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

    //<a href="https://api.intra.42.fr/oauth/authorize?client_id=0ca73eb0dd76ab61dabb62b46c3a31885e924d813db06a480056b2080f9b0126&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fredirect&response_type=code">
    //</a>

    /*
    remoteLogin = async () => {
        let result = await Request(
            "GET",
            {},
            {},
            "http://localhost:3000/auth/login"
        )
    }
     */

    render() {
    return (
      <div>
          <a href='http://localhost:3000/auth/login'>
            <button>Login</button>
          </a>
      </div>
    );
  }
}
//onClick={() => window.location.href = 'http://localhost:3000/auth/login'


//<div>{this.msg}</div>
export default Login;
