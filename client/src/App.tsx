import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { HomePage } from "./pages/homepage/HomePage";
import { Dashboard } from "./pages/dashboard/Dashboard";
import "./App.css";
import CreateAccount from "./pages/createaccount/CreateAccount";
import { ImportAccount } from "./pages/importaccount/ImportAccount";
import { AddFriends } from "./pages/addfriends/AddFriends";
import { globalStyles } from "./assets/styles";
import background from "./assets/cryptobackground.jpg";

function Home() {
  return <h2>Home</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

export const App: React.FunctionComponent = () => {
  return (
    <div
      style={{
        // backgroundImage: `url(${background})`,
        backgroundColor: globalStyles.colors.background,
        width: "100%",
        height: "100%",
        color: globalStyles.colors.text,
      }}
    >
      <Router>
        <Switch>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/importAccount">
            <ImportAccount />
          </Route>
          <Route path="/createAccount">
            <CreateAccount />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};
