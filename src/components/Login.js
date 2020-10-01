import React from "react";
import { LoginButton } from "@inrupt/solid-ui-react";

export default function Login() {
  return (
    <div className="login-container">
      <LoginButton
        className="login-btn"
        oidcIssuer={"https://inrupt.net"}
        redirectUrl={window.location.href}
      />
    </div>
  );
}
