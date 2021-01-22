import React from "react";
import Login from "./login";
import Logout from "./logout";

import { useAuth0 } from "@auth0/auth0-react";

const AuthButton = () => {
  const { isAuthenticated } = useAuth0();

  return isAuthenticated ? <Logout/> : <Login/>;
};

export default AuthButton;