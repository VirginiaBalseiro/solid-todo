import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { SessionProvider } from "@inrupt/solid-ui-react";

ReactDOM.render(
  <React.StrictMode>
    <SessionProvider sessionId="solid-todo">
      <App />
    </SessionProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
