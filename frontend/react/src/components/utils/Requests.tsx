import {useAuthData} from "../../contexts/AuthProviderContext";

const Logout = async () => {
  const { userAuthentication } = useAuthData();

  await fetch("http://localhost:3000/auth/logout", {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          userAuthentication(false);
          //navigate("/login")
          return ;
        }
      })
      .catch((error) => {
        console.log("some shit happened");
        userAuthentication(false);
        //navigate("/login")
        return ;
      });
}

const Request = async (type: string, headers: any, body: any, url: string) => {
    console.log(url);
    if (type === "GET") {
      const response: any = await fetch(url, {
        method: type,
        credentials: "include",
        headers: headers,
      });
      if (response.ok) {
        const res = await response.json();
        //console.log('response = ', res);
        return res;
      } else {
        const err: any = await response.json();
        if (err.statusCode === 401) {
          await Logout();
        }
        throw err;
      }

    } else {
      const response: any = await fetch(url, {
        method: type,
        headers: headers,
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (response.ok) {
        const res = await response.json();
        return res;
      } else {
        const err: any = await response.json();
        if (err.statusCode === 401) {
          await Logout();
        }
        throw err;
      }
    }
}
export default Request;
