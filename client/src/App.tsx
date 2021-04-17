import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { HomePage } from "./pages/homepage/HomePage";
import { Dashboard } from "./pages/dashboard/Dashboard";
import "./App.css";
import CreateAccount from "./pages/createaccount/CreateAccount";
import { ImportAccount } from "./pages/importaccount/ImportAccount";

function Home() {
  return <h2>Home</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

export const App: React.FunctionComponent = () => {
  return (
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
  );
};
