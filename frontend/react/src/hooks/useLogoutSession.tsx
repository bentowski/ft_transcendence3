import {useAuthData} from "../contexts/AuthProviderContext";

const useLogoutSession = async () => {
    /*
    const { setUser, setIsToken, setIsAuth, setIsTwoFa } = useAuthData();
    //console.log("loging out");
    await fetch("http://localhost:3000/auth/logout", {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((data) => {
            //console.log("response logout = ", data);
            if (data.status === 200) {
                //console.log("yey");
                setUser(undefined);
                setIsAuth(false);
                setIsToken(false);
                setIsTwoFa(false);
            }
        })
        .catch((error) => {
            console.log("some shit happened");
        });
    window.location.reload()
     */
};
export default useLogoutSession;