import React from "react";
import {
  CombinedDataProvider,
  LogoutButton,
  useSession,
  Text,
} from "@inrupt/solid-ui-react";
import "./App.css";
import Login from "./components/Login";
import TodoList from "./components/TodoList";

function App() {
  const { session } = useSession();
  if (!session.info.isLoggedIn) {
    return <Login />;
  }

  return (
    <div className="App">
      <div className="login-container">
        <div className="logged-in-message">
          {session.info.webId ? (
            <CombinedDataProvider
              datasetUrl={session.info.webId}
              thingUrl={session.info.webId}
            >
              <Text property="http://www.w3.org/2006/vcard/ns#fn" />
            </CombinedDataProvider>
          ) : null}
          <LogoutButton />
        </div>
      </div>
      <TodoList />
    </div>
  );
}

export default App;
