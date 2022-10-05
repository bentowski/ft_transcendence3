// import React from 'react';

// const Auth = () => {
//     return (
//         <div>
//
//         </div>
//     );
// };

const Login = () => {
  return (
    <div>
      <a href="https://api.intra.42.fr/oauth/authorize?client_id=0ca73eb0dd76ab61dabb62b46c3a31885e924d813db06a480056b2080f9b0126&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fredirect&response_type=code">
        <button>Login</button>
      </a>
    </div>
  );
};

export default Login;
