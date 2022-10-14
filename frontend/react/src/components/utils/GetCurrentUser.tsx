import * as React from "react";

export const GetCurrentUser = () => {
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    fetch("http://localhost:3000/user", { credentials: "include" }).then((x) =>
      x.json().then((y) =>
        x.json().then((y) => {
          setUser(y.user);
          setLoading(false);
        })
      )
    );
  }, []);

  if (loading) {
    return <div>loading...</div>;
  }

  if (!user) {
    return <div>unknown user</div>;
  }

  return <div>got user</div>;
};
