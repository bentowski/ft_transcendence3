export const LoginStart = (userCredentials: any) => ({
    type: "LOGIN_START",
});

export const LoginSuccess = (user: any) => ({
    type: "LOGIN_SUCCESS",
    payload: user,
    isAuth: true,
});

export const LoginFailure = (error: any) => ({
    type: "LOGIN_FAILURE",
    payload: error,
    isAuth: false,
})
