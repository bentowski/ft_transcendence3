import * as React from "react";
import {useAuthData} from "../contexts/AuthProviderContext";

export const useCurrentUser = () => {
  const { user } = useAuthData();
  return user;
};
export default useCurrentUser;