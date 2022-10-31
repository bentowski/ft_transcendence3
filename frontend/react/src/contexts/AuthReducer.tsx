const AuthReducer = (state: any, action: any) => {
    switch(action.type) {
        case "LOGIN_START":
            return {
                user: null,
                isAuth: null,
                error: false,
            }
        case "LOGIN_SUCCESS":
            return {
                user: action.payload,
                isAuth: true,
                error: false,
            }
        case "LOGIN_FAILURE":
            return {
                user: null,
                isAuth: false,
                error: action.payload,
            }
        default:
            return state;
    }
}
export default AuthReducer;